import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function Home() {
  const [name, setName] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setName(u?.displayName || u?.email || "");
    });
    return () => unsub();
  }, []);

  return (
    <div className="wrap">
      <div className="card">
        <h1>Home</h1>
        <p>Welcome, {name}</p>
      </div>
    </div>
  );
}
