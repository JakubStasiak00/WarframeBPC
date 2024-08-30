import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { auth, db } from 'src/firebaseD/firebase-config';

export const useFirebaseStore = defineStore('firebaseUtils', () => {
  const userLogin = async (
    email: string,
    password: string,
    doesPersist: boolean
  ) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (!response) {
        throw new Error('login failed, try again later');
      }
      await setPersistence(
        auth,
        doesPersist ? browserLocalPersistence : browserSessionPersistence
      )
        .then(() => {
          console.log('persistance set');
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  const userRegister = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!response.user) {
        throw new Error('not created');
      }

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: username,
          photoURL:
            'https://firebasestorage.googleapis.com/v0/b/warframebpc.appspot.com/o/user-placeholder.jpg?alt=media&token=2e153f44-a117-4689-bfc3-4c175fd6a07c',
        });
      }

      const userInfoRef = doc(db, 'usersInfo', `${auth.currentUser?.uid}`);
      await setDoc(userInfoRef, {
        username: username,
        profilePicture:
          'https://firebasestorage.googleapis.com/v0/b/warframebpc.appspot.com/o/user-placeholder.jpg?alt=media&token=2e153f44-a117-4689-bfc3-4c175fd6a07c',
      })
        .then(() => {
          console.log('account created');
        })
        .catch(() => {
          throw new Error('Error while adding data to the database');
        });
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return { userRegister, userLogin };
});
