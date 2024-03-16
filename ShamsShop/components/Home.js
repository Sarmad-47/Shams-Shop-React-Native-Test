import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AddProduct from "./AddProduct";
import ViewProduct from "./ViewProduct";
import Cart from "./Cart";
import { StatusBar } from "expo-status-bar";

const Drawer = createDrawerNavigator();

const Home = () => {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => {
            return (
              <SafeAreaView style={styles.drawerContainer}>
                <View style={styles.topContainer}>
                  <Image
                    source={require("../assets/images.png")}
                    style={styles.image}
                  />
                  <Text style={styles.text}>Shams Shop</Text>
                </View>
                <DrawerItemList {...props} />
              </SafeAreaView>
            );
          }}
          screenOptions={{
            drawerStyle: {
              backgroundColor: "#fff",
              width: 250,
            },
            headerStyle: {
              backgroundColor: "#006A42",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            drawerLabelStyle: {
              color: "#111",
            },
          }}
        >
          <Drawer.Screen
            name="Add Product"
            component={AddProduct}
            options={{
              drawerLabel: "Add Product",
              drawerIcon: () => (
                <MaterialIcons name="add" size={20} color="#808080" />
              ),
            }}
          />
          <Drawer.Screen
            name="View Product"
            component={ViewProduct}
            options={{
              drawerLabel: "View Product",
              drawerIcon: () => (
                <MaterialCommunityIcons
                  name="view-list"
                  size={20}
                  color="#808080"
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Cart"
            component={Cart}
            options={{
              drawerLabel: "View Cart",
              drawerIcon: () => (
                <FontAwesome name="shopping-cart" size={20} color="#808080" />
              ),
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    marginTop: 25,
  },
  topContainer: {
    height: 200,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#f4f4f4",
    borderBottomWidth: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 22,
    marginVertical: 6,
    fontWeight: "bold",
    color: "#111",
  },
});

export default Home;
