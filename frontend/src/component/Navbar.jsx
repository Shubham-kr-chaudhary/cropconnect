// import { Link, useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <nav className="bg-blue-600 text-white p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50 bg-white border-b backdrop-blur-lg bg-opacity-80">
//         <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8 ">
//         <div className="relative flex h-16 justify-between">
//         <div className="relative flex h-16 justify-between">
//         <div className="flex flex-1 items-stretch justify-start">
//       <Link to="/" className="text-xl font-bold">CropConnect</Link>
//       <div className="flex flex-shrink-0 items-center space-x-4">
//         <Link to="/" className="hover:underline">Home</Link>
//         <Link to="/marketplace" className="hover:underline">Marketplace</Link>
//         <Link to="/chat" className="hover:underline">Chat</Link>
//         {token ? (
//           <>
//             <Link to="/profile" className="hover:underline">Profile</Link>
//             <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" className="hover:underline text-gray-700 hover:text-indigo-700 text-sm font-medium">Login</Link>
//             <Link to="/register" className="hover:underline text-gray-800 bg-indigo-100 hover:bg-indigo-200 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ">Register</Link>
//           </>
//         )}
//         </div>
//         </div>
//         </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b backdrop-blur-lg bg-opacity-80 p-4">
      <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">CropConnect</Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/marketplace" className="hover:underline">Marketplace</Link>
            <Link to="/chat" className="hover:underline">Chat</Link>

            {token ? (
              <>
                <Link to="/profile" className="hover:underline">Profile</Link>
                <button 
                  onClick={handleLogout} 
                  className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="hover:underline text-gray-700 hover:text-indigo-700 text-sm font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-gray-800 bg-indigo-100 hover:bg-indigo-200 px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


