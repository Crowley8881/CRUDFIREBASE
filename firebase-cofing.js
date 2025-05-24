import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";

// Adicione isso aqui no topo de products.js
const firebaseConfig = {
    apiKey: "AIzaSyCXisc0WlsrTmZyaazau4_USCYO70SZROY",
    authDomain: "introfirebase-c5c6b.firebaseapp.com",
    projectId: "introfirebase-c5c6b",
    storageBucket: "introfirebase-c5c6b.firebasestorage.app",
    messagingSenderId: "622056478024",
    appId:"1:622056478024:web:3aaf0e963f647bee310f7d",
    measurementId: "G-WGH4CW8E2T"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);