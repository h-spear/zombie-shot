// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyB4PUuIUuxgApIgq_KHkwq0bZ9ODXNBDd0',
    authDomain: 'zombie-shot-12e8f.firebaseapp.com',
    projectId: 'zombie-shot-12e8f',
    storageBucket: 'zombie-shot-12e8f.appspot.com',
    messagingSenderId: '841222356163',
    appId: '1:841222356163:web:6d9085b9b0bef7f31db676',
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const db = app.firestore();
