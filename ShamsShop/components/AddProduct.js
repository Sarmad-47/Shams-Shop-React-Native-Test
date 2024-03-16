import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isProductsAdded, setIsProductsAdded] = useState(false);

  const handleAddProduct = async () => {
    if (!productName || !description || !price) {
      return;
    }

    try {
      await addDoc(collection(db, "Products"), {
        productName,
        description,
        price: parseFloat(price),
      });
      setProductName("");
      setDescription("");
      setPrice("");
      setIsProductsAdded(true);
      setIsButtonDisabled(true);
      Alert.alert("Success", "Products have been added successfully!");
      
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  const checkFields = () => {
    setIsButtonDisabled(!(productName && description && price));
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <Text style={styles.logoText}>ADD PRODUCT</Text>
            <TextInput
              placeholder="Product Name"
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
              value={productName}
              onChangeText={(text) => {
                setProductName(text);
                checkFields();
              }}
            />
            <TextInput
              placeholder="Description"
              placeholderColor="#c4c3cb"
              style={[styles.loginFormTextInput, styles.multilineTextInput]}
              multiline={true}
              numberOfLines={4}
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                checkFields();
              }}
            />
            <TextInput
              placeholder="Price"
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
              keyboardType="numeric"
              value={price}
              onChangeText={(text) => {
                setPrice(text);
                checkFields();
              }}
            />
            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: isButtonDisabled ? "#ccc" : "#3897f1" },
              ]}
              onPress={handleAddProduct}
              disabled={isButtonDisabled}
            >
              <Text style={styles.buttonText}>Add Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    alignItems: "center",
  },
  loginScreenContainer: {
    flex: 1,
  },
  logoText: {
    fontSize: 40,
    fontWeight: "800",
    marginTop: 150,
    marginBottom: 30,
    textAlign: "center",
  },
  loginFormView: {
    flex: 1,
  },
  loginFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  multilineTextInput: {
    height: 80,
    textAlignVertical: "top",
  },
  loginButton: {
    borderRadius: 5,
    height: 45,
    marginTop: 10,
    width: 350,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 10,
  },
});

export default AddProduct;
