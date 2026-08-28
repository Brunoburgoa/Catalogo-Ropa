import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminHeader from "../components/admin/AdminHeader/AdminHeader";
import CategoryManager from "../components/admin/CategoryManager/CategoryManager";

import {
  deleteProduct,
  getProducts,
} from "../services/productService";

function AdminPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    getProducts()
      .then((data) => {
        if (isActive) {
          setProducts(data);
        }
      })
      .catch((error) => {
        console.error(
          "Error al cargar productos:",
          error,
        );

        if (isActive) {
          setError(
            "No se pudieron cargar los productos.",
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `¿Seguro que querés eliminar "${product.nombre}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteProduct(product.id);

      setProducts((current) =>
        current.filter(
          (item) => item.id !== product.id,
        ),
      );
    } catch (error) {
      console.error(
        "Error al eliminar el producto:",
        error,
      );

      setError(
        "No se pudo eliminar el producto.",
      );
    }
  };

  const total = products.length;

  const disponibles = products.filter(
    (product) =>
      product.estado === "Disponible",
  ).length;

  const vendidos = products.filter(
    (product) =>
      product.estado === "Vendido",
  ).length;

  return (
    <div className="min-h-screen bg-neutral-100">
      <AdminHeader />

      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <header className="mb-8">
          <p className="text-sm font-medium text-neutral-500">
            Administración
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            Panel de control
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-500">
            Administrá productos, categorías y
            publicaciones del catálogo.
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Resumen */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-neutral-500">
              Total de productos
            </p>

            <p className="mt-3 text-3xl font-bold text-neutral-950">
              {loading ? "..." : total}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-neutral-500">
              Disponibles
            </p>

            <p className="mt-3 text-3xl font-bold text-green-600">
              {loading
                ? "..."
                : disponibles}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-neutral-500">
              Vendidos
            </p>

            <p className="mt-3 text-3xl font-bold text-neutral-500">
              {loading
                ? "..."
                : vendidos}
            </p>
          </div>
        </section>

        {/* Productos */}
        <section className="mt-8 rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-neutral-200 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-bold text-neutral-950">
                Productos
              </h3>

              <p className="mt-1 text-sm text-neutral-500">
                Gestioná las publicaciones del catálogo.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/productos/nuevo",
                )
              }
              className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
            >
              Nuevo producto
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-neutral-600">
                    Producto
                  </th>

                  <th className="px-6 py-4 font-semibold text-neutral-600">
                    Precio
                  </th>

                  <th className="px-6 py-4 font-semibold text-neutral-600">
                    Estado
                  </th>

                  <th className="px-6 py-4 font-semibold text-neutral-600">
                    Visibilidad
                  </th>

                  <th className="px-6 py-4 font-semibold text-neutral-600">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-neutral-500"
                    >
                      Cargando productos...
                    </td>
                  </tr>
                ) : products.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center"
                    >
                      <p className="font-semibold text-neutral-900">
                        No hay productos cargados.
                      </p>

                      <p className="mt-1 text-sm text-neutral-500">
                        Creá la primera publicación para comenzar.
                      </p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-neutral-900">
                          {product.nombre}
                        </div>

                        <div className="mt-1 text-xs text-neutral-400">
                          {[product.categoria, product.subcategoria]
                            .filter(Boolean)
                            .join(" · ")}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-medium text-neutral-900">
                        $
                        {Number(
                          product.precio,
                        ).toLocaleString(
                          "es-AR",
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={
                            product.estado ===
                            "Disponible"
                              ? "inline-flex rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700"
                              : "inline-flex rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600"
                          }
                        >
                          {product.estado}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={
                            product.visible
                              ? "text-sm font-medium text-neutral-700"
                              : "text-sm font-medium text-neutral-400"
                          }
                        >
                          {product.visible
                            ? "Visible"
                            : "Oculto"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/productos/${product.id}/editar`,
                              )
                            }
                            className="rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-100"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                product,
                              )
                            }
                            className="rounded-xl border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <CategoryManager />
      </main>
    </div>
  );
}

export default AdminPage;
