import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import User from "./pages/User";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/User" element={<User />} />
          </Routes>
        </main>

        <footer className="text-center text-sm py-4 text-gray-500">
          © {new Date().getFullYear()} BookNook
        </footer>
      </div>
    </Router>
  );
}

export default App;
