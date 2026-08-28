import { FaShoppingBag, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/authStore";
import { useCart } from "../../context/cartStore";

function Navbar() {
  const { isAdmin } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#1b1917] text-white shadow-sm">
      <div className="mx-auto flex min-h-16 max-w-[1480px] items-center justify-between gap-4 px-4 sm:min-h-18 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5 font-bold tracking-tight"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d9a273] text-[#1b1917]">
            <FaShoppingBag className="text-base" />
          </span>

          <span className="truncate text-base sm:text-lg">
            Venta de Garaje
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            to={isAdmin ? "/admin" : "/login"}
            className="rounded-full border border-white/20 px-3 py-2 text-xs font-semibold text-neutral-100 transition-colors hover:border-white/40 hover:bg-white/10 sm:px-4 sm:text-sm"
          >
            <span className="hidden sm:inline">
              {isAdmin
                ? "Panel de administración"
                : "Administrador"}
            </span>

            <span className="sm:hidden">
              Admin
            </span>
          </Link>

          <Link
            to="/carrito"
            aria-label="Ver carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1b1917] transition-transform hover:scale-105"
          >
            <FaShoppingCart className="text-lg" />

            {cart.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d9a273] px-1 text-xs font-bold text-[#1b1917] ring-2 ring-[#1b1917]">
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
