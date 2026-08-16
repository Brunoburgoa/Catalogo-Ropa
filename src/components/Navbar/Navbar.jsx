import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

function Navbar() {
  const { user } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-neutral-950 text-white shadow-sm">
      <div className="relative mx-auto flex min-h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Espacio izquierdo para mantener el título centrado */}
        <div className="w-12" />

        {/* Título centrado */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 text-lg font-bold tracking-tight sm:text-xl"
        >
          Catálogo de Ropa
        </Link>

        {/* Acciones */}
        <div className="ml-auto flex items-center">
          {user && (
            <Link
              to="/admin"
              className="mr-5 rounded-lg px-2 py-2 text-sm font-medium text-neutral-300 transition-colors hover:text-white"
            >
              <span className="hidden sm:inline">
                Panel de administración
              </span>

              <span className="sm:hidden">
                Admin
              </span>
            </Link>
          )}

          <Link
            to="/carrito"
            aria-label="Ver carrito"
            className="relative flex items-center justify-center p-2 text-white transition-transform hover:scale-105"
          >
            <FaShoppingCart className="text-2xl" />

            {cart.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-neutral-950">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;