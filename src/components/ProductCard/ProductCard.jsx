import { FaArrowRight, FaCartPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useCart } from "../../context/cartStore";
import { getOptimizedImageUrl } from "../../utils/cloudinaryImage";

function ProductCard({ producto }) {
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();

  const isSold = producto.estado === "Vendido";
  const isInCart = cart.some(
    (item) => item.id === producto.id,
  );
  const productImage = producto.imagenes?.find(Boolean);

  const handleViewProduct = () => {
    navigate(`/producto/${producto.id}`);
  };

  const handleAddToCart = () => {
    addToCart(producto);
  };

  return (
    <article
      className={`flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] border border-neutral-200/80 bg-white shadow-[0_8px_28px_rgba(28,25,23,0.06)] transition-all duration-300 ${
        isSold
          ? "opacity-80"
          : "hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(28,25,23,0.12)]"
      }`}
    >
      <button
        type="button"
        onClick={handleViewProduct}
        className="group block w-full flex-1 text-left"
      >
        <div className="relative overflow-hidden bg-[#eeeae6]">
          {productImage ? (
            <img
              src={getOptimizedImageUrl(productImage, {
                width: 720,
                height: 900,
                crop: "fill",
              })}
              alt={producto.nombre}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            />
          ) : (
            <div className="flex aspect-[4/5] w-full items-center justify-center bg-neutral-200 text-sm font-medium text-neutral-500">
              Sin imagen
            </div>
          )}

          {(producto.subcategoria || producto.categoria) && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-sm backdrop-blur-sm">
              {producto.subcategoria || producto.categoria}
            </span>
          )}

          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1b1917]/45">
              <span className="rounded-full border border-white/30 bg-[#1b1917]/90 px-5 py-2 text-xs font-bold tracking-[0.18em] text-white">
                VENDIDO
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <div>
            <h2 className="line-clamp-2 text-base font-bold leading-snug text-neutral-900">
              {producto.nombre}
            </h2>
          </div>

          <p className="mt-3 text-2xl font-bold tracking-tight text-[#27221e]">
            ${Number(producto.precio).toLocaleString("es-AR")}
          </p>

          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-sm text-neutral-500">
              {producto.condicion}
            </p>

            <span className="flex items-center gap-1 text-xs font-semibold text-[#8c6244] opacity-0 transition-opacity group-hover:opacity-100">
              Ver detalle
              <FaArrowRight />
            </span>
          </div>
        </div>
      </button>

      <div className="mt-auto px-5 pb-5">
        {isSold ? (
          <div className="w-full rounded-xl bg-neutral-100 py-3 text-center text-sm font-semibold text-neutral-500">
            Producto vendido
          </div>
        ) : isInCart ? (
          <button
            type="button"
            disabled
            className="w-full rounded-xl bg-[#eeeae6] py-3 text-sm font-semibold text-[#6c594b]"
          >
            Agregado al carrito
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#27221e] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3a312b]"
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
