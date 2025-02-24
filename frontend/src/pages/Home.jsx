import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-wrap">
      {/* Left section: Content */}
      <div className="w-full sm:w-8/12 mb-10">
        <div className="container mx-auto h-full sm:p-10 px-4">
          <header className="lg:flex mt-10 items-center h-full lg:mt-0">
            <div className="w-full">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
                Welcome to
                <br className="hidden lg:block" /> CropConnect
              </h1>
              <div className="w-20 h-2 bg-blue-600 my-4" />
              <p className="text-xl mb-10 text-gray-500">
                Connecting farmers directly with buyers for a transparent marketplace.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 text-base font-medium text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition"
                >
                  Register
                </Link>
              </div>
            </div>
          </header>
        </div>
      </div>

      {/* Right section: Image */}
      <img
        src="https://images.unsplash.com/photo-1536147116438-62679a5e01f2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
        alt="Farm Fields"
        className="w-full h-48 object-cover sm:h-screen sm:w-4/12"
      />
    </div>
  );
}
