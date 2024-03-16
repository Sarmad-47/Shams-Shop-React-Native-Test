import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import ProductDetails from "./ProductDetails";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const Stack = createStackNavigator();

const ViewProduct = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State for refreshing

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Products"));
      const productsData = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Finish refreshing
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteDoc(doc(db, "Products", productId));
      console.log("Product deleted successfully:", productId);
      // After deleting, you can also refresh the product list
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("ProductDetails", { product: item })}
      >
        <View style={styles.productInfo}>
          <Text style={styles.title}>{item.productName}</Text>
          <Text>Price: ${item.price}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  /**
   * This is added to refresh the data whenever a new data is added.
   * It will fetch all the data again.
   */

  const onRefresh = () => {
    setRefreshing(true); // Start refreshing
    fetchProducts();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } // Added RefreshControl
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 16,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    width: "80%",
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  productInfo: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

/**
 *
 * This is done to navigate to ProductsDetails screen through View Product
 */
const ViewProductWithStackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="View Product"
        component={ViewProduct}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ViewProductWithStackNavigation;
