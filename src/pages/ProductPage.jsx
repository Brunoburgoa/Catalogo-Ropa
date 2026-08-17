import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaCartPlus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import Navbar from "../components/Navbar/Navbar";
import { useCart } from "../context/cartStore";
import { getProductById } from "../services/productService";
import { getOptimizedImageUrl } from "../utils/cloudinaryImage";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { cart, addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const productData = await getProductById(id);

        if (!productData) {
          setError("Producto no encontrado.");
          return;
        }

        setProduct(productData);
        setSelectedImage(0);
      } catch (error) {
        console.error(
          "Error al cargar el producto:",
          error,
        );

        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-[calc(100vh-4rem)] bg-neutral-50 px-5 py-16">
          <div className="mx-auto flex max-w-6xl justify-center">
            <p className="text-sm text-neutral-500">
              Cargando producto...
            </p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />

        <main className="min-h-[calc(100vh-4rem)] bg-neutral-50 px-5 py-16">
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-neutral-200 bg-white px-6 py-14 text-center shadow-sm">
            <p className="text-lg font-semibold text-neutral-900">
              {error}
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
            >
              Volver al catálogo
            </button>
          </div>
        </main>
      </>
    );
  }

  const isSold = product.estado === "Vendido";

  const isInCart = cart.some(
    (item) => item.id === product.id,
  );

  const productImages = (product.imagenes || []).filter(Boolean);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handlePreviousImage = () => {
    setSelectedImage((current) =>
      current === 0
        ? productImages.length - 1
        : current - 1,
    );
  };

  const handleNextImage = () => {
    setSelectedImage((current) =>
      current === productImages.length - 1
        ? 0
        : current + 1,
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-7 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-950"
        >
          ← Volver al catálogo
        </button>

        <section className="grid gap-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7 lg:grid-cols-2 lg:gap-10 lg:p-8">
          {/* Imágenes */}
          <div>
            <div className="relative overflow-hidden rounded-2xl bg-neutral-100">
              {productImages.length > 0 ? (
                <img
                  src={getOptimizedImageUrl(
                    productImages[selectedImage],
                    {
                      width: 1200,
                      height: 1600,
                    },
                  )}
                  alt={product.nombre}
                  decoding="async"
                  className="aspect-[3/4] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[3/4] w-full items-center justify-center bg-neutral-200 text-sm font-medium text-neutral-500">
                  Sin imagen
                </div>
              )}

              {isSold && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                  <span className="rounded-full bg-neutral-950/90 px-5 py-2 text-sm font-bold tracking-wide text-white">
                    VENDIDO
                  </span>
                </div>
              )}

              {productImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePreviousImage}
                    aria-label="Imagen anterior"
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
                  >
                    <FaChevronLeft />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Imagen siguiente"
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
                {productImages.map((imagen, index) => (
                  <button
                    type="button"
                    key={`${imagen}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-xl border-2 bg-neutral-100 transition ${
                      selectedImage === index
                        ? "border-neutral-950"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={getOptimizedImageUrl(imagen, {
                        width: 240,
                        height: 240,
                        crop: "fill",
                      })}
                      alt={`${product.nombre} - imagen ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información */}
          <div className="flex flex-col">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                  {product.nombre}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isSold
                      ? "bg-neutral-100 text-neutral-500"
                      : "bg-neutral-950 text-white"
                  }`}
                >
                  {product.estado}
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold tracking-tight text-neutral-950">
                ${Number(product.precio).toLocaleString("es-AR")}
              </p>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-neutral-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Talle
                </p>

                <p className="mt-1 font-semibold text-neutral-900">
                  {product.talle}
                </p>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Condición
                </p>

                <p className="mt-1 font-semibold text-neutral-900">
                  {product.condicion}
                </p>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Categoría
                </p>

                <p className="mt-1 font-semibold text-neutral-900">
                  {product.categoria}
                </p>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Época
                </p>

                <p className="mt-1 font-semibold text-neutral-900">
                  {product.epoca}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-neutral-950">
                Descripción
              </h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-neutral-600">
                {product.descripcion}
              </p>
            </div>

            <div className="mt-8">
              {isSold ? (
                <div className="w-full rounded-xl bg-neutral-100 py-3.5 text-center text-sm font-medium text-neutral-500">
                  Producto vendido
                </div>
              ) : isInCart ? (
                <button
                  type="button"
                  disabled
                  className="w-full rounded-xl bg-neutral-100 py-3.5 text-sm font-semibold text-neutral-500"
                >
                  Agregado al carrito
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
                >
                  <FaCartPlus />
                  Agregar al carrito
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate("/carrito")}
              className="mt-3 w-full rounded-xl border border-neutral-300 py-3.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              Ver carrito
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProductPage;
