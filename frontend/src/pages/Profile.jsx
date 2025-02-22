// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Profile() {
//   const [user, setUser] = useState({});
//   const [crops, setCrops] = useState([]);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/auth/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setUser(res.data))
//       .catch((err) => console.error(err));

//     axios
//       .get("http://localhost:5000/api/crops/my-crops", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setCrops(res.data))
//       .catch((err) => console.error(err));
//   }, [token]);

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold">Profile</h1>
//       <p><strong>Name:</strong> {user.name}</p>
//       <p><strong>Email:</strong> {user.email}</p>
//       <p><strong>Role:</strong> {user.role}</p>

//       <h2 className="text-xl font-bold mt-6">My Crops</h2>
//       <ul className="mt-2">
//         {crops.map((crop) => (
//           <li key={crop._id} className="border p-2 mt-2">
//             {crop.name} - {crop.price} ETH - {crop.quantity} units
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState({});
  const [crops, setCrops] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setUser(res.data))
    .catch(err => console.error(err));

    axios.get("http://localhost:5000/api/crops/my-crops", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setCrops(res.data))
    .catch(err => console.error(err));
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 text-center">Profile</h1>
      <div className="bg-white p-6 shadow-lg rounded-lg mt-6">
        <p className="text-lg"><strong>Name:</strong> {user.name}</p>
        <p className="text-lg"><strong>Email:</strong> {user.email}</p>
        <p className="text-lg"><strong>Role:</strong> {user.role}</p>
      </div>
      
      <h2 className="text-xl font-bold text-green-700 mt-6">My Crops</h2>
      <ul className="mt-2 space-y-4">
        {crops.map((crop) => (
          <li key={crop._id} className="bg-white p-4 shadow-md rounded-lg flex justify-between">
            <span>{crop.name} - {crop.price} ETH - {crop.quantity} units</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
