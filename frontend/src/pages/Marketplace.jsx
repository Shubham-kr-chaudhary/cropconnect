// import { useEffect, useState } from "react";
// import axios from "axios";
// import { ethers } from "ethers";

// export default function Marketplace() {
//   const [crops, setCrops] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/crops")
//       .then(res => setCrops(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   const buyCrop = async (crop) => {
//     if (!window.ethereum) {
//       alert("Please install MetaMask!");
//       return;
//     }

//     const provider = new ethers.BrowserProvider(window.ethereum);
//     const signer = await provider.getSigner();
//     const contract = new ethers.Contract(
//       "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Replace with your actual contract address
//       [
//         "function buyCrop(uint id) public payable",
//       ],
//       signer
//     );

//     try {
//       const tx = await contract.buyCrop(crop.id, {
//         value: ethers.parseEther(crop.price.toString()),
//       });
//       await tx.wait();
//       alert("Crop purchased successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Transaction failed.");
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-green-700 text-center">Marketplace</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//         {crops.map((crop) => (
//           <div key={crop._id} className="bg-white p-4 shadow-md rounded-lg">
//             <h2 className="text-xl font-bold">{crop.name}</h2>
//             <p className="text-gray-600">Price: {crop.price} ETH</p>
//             <p className="text-gray-600">Quantity: {crop.quantity} units</p>
//             <button 
//               onClick={() => buyCrop(crop)}  // ✅ Now the function is used
//               className="mt-4 w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
//             >
//               Buy
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

export default function Marketplace() {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/crops")
      .then((res) => setCrops(res.data))
      .catch((err) => console.error(err));
  }, []);

  const buyCrop = async (crop) => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      ["function buyCrop(uint id) public payable"],
      signer
    );

    try {
      const tx = await contract.buyCrop(crop.id, {
        value: ethers.parseEther(crop.price.toString()),
      });
      await tx.wait();
      alert("Crop purchased successfully!");
    } catch (err) {
      console.error(err);
      alert("Transaction failed.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 text-center">
        Marketplace
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {crops.map((crop) => (
          <div key={crop._id} className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-bold">{crop.name}</h2>
            <p className="text-gray-600">Genre: {crop.genre}</p>
            <p className="text-gray-600">Category: {crop.category}</p>
            <p className="text-gray-600">Price: {crop.price} INR</p>
            <p className="text-gray-600">Quantity: {crop.quantity} units</p>
            <button
              onClick={() => buyCrop(crop)}
              className="mt-4 w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
            >
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
