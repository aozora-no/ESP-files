// led-control.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

// Firebase config (verify these in the Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyBRwMI9Hf8vVjC3nc4MdqJA8ggmsfhCxPM",
  authDomain: "esp32-8afec.firebaseapp.com",
  databaseURL: "https://esp32-8afec-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esp32-8afec",
  storageBucket: "esp32-8afec.firebasestorage.app",
  messagingSenderId: "96151551144",
  appId: "1:96151551144:web:e3c106cd36e6712bb7569d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
  const ledToggle = document.getElementById("ledToggle");
  const ledStatus = document.getElementById("ledStatus");
  if (!ledToggle || !ledStatus) {
    console.error('LED toggle or status element not found in DOM.');
    return;
  }

  const ledRef = ref(db, "led/state");

  // Listen for LED state changes (real-time sync)
  onValue(ledRef, (snapshot) => {
    const state = snapshot.val();
    // Accept 1, "1", true as ON
    const isOn = state === 1 || state === '1' || state === true;
    ledToggle.checked = !!isOn;
    ledStatus.textContent = ledToggle.checked ? "LED is ON" : "LED is OFF";
    console.log('Realtime DB value for led/state:', state);
  }, (error) => {
    console.error('onValue failed:', error);
  });

  // When user toggles switch
  ledToggle.addEventListener("change", async () => {
    const value = ledToggle.checked ? 1 : 0;
    try {
      await set(ledRef, value);
      console.log('Wrote value to DB:', value);
    } catch (err) {
      console.error('Failed to write to DB:', err);
      // Optional: revert UI to DB state to avoid showing wrong state
      try {
        // re-read once to restore UI
        onValue(ledRef, (snapshot) => {
          const s = snapshot.val();
          ledToggle.checked = (s === 1 || s === '1' || s === true);
          ledStatus.textContent = ledToggle.checked ? "LED is ON" : "LED is OFF";
        }, { onlyOnce: true });
      } catch (reErr) {
        console.warn('Also failed to re-read DB after write error:', reErr);
      }
      alert('Failed to update the database. See console for details.');
    }
  });
});