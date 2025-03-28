
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { ethers } from "ethers";

// export default function Marketplace() {
//   const [crops, setCrops] = useState([]);
//   const [userRole, setUserRole] = useState(null);

//   // Conversion rate: 1 ETH = 150000 INR (adjust as needed)
//   const INR_TO_ETH_RATE = 1 / 150000;

//   // 1. Fetch crops from your backend (which must include "contractId" in each record)
//   useEffect(() => {
//     axios
//       // If your backend route is actually "/api/crops", use that:
//       .get("http://localhost:5000/api/crops")
//       .then((res) => setCrops(res.data))
//       .catch((err) => console.error("Error fetching crops:", err));
//   }, []);

//   // 2. Fetch user role from /api/user/dashboard
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       axios
//         .get("http://localhost:5000/api/user/dashboard", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           // Assuming res.data.user contains { role, ... }
//           setUserRole(res.data.user.role);
//         })
//         .catch((err) => console.error("Error fetching user data:", err));
//     }
//   }, []);

//   // 3. Blockchain purchase function (using ethers.js)
//   const buyCrop = async (crop) => {
//     console.log("Attempting to buy crop with contractId:", crop.contractId);
//     if (!crop.contractId) {
//       alert("Crop contractId not found! Ensure the crop listing is properly stored with a valid id.");
//       return;
//     }

//     // Check for MetaMask
//     if (!window.ethereum) {
//       alert("Please install MetaMask!");
//       return;
//     }

//     try {
//       // Prompt user for how many units to buy
//       const quantity = prompt("Enter quantity to buy:", "1");
//       if (!quantity || isNaN(quantity)) return;

//       // Convert price (INR) to ETH
//       const priceInEth = crop.price * INR_TO_ETH_RATE;
//       const totalEth = priceInEth * Number(quantity);
//       const totalCostEth = ethers.parseEther(totalEth.toString());

//       console.log(
//         `Buying crop with contractId ${crop.contractId}: ${quantity} units, total cost ${totalEth} ETH`
//       );

//       // Connect to MetaMask
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();

//       // Use the deployed contract address from your deployment logs
//       // Make sure this matches your actual contract's address
//       const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
//       const contractABI = [
//         // Must match your Solidity function signature
//         "function buyCrop(uint256 id, uint256 quantity) public payable",
//       ];

//       const contract = new ethers.Contract(contractAddress, contractABI, signer);

//       // Call the contract function with crop.contractId
//       const tx = await contract.buyCrop(crop.contractId, Number(quantity), {
//         value: totalCostEth,
//       });

//       await tx.wait();
//       alert(
//         `Crop purchased successfully!\nTotal cost: ${totalEth} ETH (converted from ${
//           crop.price
//         } INR per unit * ${quantity} units)`
//       );
//     } catch (err) {
//       console.error("Transaction error:", err);
//       alert("Transaction failed.");
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-green-700 text-center">Marketplace</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//         {crops.map((crop) => (
//           <div key={crop._id} className="bg-white p-4 shadow-md rounded-lg">
//             <h2 className="text-xl font-bold text-black">{crop.name}</h2>
//             <p className="text-black">Genre: {crop.genre || "N/A"}</p>
//             <p className="text-black">Category: {crop.category || "N/A"}</p>
//             <p className="text-black">Price: {crop.price} INR</p>
//             <p className="text-black">
//               Quantity: {crop.quantity} {crop.unit}
//             </p>

//             {/* Only show Buy button if user is "firm" */}
//             {userRole === "firm" && (
//               <button
//                 onClick={() => buyCrop(crop)}
//                 className="mt-4 w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
//               >
//                 Buy
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { Biconomy } from "@biconomy/mexa";

export default function Marketplace() {
  const [crops, setCrops] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [provider, setProvider] = useState(null);

  // Conversion rate: 1 ETH = 150000 INR (adjust as needed)
  const INR_TO_ETH_RATE = 1 / 150000;

  // 1. Fetch crops from your backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/crops")
      .then((res) => setCrops(res.data))
      .catch((err) => console.error("Error fetching crops:", err));
  }, []);

  // 2. Fetch user role from /api/user/dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/user/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUserRole(res.data.user.role);
        })
        .catch((err) => console.error("Error fetching user data:", err));
    }
  }, []);

  // 3. Initialize Biconomy for gasless transactions
  useEffect(() => {
    if (window.ethereum) {
      const biconomyInstance = new Biconomy(window.ethereum, {
        apiKey: "YOUR_BICONOMY_API_KEY", // Replace with your Biconomy API key
        debug: true,
      });

      biconomyInstance.onEvent(biconomyInstance.READY, () => {
        const ethersProvider = new ethers.BrowserProvider(biconomyInstance);
        setProvider(ethersProvider);
        console.log("Biconomy initialized and provider set");
      });

      biconomyInstance.onEvent(biconomyInstance.ERROR, (error, message) => {
        console.error("Biconomy initialization error:", error, message);
      });
    }
  }, []);

  // 4. Blockchain purchase function using gasless transactions
  const buyCrop = async (crop) => {
    console.log("Attempting to buy crop with contractId:", crop.contractId);
    if (!crop.contractId) {
      alert("Crop contractId not found! Ensure the crop listing is properly stored with a valid id.");
      return;
    }

    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    // Ensure Biconomy provider is ready
    if (!provider) {
      alert("Biconomy provider not ready. Please try again later.");
      return;
    }

    try {
      const quantity = prompt("Enter quantity to buy:", "1");
      if (!quantity || isNaN(quantity) || Number(quantity) <= 0) return;

      // Convert price (INR) to ETH
      const priceInEth = crop.price * INR_TO_ETH_RATE;
      const totalEth = priceInEth * Number(quantity);
      const totalCostEth = ethers.parseEther(totalEth.toString());

      console.log(`Buying crop ${crop.contractId}: ${quantity} units, total cost ${totalEth} ETH`);

      const signer = await provider.getSigner();

      // Your deployed contract address
      const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
      const contractABI = [
        "function buyCrop(uint256 id, uint256 quantity) public payable",
      ];

      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Execute transaction via Biconomy (gasless)
      const tx = await contract.buyCrop(crop.contractId, Number(quantity), {
        value: totalCostEth,
      });
      await tx.wait();

      alert(
        `Crop purchased successfully!\nTotal cost: ${totalEth} ETH (converted from ${
          crop.price
        } INR per unit * ${quantity} units)`
      );
    } catch (err) {
      console.error("Transaction error:", err);
      alert("Transaction failed.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 text-center">Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {crops.map((crop) => (
          <div key={crop._id} className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-bold text-black">{crop.name}</h2>
            <p className="text-black">Genre: {crop.genre || "N/A"}</p>
            <p className="text-black">Category: {crop.category || "N/A"}</p>
            <p className="text-black">Price: {crop.price} INR</p>
            <p className="text-black">
              Quantity: {crop.quantity} {crop.unit}
            </p>
            {userRole === "firm" && (
              <button
                onClick={() => buyCrop(crop)}
                className="mt-4 w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
              >
                Buy
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
