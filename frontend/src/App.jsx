import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import PropTypes from "prop-types";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";

function Layout({ children }) {
  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>
      {/* 
        The main container starts below the fixed navbar using mt-20 (assuming navbar is ~5rem tall).
        overflow-auto ensures that only this container scrolls.
      */}
      <main className="mt-20 flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/marketplace" element={<Layout><Marketplace /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/chat" element={<Layout><Chat /></Layout>} />
      </Routes>
    </Router>
  );
}
