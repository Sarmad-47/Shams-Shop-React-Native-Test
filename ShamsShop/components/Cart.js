import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { collection, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../firebase";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [refreshing, setRefreshing] = useState(false); // State for refreshing

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [items]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchCartItems().then(() => {
      setRefreshing(false);
    });
  }, []);

  const fetchCartItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Cart"));
      const cartItems = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Set default quantity to 1 if qty is not present in the document
        const qty = data.qty || 1;
        cartItems.push({ id: doc.id, ...data, qty });
      });
      setItems(cartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const calculateTotalPrice = () => {
    let total = 0;
    items.forEach((item) => {
      total += item.price * item.qty;
    });
    setTotalPrice(total);
  };

  const handleAddQty = (cartId) => {
    // Accept cartId instead of id
    const updatedItems = items.map((item) =>
      item.id === cartId ? { ...item, qty: Math.min(item.qty + 1, 10) } : item
    );
    setItems(updatedItems);
  };

  const handleRemoveQty = (cartId) => {
    const updatedItems = items.map((item) =>
      item.id === cartId ? { ...item, qty: Math.max(item.qty - 1, 1) } : item
    );
    setItems(updatedItems);
  };

  const handleDeleteOrder = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Cart"));
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log("Cart deleted successfully.");
      setItems([]);
      setTotalPrice(0);
    } catch (error) {
      console.error("Error deleting cart:", error);
    }
  };

  const handleCheckout = () => {
    Alert.alert(
      "Checkout",
      "Order successfully placed! Products will be delivered soon.",
      [{ text: "OK", onPress: () => handleDeleteOrder() }]
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.itemName}>{item.productName}</Text>
      <Text style={styles.itemPrice}>${item.price * item.qty}</Text>

      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => handleRemoveQty(item.id)}>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.qty}</Text>
        <TouchableOpacity onPress={() => handleAddQty(item.id)}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item, index) => item.id + index}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <View style={styles.orderInfo}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalAmount}>${totalPrice}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleDeleteOrder}>
          <Text style={styles.buttonText}>Delete Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCheckout}>
          <Text style={styles.buttonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
  },
  cartItem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    fontSize: 20,
    paddingHorizontal: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Cart;
