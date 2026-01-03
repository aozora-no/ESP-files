import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

// Firebase config (same project as ESP32)
const firebaseConfig = {
  apiKey: "AIzaSyBRwMI9Hf8vVjC3nc4MdqJA8ggmsfhCxPM",
  authDomain: "esp32-8afec.firebaseapp.com",
  databaseURL: "https://esp32-8afec-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "esp32-8afec",
  storageBucket: "esp32-8afec.firebasestorage.app",
  messagingSenderId: "96151551144",
  appId: "1:96151551144:web:e3c106cd36e6712bb7569d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// UI elements
const ledToggle = document.getElementById("ledToggle");
const ledStatus = document.getElementById("ledStatus");

// Database reference
const ledRef = ref(db, "led/state");

// Listen for LED state changes (real-time sync)
onValue(ledRef, (snapshot) => {
  const state = snapshot.val();
  ledToggle.checked = state === 1;
  ledStatus.textContent = state === 1 ? "LED is ON" : "LED is OFF";
});

// When user toggles switch
ledToggle.addEventListener("change", () => {
  set(ledRef, ledToggle.checked ? 1 : 0);
});
