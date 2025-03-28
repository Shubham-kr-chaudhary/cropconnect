import { Link } from "react-router-dom"; 
import { useEffect, useState } from "react";
import bgImage from "../assets/bg1.jpeg";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); 
  }, []);

  return (
    <div
      className="relative min-h-screen flex items-center justify-start bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      
      <div className="relative z-10 w-full max-w-4xl px-6 sm:px-8 py-10 text-white">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          Welcome to CropConnect
        </h1>
        <p className="mt-4 text-sm sm:text-base md:text-lg max-w-2xl">
          Connecting farmers directly with buyers for a transparent marketplace.
        </p>
        <div className="flex gap-4 mt-6">
          {isAuthenticated ? (
            <>
              <Link
                to="/marketplace"
                className="bg-green-600 px-4 py-2 rounded text-sm sm:text-base md:text-lg hover:bg-green-700 transition"
              >
                Marketplace
              </Link>
              <Link
                to="/about"
                className="border border-green-600 px-4 py-2 rounded text-sm sm:text-base md:text-lg text-green-600 hover:bg-green-600 hover:text-white transition"
              >
                About Us
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-600 px-4 py-2 rounded text-sm sm:text-base md:text-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="border border-blue-600 px-4 py-2 rounded text-sm sm:text-base md:text-lg text-blue-600 hover:bg-blue-600 hover:text-white transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
