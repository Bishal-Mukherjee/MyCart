import { auth, firestore, storeactions } from '../firebase/firebase';

export const signin = async ({ email, password }) => {
  try {
    const { getAuth, signInWithEmailAndPassword } = auth;
    const authInstance = getAuth();
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    return userCredential;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const signup = async ({ name, email, password }) => {
  try {
    const { getAuth, createUserWithEmailAndPassword } = auth;
    const { doc, setDoc, collection } = storeactions;

    const authInstance = getAuth();
    const userCredentials = await createUserWithEmailAndPassword(authInstance, email, password);

    if (userCredentials.user) {
      const cartRef = doc(collection(firestore, 'cart'), email);
      await setDoc(cartRef, { items: [] });

      const userRef = doc(collection(firestore, 'users'), email);
      await setDoc(userRef, { name, email });
    }

    return userCredentials;
  } catch (err) {
    console.log(err);
    return err;
  }
};
