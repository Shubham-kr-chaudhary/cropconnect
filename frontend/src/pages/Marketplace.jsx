import { useEffect, useState } from "react";
import axios from "axios";

export default function Marketplace() {
  const [crops, setCrops]       = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading]   = useState(false);

  const authHeaders = () => {
    const t = localStorage.getItem("token");
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

  // load crops + role once
  useEffect(() => {
    axios.get("/api/crops").then(r => setCrops(r.data));
    axios
      .get("/api/user/dashboard", { headers: authHeaders() })
      .then(r => setUserRole(r.data.user.role))
      .catch(() => {});
  }, []);

  const buyCrop = async (crop) => {
    const qty = parseInt(prompt("Quantity to buy:", "1"), 10);
    if (!qty || qty < 1) return;

    setLoading(true);
    try {
      // STEP 1️⃣ create pending + razorpay order
      const { data: createRes } = await axios.post(
        "/api/payments/create-order",
        { cropId: crop._id, quantity: qty },
        { headers: authHeaders() }
      );

      // STEP 2️⃣ open Razorpay checkout
      const options = {
        key:        import.meta.env.VITE_RZP_KEY_ID,
        amount:     createRes.amount,
        currency:   createRes.currency,
        order_id:   createRes.razorpayOrderId,
        handler: async (resp) => {
          try {
            // STEP 3️⃣ confirm on our backend
            const { data: confirmRes } = await axios.post(
              "/api/orders/confirm",
              {
                mongoOrderId:        createRes.mongoOrderId,
                razorpay_order_id:   resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature:  resp.razorpay_signature,
              },
              { headers: authHeaders() }
            );

            alert(`✅ Purchase Complete!\nOn-chain TX: ${confirmRes.txSig}`);
          } catch (e) {
            alert("❌ Confirmation failed: " + (e.response?.data?.error || e.message));
          }
        },
        prefill: { email: "user@example.com" },
        theme:   { color: "#16A34A" },
      };

      new window.Razorpay(options).open();
    } catch (e) {
      alert("❌ Payment init failed: " + (e.response?.data?.error || e.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
         <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
           Marketplace
          </h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {crops.map(c =>
              <div key={c._id} className="p-4 shadow rounded flex flex-col">
                <h2 className="text-xl font-bold text-gray-900">{c.name}</h2>
                 <p className="text-gray-800">Price: <span className="font-medium">₹{c.price} </span>/ {c.unit}</p>
                <p className="text-gray-800 flex-1">
                  Available: <span className="font-medium">{c.quantity}</span> {c.unit}
                </p>
    
                {userRole==="firm" &&
                  <button
                    onClick={()=>buyCrop(c)}
                    disabled={loading===c._id}
                    className={`mt-4 w-full py-2 rounded transition ${loading===c._id? "bg-gray-400 text-gray-200 cursor-not-allowed"
                       : "bg-green-700 text-white hover:bg-green-800"} text-black`}
                 >
                    {loading===c._id ? "Processing…" : "Buy"}
                  </button>}
              </div>
            )}
          </div>
         </div>
     );
}
