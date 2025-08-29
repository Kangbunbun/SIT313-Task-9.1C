import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const cfg = {
  apiKey:             import.meta.env.VITE_FB_API_KEY,
  authDomain:         import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId:          import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket:      import.meta.env.VITE_FB_BUCKET,
  messagingSenderId:  import.meta.env.VITE_FB_SENDER,
  appId:              import.meta.env.VITE_FB_APP_ID,
};

const app = initializeApp(cfg);
export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

console.log("FB project check", {
  projectId: app.options.projectId,
  authDomain: app.options.authDomain,
  apiKey: (app.options.apiKey || "").slice(0, 8) + "…",
});
