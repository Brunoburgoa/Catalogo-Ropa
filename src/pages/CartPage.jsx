import { Link } from "react-router-dom";

import { useCart } from "../context/cartStore";
import { getOptimizedImageUrl } from "../utils/cloudinaryImage";

const WHATSAPP_NUMBER = "5492613616857";

function CartPage() {
  const { cart, removeFromCart, clearCart } =
    useCart();

  const total = cart.reduce(
    (accumulator, product) =>
      accumulator + Number(product.precio),
    0,
  );

  const handleWhatsApp = () => {
    const productsMessage = cart
      .map(
        (product) =>
          `- ${product.nombre} — $${Number(
            product.precio,
          ).toLocaleString("es-AR")}`,
      )
      .join("\n");

    const message =
      `Hola! Quería consultar por estos productos:\n\n` +
      `${productsMessage}\n\n` +
      `Total: $${total.toLocaleString("es-AR")}\n\n` +
      `¿Siguen disponibles?`;

    const encodedMessage =
      encodeURIComponent(message);

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}` +
      `?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl items-center px-5 py-10 sm:px-8">
          <section className="w-full rounded-2xl border border-neutral-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-2xl">
              🛒
            </div>

            <h1 className="mt-5 text-2xl font-bold text-neutral-950">
              Tu carrito está vacío
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Agregá algunos productos desde el catálogo
              para realizar tu consulta.
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex rounded-xl bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
            >
              Volver al catálogo
            </Link>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 lg:py-10">
        <div className="mb-7">
          <Link
            to="/"
            className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-950"
          >
            ← Volver al catálogo
          </Link>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                Tu carrito
              </h1>

              <p className="mt-2 text-sm text-neutral-500">
                {cart.length}{" "}
                {cart.length === 1
                  ? "producto seleccionado"
                  : "productos seleccionados"}
              </p>
            </div>

            <button
              type="button"
              onClick={clearCart}
              className="self-start text-sm font-medium text-red-600 transition-colors hover:text-red-700 sm:self-auto"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="space-y-3">
            {cart.map((product) => (
              <article
                key={product.id}
                className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
              >
                {product.imagenes?.find(Boolean) ? (
                  <img
                    src={getOptimizedImageUrl(
                      product.imagenes.find(Boolean),
                      {
                        width: 240,
                        height: 240,
                        crop: "fill",
                      },
                    )}
                    alt={product.nombre}
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full rounded-xl object-cover sm:h-28 sm:w-24"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-neutral-200 text-xs font-medium text-neutral-500 sm:h-28 sm:w-24">
                    Sin imagen
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-neutral-950">
                    {product.nombre}
                  </h2>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500">
                    <span>
                      {product.condicion}
                    </span>
                  </div>

                  <p className="mt-3 text-lg font-bold text-neutral-950">
                    ${Number(product.precio).toLocaleString("es-AR")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removeFromCart(product.id)
                  }
                  className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                >
                  Quitar
                </button>
              </article>
            ))}
          </section>

          <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-neutral-950">
              Resumen
            </h2>

            <div className="mt-5 flex items-center justify-between border-b border-neutral-200 pb-5">
              <span className="text-sm text-neutral-500">
                Total
              </span>

              <span className="text-2xl font-bold text-neutral-950">
                ${total.toLocaleString("es-AR")}
              </span>
            </div>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="mt-5 w-full rounded-xl bg-neutral-950 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
            >
              Consultar por WhatsApp
            </button>

            <p className="mt-3 text-center text-xs leading-relaxed text-neutral-400">
              La compra se coordina directamente
              por WhatsApp.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default CartPage;
