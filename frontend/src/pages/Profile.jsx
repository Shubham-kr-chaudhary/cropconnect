/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";

// 1) Create a pre-configured axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export default function Profile() {
  const [user, setUser]     = useState(null);
  const [crops, setCrops]   = useState([]);
  const [orders, setOrders] = useState([]);
  // grab token once
  const token = localStorage.getItem("token") || "";

  // Inline headers object so we don't need an authHeaders() fn
  const headers = { Authorization: `Bearer ${token}` };

  // Form state for farmers
  const [newCrop, setNewCrop] = useState({
    name: "", price: "", quantity: "", unit: "", genre: "", category: ""
  });

  // dropdowns
  const unitOptions     = ["KG", "TON", "LITERS"];
  const genreOptions    = ["Fruits","Vegetables","Grains","Pulses","Spices"];
  const categoryOptions = ["Organic","Hybrid","GMO","Local"];

  // ────────────────────────────────────────────────────────────────
  // 1️⃣ Fetch user + their crops
  useEffect(() => {
    if (!token) return;
    API.get("/api/user/dashboard", { headers })
      .then(res => {
        setUser(res.data.user);
        setCrops(res.data.crops);
      })
      .catch(console.error);
  }, [token]); // only when token changes

  // 2️⃣ If they're a firm, fetch orders
  useEffect(() => {
    if (user?.role !== "firm") return;
    API.get("/api/orders", { headers })
      .then(res => setOrders(res.data))
      .catch(console.error);
  }, [user, token]); // re-run if user or token changes

  // ────────────────────────────────────────────────────────────────
  // Farmer: handle form changes / submit
  const handleInputChange = e => {
    setNewCrop(c => ({ ...c, [e.target.name]: e.target.value }));
  };
  const handleAddCrop = () => {
    API.post("/api/crops", newCrop, { headers })
      .then(res => {
        setCrops(c => [...c, res.data]);
        // clear
        setNewCrop({ name:"",price:"",quantity:"",unit:"",genre:"",category:"" });
      })
      .catch(console.error);
  };

  if (!user) {
    return <div className="p-6 text-center">Loading your profile…</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
        Profile
      </h1>

      {/* — Profile Card — */}
      <div className="bg-white shadow rounded-lg mb-8 border">
        <div className="flex items-center px-6 py-5">
          {user.profilePicture
            ? <img src={user.profilePicture} className="w-16 h-16 rounded-full" />
            : <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
          }
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              {user.name}
            </h3>
            <p className="text-sm text-gray-500">Email: {user.email}</p>
            <p className="text-sm text-gray-500">Role: {user.role}</p>
          </div>
        </div>
      </div>

      {/* — Farmer UI — */}
      {user.role === "farmer" && (
        <>
          <h2 className="text-xl font-bold text-green-700 mb-4">Add New Crop</h2>
          <div className="bg-white p-4 shadow-md rounded-lg mb-8">
            <div className="flex flex-wrap items-end gap-4">
              {/* Name */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Crop Name</label>
                <input
                  name="name"
                  value={newCrop.name}
                  onChange={handleInputChange}
                  className="w-40 p-2 border rounded text-gray-900"
                  placeholder="Wheat"
                />
              </div>
              {/* Price */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Price (INR)</label>
                <input
                  name="price"
                  type="number"
                  value={newCrop.price}
                  onChange={handleInputChange}
                  className="w-28 p-2 border rounded text-gray-900"
                  placeholder="100"
                />
              </div>
              {/* Quantity */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  value={newCrop.quantity}
                  onChange={handleInputChange}
                  className="w-20 p-2 border rounded text-gray-900"
                  placeholder="10"
                />
              </div>
              {/* Unit */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Unit</label>
                <select
                  name="unit"
                  value={newCrop.unit}
                  onChange={handleInputChange}
                  className="w-24 p-2 border rounded text-gray-900"
                >
                  <option value="">Select</option>
                  {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              {/* Genre */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Genre</label>
                <select
                  name="genre"
                  value={newCrop.genre}
                  onChange={handleInputChange}
                  className="w-28 p-2 border rounded text-gray-900"
                >
                  <option value="">Select</option>
                  {genreOptions.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              {/* Category */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={newCrop.category}
                  onChange={handleInputChange}
                  className="w-28 p-2 border rounded text-gray-900"
                >
                  <option value="">Select</option>
                  {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button
                onClick={handleAddCrop}
                className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
              >
                Add Crop
              </button>
            </div>
          </div>

          {/* Farmer: My Crops */}
          {crops.length > 0 && (
            <>
              <h2 className="text-xl font-bold text-green-700 mb-4">My Crops</h2>
              <div className="overflow-x-auto bg-white shadow-md rounded-lg mb-8">
                <table className="min-w-full text-gray-700">
                  <thead className="bg-green-100">
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Qty</th>
                      <th className="px-4 py-2">Genre</th>
                      <th className="px-4 py-2">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crops.map(c => (
                      <tr key={c._id} className="border-b">
                        <td className="px-4 py-2">{c.name}</td>
                        <td className="px-4 py-2">₹{c.price}</td>
                        <td className="px-4 py-2">{c.quantity} {c.unit}</td>
                        <td className="px-4 py-2">{c.genre}</td>
                        <td className="px-4 py-2">{c.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      {/* — Firm: My Orders — */}
      {user.role === "firm" && (
        <>
          <h2 className="text-xl font-bold text-green-700 mb-4">My Orders</h2>
          {orders.length > 0 ? (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
              <table className="min-w-full text-gray-700">
                <thead className="bg-green-100">
                  <tr>
                    <th className="px-4 py-2">Crop</th>
                    <th className="px-4 py-2">Qty</th>
                    <th className="px-4 py-2">Total ₹</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">TxSig</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id} className="border-b">
                      <td className="px-4 py-2">{o.crop?.name}</td>
                      <td className="px-4 py-2">{o.quantity}</td>
                      <td className="px-4 py-2">{o.totalPrice}</td>
                      <td className="px-4 py-2">{o.status}</td>
                      <td className="px-4 py-2">
                        {o.txSig
                          ? <a
                              href={`https://explorer.solana.com/tx/${o.txSig}`}
                              target="_blank" rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {o.txSig.slice(0,8)}…
                            </a>
                          : "—"
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No orders yet.</p>
          )}
        </>
      )}
    </div>
  );
}
