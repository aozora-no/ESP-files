// led-control.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

// Firebase config
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

document.addEventListener("DOMContentLoaded", () => {
  const ledToggle = document.getElementById("ledToggle");
  const ledStatus = document.getElementById("ledStatus");

  if (!ledToggle || !ledStatus) {
    console.error("LED toggle or status element not found in DOM.");
    return;
  }

  const ledRef = ref(db, "led/state");

  /* 🔁 REALTIME LISTENER */
  onValue(
    ledRef,
    (snapshot) => {
      const state = snapshot.val();
      const isOn = state === 1 || state === "1" || state === true;

      ledToggle.checked = isOn;
      ledStatus.textContent = isOn ? "LED is ON" : "LED is OFF";

      // ✅ CONSOLE LOG (DB → UI)
      console.log(
        isOn
          ? "🔥 LED TURNED ON (DB update)"
          : "❄️ LED TURNED OFF (DB update)",
        "| Raw value:",
        state
      );
    },
    (error) => {
      console.error("onValue failed:", error);
    }
  );

  /* 👆 USER TOGGLE HANDLER */
  ledToggle.addEventListener("change", async () => {
    const value = ledToggle.checked ? 1 : 0;

    // ✅ CONSOLE LOG (UI → DB)
    console.log(
      value === 1
        ? "👆 User switched LED ON"
        : "👆 User switched LED OFF"
    );

    try {
      await set(ledRef, value);
      console.log("✅ Database updated with value:", value);
    } catch (err) {
      console.error("❌ Failed to write to DB:", err);

      alert("Failed to update the database. Check console.");

      // Optional: restore state from DB
      onValue(
        ledRef,
        (snapshot) => {
          const s = snapshot.val();
          const restoreOn = s === 1 || s === "1" || s === true;
          ledToggle.checked = restoreOn;
          ledStatus.textContent = restoreOn ? "LED is ON" : "LED is OFF";
          console.warn("↩️ UI restored from DB value:", s);
        },
        { onlyOnce: true }
      );
    }
  });
});
