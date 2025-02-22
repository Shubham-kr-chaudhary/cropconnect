import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/marketplace");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md mt-20">
      <h2 className="text-2xl font-bold">Login</h2>
      <form onSubmit={handleLogin} className="mt-4">
        <input type="email" placeholder="Email" className="w-full p-2 border mt-2"
          onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-2 border mt-2"
          onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white p-2 mt-4">Login</button>
      </form>
    </div>
  );
}
