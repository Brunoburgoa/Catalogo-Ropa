import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";

function AdminHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error(
        "Error al cerrar sesión:",
        error,
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950 text-white shadow-sm">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <div>
          <h1 className="text-lg font-bold tracking-tight sm:text-xl">
            Panel de administración
          </h1>

          <p className="mt-0.5 text-xs text-neutral-400 sm:text-sm">
            {user?.email}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
          >
            <span className="hidden sm:inline">
              Ver catálogo
            </span>

            <span className="sm:hidden">
              Catálogo
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;