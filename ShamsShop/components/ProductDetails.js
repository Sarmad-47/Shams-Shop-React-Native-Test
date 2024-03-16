import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const ProductDetails = ({ navigation, route }) => {
  const { product } = route.params;

  const addToCart = async () => {
    try {
      // Check if the item already exists in the cart
      const cartQuerySnapshot = await getDocs(collection(db, "Cart"));
      const cartItems = [];
      cartQuerySnapshot.forEach((doc) => {
        cartItems.push(doc.data());
      });

      const isItemInCart = cartItems.some((item) => item.id === product.id);

      if (isItemInCart) {
        Alert.alert(
          "Item Already in Cart",
          "This item is already in your cart."
        );
      } else {
        // Item is not in the cart, so add it
        const cartRef = collection(db, "Cart");
        await addDoc(cartRef, { ...product });
        Alert.alert("Success", "Item has been added to the cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.productName}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.price}>
        <Text style={styles.bold}>${product.price}</Text>
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
          <MaterialIcons name="add-shopping-cart" size={24} color="white" />
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.goBackButton}
        >
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    textAlign: "center",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    marginBottom: 20,
  },
  bold: {
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
  },
  goBackButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    width: "45%",
  },
  goBackText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
});

export default ProductDetails;
