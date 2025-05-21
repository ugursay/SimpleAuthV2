import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      setMessage(res.data.message);
      console.log("Token:", res.data.token);
      login({ email, token: res.data.token });
      navigate("/user");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Sunucudan bağımsız bir hata oluştu"
      );
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm  hover:scale-105 transition-transform duration-300 will-change-transform">
        <h2 className="text-2xl font-semibold mb-6 text-center bg-gray-100 rounded-xl py-2 hover:scale-105 transition-transform duration-300 will-change-transform">
          Giriş Yap
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
            className="w-full px-4 py-2 border rounded-lg hover:ring-2 hover:ring-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500  hover:scale-105 transition-transform duration-300 will-change-transform"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
            className="w-full px-4 py-2 border rounded-lg hover:ring-2 hover:ring-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500  hover:scale-105 transition-transform duration-300 will-change-transform"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition-colors  hover:scale-105 transition-transform duration-300 will-change-transform"
          >
            Giriş Yap
          </button>
          <div className="mt-4 text-center  hover:scale-105 transition-transform duration-300 will-change-transform">
            <Link
              to="/register"
              className="text-blue-600 font-semibold mt-2 hover:text-blue-800 transition"
            >
              Hesabın yok mu?
            </Link>
          </div>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-rose-500 bg-rose-100 px-4 py-2 rounded-lg shadow-sm hover:scale-105 transition-transform duration-300 will-change-transform">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
