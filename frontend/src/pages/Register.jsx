import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Keypair } from "@solana/web3.js";

export default function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer",
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // 1) Generate a Solana keypair for this user
      const solanaKeypair = Keypair.generate();
      const solanaPubkey = solanaKeypair.publicKey.toBase58();

      // 2) Build payload including the Solana public key
      const payload = {
        ...user,
        solanaPubkey,
      };

      // 3) Send to your backend
      await axios.post(
        "http://localhost:5000/api/auth/register",
        payload
      );

      // 4) (Optional) You could store the secretKey in localStorage
      //     if you ever need the ability for the user to sign transactions:
      // localStorage.setItem(
      //   "solanaSecretKey",
      //   JSON.stringify(Array.from(solanaKeypair.secretKey))
      // );

      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-10 w-auto"
          src="https://www.svgrepo.com/show/301692/login.svg"
          alt="Register"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-blue-500">
          Or{" "}
          <a href="/login" className="font-medium text-blue-500 hover:underline">
            sign in to your account
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleRegister}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300"
              />
            </div>

            {/* Email */}
            <div className="mt-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300"
              />
            </div>

            {/* Password */}
            <div className="mt-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300"
              />
            </div>

            {/* Role */}
            <div className="mt-6">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300"
              >
                <option value="farmer">Farmer</option>
                <option value="firm">Firm</option>
              </select>
            </div>

            {/* Submit */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
