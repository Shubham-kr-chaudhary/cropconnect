import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [user, setUser] = useState({ name: "", email: "", password: "", role: "farmer" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", user);
      navigate("/login");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md mt-20">
      <h2 className="text-2xl font-bold">Register</h2>
      <form onSubmit={handleRegister} className="mt-4">
        <input type="text" placeholder="Name" className="w-full p-2 border mt-2"
          onChange={(e) => setUser({ ...user, name: e.target.value })} />
        <input type="email" placeholder="Email" className="w-full p-2 border mt-2"
          onChange={(e) => setUser({ ...user, email: e.target.value })} />
        <input type="password" placeholder="Password" className="w-full p-2 border mt-2"
          onChange={(e) => setUser({ ...user, password: e.target.value })} />
        <select className="w-full p-2 border mt-2" onChange={(e) => setUser({ ...user, role: e.target.value })}>
          <option value="farmer">Farmer</option>
          <option value="firm">Firm</option>
        </select>
        <button className="w-full bg-green-600 text-white p-2 mt-4">Register</button>
      </form>
    </div>
  );
}
