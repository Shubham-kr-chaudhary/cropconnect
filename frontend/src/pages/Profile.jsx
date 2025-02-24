
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [crops, setCrops] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Dashboard data:", res.data);
        setUser(res.data.user);
        setCrops(res.data.crops);
      })
      .catch((err) => console.error("Error fetching dashboard data:", err));
  }, [token]);

  if (!user) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
        Profile
      </h1>

      {/* User Profile Card */}
      <div className="bg-white overflow-hidden shadow rounded-lg border mb-8">
        <div className="flex items-center px-4 py-5 sm:px-6">
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
              User Profile
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Here is some information about you.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.name || "N/A"}
              </dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.email || "N/A"}
              </dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.role || "N/A"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Crops Section */}
      <h2 className="text-xl font-bold text-green-700 mb-4">My Crops</h2>
      {crops && crops.length > 0 ? (
        <ul className="space-y-4">
          {crops.map((crop) => (
            <li
              key={crop._id}
              className="bg-white p-4 shadow-md rounded-lg flex justify-between"
            >
              <span>
                {crop.name} - {crop.price} ETH - {crop.quantity} units
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No crops listed yet.</p>
      )}
    </div>
  );
}
