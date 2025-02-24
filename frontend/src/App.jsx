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
    <>
      <Navbar />
      {/* 
        pt-20 pushes the content below the fixed navbar,
        h-[calc(100vh-5rem)] makes the container fixed in height (assuming navbar ~5rem tall),
        overflow-hidden prevents scrolling.
      */}
      <div className="pt-20 h-[calc(100vh-5rem)] overflow-hidden">
        {children}
      </div>
    </>
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
