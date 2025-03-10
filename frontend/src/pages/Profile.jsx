
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [crops, setCrops] = useState([]);
  const token = localStorage.getItem("token");

  // For adding new crop
  const [newCrop, setNewCrop] = useState({
    name: "",
    price: "",
    quantity: "",
    unit: "",
    genre: "",
    category: "",
  });

  // Possible dropdown values
  const unitOptions = ["KG", "TON", "LITERS"];
  const genreOptions = ["Fruits", "Vegetables", "Grains", "Pulses", "Spices"];
  const categoryOptions = ["Organic", "Hybrid", "GMO", "Local"];

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
        setCrops(res.data.crops);
      })
      .catch((err) => console.error("Error fetching dashboard data:", err));
  }, [token]);

  const handleInputChange = (e) => {
    setNewCrop({ ...newCrop, [e.target.name]: e.target.value });
  };

  const handleAddCrop = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/crops", newCrop, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Append new crop to existing list
      setCrops([...crops, res.data]);
      // Reset form
      setNewCrop({
        // name: newCrop.name||"",
        // price: newCrop.price||"",
        // quantity: newCrop.quantity||"",
        // unit: newCrop.quantity||"",
        // genre: newCrop.genre||"",
        // category: newCrop.category||"",
        name: newCrop.name,
        price: newCrop.price,
        quantity: newCrop.quantity,
        unit: newCrop.unit,
        genre: newCrop.genre,
        category: newCrop.category
      
      });
    } catch (error) {
      console.error("Error adding crop:", error);
    }
  };

  if (!user) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
        Profile
      </h1>

      {/* User Profile Card */}
      <div className="bg-white overflow-hidden shadow rounded-lg border mb-8">
        <div className="px-4 py-5 sm:px-6 flex items-center">
          {/* Profile Picture or Placeholder */}
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl">
              {user.name ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
          )}
          <div className="ml-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {user.name || "User Profile"}
            </h3>
            <p className="text-sm text-gray-500">Email: {user.email || "N/A"}</p>
            <p className="text-sm text-gray-500">Role: {user.role || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Add New Crop Section */}
      <h2 className="text-xl font-bold text-green-700 mb-4">Add New Crop</h2>
      <div className="bg-white p-4 shadow-md rounded-lg mb-8">
        <div className="flex flex-wrap items-end gap-4">
          {/* Crop Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Crop Name</label>
            <input
              name="name"
              value={newCrop.name}
              onChange={handleInputChange}
              placeholder="e.g., Wheat"
              className="w-40 p-2 border border-gray-300 rounded text-gray-900"
            />
          </div>

          {/* Price (INR) */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Price (INR)</label>
            <input
              name="price"
              value={newCrop.price}
              onChange={handleInputChange}
              placeholder="e.g., 100"
              className="w-28 p-2 border border-gray-300 rounded text-gray-900"
            />
          </div>

          {/* Quantity */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Quantity</label>
            <input
              name="quantity"
              value={newCrop.quantity}
              onChange={handleInputChange}
              placeholder="e.g., 10"
              className="w-20 p-2 border border-gray-300 rounded text-gray-900"
            />
          </div>

          {/* Unit Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Unit</label>
            <select
              name="unit"
              value={newCrop.unit}
              onChange={handleInputChange}
              className="w-24 p-2 border border-gray-300 rounded text-gray-900"
            >
              <option value="">Select</option>
              {unitOptions.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Genre Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Genre</label>
            <select
              name="genre"
              value={newCrop.genre}
              onChange={handleInputChange}
              className="w-28 p-2 border border-gray-300 rounded text-gray-900"
            >
              <option value="">Select</option>
              {genreOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={newCrop.category}
              onChange={handleInputChange}
              className="w-28 p-2 border border-gray-300 rounded text-gray-900"
            >
              <option value="">Select</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Add Crop Button */}
          <button
            onClick={handleAddCrop}
            className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
          >
            Add Crop
          </button>
        </div>
      </div>

      {/* Crops Section */}
      <h2 className="text-xl font-bold text-green-700 mb-4">My Crops</h2>
      {crops.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full text-gray-700">
            <thead className="bg-green-100">
              <tr>
                <th className="px-4 py-2 text-left">Crop Name</th>
                <th className="px-4 py-2 text-left">Price (INR)</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Genre</th>
                <th className="px-4 py-2 text-left">Category</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((crop) => (
                <tr key={crop._id} className="border-b">
                  <td className="px-4 py-2">{crop.name}</td>
                  <td className="px-4 py-2">{crop.price}</td>
                  <td className="px-4 py-2">
                    {crop.quantity} {crop.unit}
                  </td>
                  <td className="px-4 py-2">{crop.genre || "N/A"}</td>
                  <td className="px-4 py-2">{crop.category || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No crops listed yet.</p>
      )}
    </div>
  );
}
