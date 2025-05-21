import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const User = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (!user)
    return (
      <p className="text-center mt-10 text-blue-600 animate-pulse">
        Yükleniyor...
      </p>
    );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm hover:scale-105 transition-transform duration-300 will-change-transform">
        <h1 className="text-xl font-semibold text-center mb-4 hover:scale-105 transition-transform duration-300 will-change-transform">
          Hoş geldin<br></br>
          <span className="text-blue-600 break-all">{user?.email}</span>
        </h1>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg  hover:bg-red-600 transition-colors hover:scale-105 transition-transform duration-300 will-change-transform"
        >
          Çıkış yap
        </button>
      </div>
    </div>
  );
};

export default User;
