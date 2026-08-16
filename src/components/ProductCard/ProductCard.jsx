import { FaCartPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";

function ProductCard({ producto }) {
  const navigate = useNavigate();

  const { cart, addToCart } = useCart();

  const isSold = producto.estado === "Vendido";

  const isInCart = cart.some(
    (item) => item.id === producto.id,
  );

  const handleViewProduct = () => {
    navigate(`/producto/${producto.id}`);
  };

  const handleAddToCart = () => {
    addToCart(producto);
  };

  return (
    <article
      className={`w-full max-w-[340px] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 ${
        isSold
          ? "opacity-80"
          : "hover:-translate-y-1 hover:shadow-lg"
      }`}
    >
      {/* Imagen */}
      <button
        type="button"
        onClick={handleViewProduct}
        className="group block w-full text-left"
      >
        <div className="relative overflow-hidden bg-neutral-100">
          <img
            src={producto.imagenes?.[0]}
            alt={producto.nombre}
            className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />

          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/35">
              <span className="rounded-full bg-neutral-950/90 px-4 py-2 text-sm font-bold tracking-wide text-white">
                VENDIDO
              </span>
            </div>
          )}
        </div>

        {/* Información */}
        <div className="px-5 pb-4 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="line-clamp-2 text-base font-semibold leading-snug text-neutral-900">
              {producto.nombre}
            </h2>

            <span className="shrink-0 text-sm font-medium text-neutral-500">
              Talle {producto.talle}
            </span>
          </div>

          <p className="mt-3 text-2xl font-bold tracking-tight text-neutral-950">
            ${Number(producto.precio).toLocaleString("es-AR")}
          </p>

          <p className="mt-1 text-sm text-neutral-500">
            {producto.condicion}
          </p>
        </div>
      </button>

      {/* Botón */}
      <div className="px-5 pb-5">
        {isSold ? (
          <div className="w-full rounded-xl bg-neutral-100 py-2.5 text-center text-sm font-medium text-neutral-500">
            Producto vendido
          </div>
        ) : isInCart ? (
          <button
            type="button"
            disabled
            className="w-full rounded-xl bg-neutral-100 py-2.5 text-sm font-medium text-neutral-500"
          >
            Agregado al carrito
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
          >
            <FaCartPlus />
            Agregar al carrito
          </button>
        )}
      </div>
    </article>
  );
}

export default ProductCard;