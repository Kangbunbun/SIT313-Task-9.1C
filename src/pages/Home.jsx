import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [name, setName] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setName(user.firstName + " " + user.lastName);
    } else {
      nav("/login"); // nếu chưa login thì quay lại login
    }
  }, [nav]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    nav("/login");
  };

  return (
    <div className="wrap">
      <div className="card">
        <h1>Home</h1>
        <p>Welcome, {name}</p>
        <button className="btn" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </div>
  );
}
