import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
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
      const maxUsersRef = doc(db, 'appInfo', 'maxAccounts');
      const testResult = await getDoc(maxUsersRef);

      if (testResult.exists() && testResult.data().count > 0) {
        console.log(
          `you have ${testResult.data().count - 1} accounts remaining`
        );

        const collectionRef = collection(db, 'appInfo');
        await setDoc(doc(collectionRef, 'maxAccounts'), {
          count: testResult.data().count - 1,
        });
      } else if (testResult.exists() && testResult.data().count <= 0) {
        throw new Error('Account limit reached');
      } else {
        console.log(
          'Application encontered an issue while connecting to backend services'
        );
      }

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
        currency: 5,
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
