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

export const addtocart = async ({ userEmail, product }) => {
  try {
    const { doc, getDoc, setDoc, collection } = storeactions;
    const cartRef = doc(collection(firestore, 'cart'), userEmail);
    const cartDoc = await getDoc(cartRef);
    const documentData = cartDoc.data();

    const existingItems = documentData.items;
    existingItems.push({ productid: nanoid(), ...product });

    const updatedDoc = {
      ...documentData,
      items: existingItems,
    };

    await setDoc(cartRef, updatedDoc);

    return { message: 'Adedd Successfully' };
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const removefromcart = async ({ userEmail, productid }) => {
  try {
    const { doc, getDoc, setDoc, collection } = storeactions;
    const cartRef = doc(collection(firestore, 'cart'), userEmail);
    const cartDoc = await getDoc(cartRef);
    const documentData = cartDoc.data();

    const existingItems = documentData.items;

    remove(existingItems, (item) => item.productid === productid);

    const updatedDoc = {
      items: existingItems,
    };

    await setDoc(cartRef, updatedDoc);
    return existingItems;
  } catch (err) {
    console.log(err);
    return err;
  }
};
