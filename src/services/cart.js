import { nanoid } from 'nanoid';
import { remove } from 'lodash';
import { storeactions, firestore } from '../firebase/firebase';

export const getcart = async (userEmail) => {
  try {
    const { doc, getDoc, collection } = storeactions;
    const cartRef = doc(collection(firestore, 'cart'), userEmail);
    const userCart = await getDoc(cartRef);
    const documentData = userCart.data();

    return documentData;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const myArray = new Array([1, 2, 2]);

export const addtocart = async ({ userEmail, product }) => {
  try {
    const { doc, getDoc, setDoc, collection } = storeactions;
    const cartRef = doc(collection(firestore, 'cart'), userEmail);
    const cartDoc = await getDoc(cartRef);
    const documentData = cartDoc.data();

    const existingItems = documentData.items;
    // check whether the product has already been added to the cart or not using the 'id',
    // if yes, increase the 'quantity' value by 1, each time, else, add the product to the cart

    if (existingItems.filter((item) => item.id === product.id).length > 0) {
      const reqProduct = existingItems
        .map((item, index) => ({
          index,
          ...item,
        }))
        .filter((item) => item.id === product.id)[0];

      const updatedProduct = {
        ...existingItems[reqProduct.index],
        quantity: reqProduct.quantity + 1,
      };

      existingItems[reqProduct.index] = updatedProduct;
      const updatedDoc = {
        ...documentData,
        items: existingItems,
      };

      await setDoc(cartRef, updatedDoc);
    } else {
      existingItems.push({ productid: nanoid(), ...product, quantity: 1 });

      const updatedDoc = {
        ...documentData,
        items: existingItems,
      };

      await setDoc(cartRef, updatedDoc);
    }

    return { message: 'Adedd Successfully' };
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const removefromcart = async ({ userEmail, product }) => {
  try {
    const { doc, getDoc, setDoc, collection } = storeactions;
    const cartRef = doc(collection(firestore, 'cart'), userEmail);
    const cartDoc = await getDoc(cartRef);
    const documentData = cartDoc.data();

    const existingItems = documentData.items;

    if (product.quantity > 1) {
      const reqProduct = existingItems
        .map((item, index) => ({
          index,
          ...item,
        }))
        .filter((item) => item.id === product.id)[0];

      const updatedProduct = {
        ...existingItems[reqProduct.index],
        quantity: reqProduct.quantity - 1,
      };

      existingItems[reqProduct.index] = updatedProduct;
      const updatedDoc = {
        ...documentData,
        items: existingItems,
      };

      await setDoc(cartRef, updatedDoc);
    } else {
      remove(existingItems, (item) => item.id === product.id);

      const updatedDoc = {
        items: existingItems,
      };

      await setDoc(cartRef, updatedDoc);
    }

    return existingItems;
  } catch (err) {
    console.log(err);
    return err;
  }
};
