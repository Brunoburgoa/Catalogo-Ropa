import { useEffect, useState } from "react";

import Navbar from "../components/Navbar/Navbar";
import CatalogToolbar from "../components/CatalogToolbar/CatalogToolbar";
import ProductGrid from "../components/ProductGrid/ProductGrid";

import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";

function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [epoca, setEpoca] = useState("");
  const [talle, setTalle] = useState("");
  const [sort, setSort] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCatalogData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productsData, categoriesData] =
          await Promise.all([
            getProducts(),
            getCategories(),
          ]);

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error(
          "Error al cargar el catálogo:",
          error,
        );

        setError(
          "No se pudo cargar el catálogo.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadCatalogData();
  }, []);

  const filteredProducts = products
    .filter((product) => {
      if (product.visible === false) {
        return false;
      }

      const matchesSearch = product.nombre
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "" ||
        product.categoria === category;

      const matchesSize =
        talle === "" ||
        product.talle === talle;

      const matchesCondition =
        condition === "" ||
        product.condicion === condition;

      const matchesEpoca =
        epoca === "" ||
        product.epoca === epoca;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSize &&
        matchesCondition &&
        matchesEpoca
      );
    })
    .sort((a, b) => {
      if (sort === "price-asc") {
        return (
          Number(a.precio) -
          Number(b.precio)
        );
      }

      if (sort === "price-desc") {
        return (
          Number(b.precio) -
          Number(a.precio)
        );
      }

      return 0;
    });

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <header className="mb-7">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            Catálogo
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-500 sm:text-base">
            Explorá las prendas y encontrá lo que
            estás buscando.
          </p>
        </header>

        <CatalogToolbar
          categories={categories}
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          condition={condition}
          setCondition={setCondition}
          season={epoca}
          setSeason={setEpoca}
          size={talle}
          setSize={setTalle}
          sort={sort}
          setSort={setSort}
        />

        {loading ? (
          <div className="rounded-2xl border border-neutral-200 bg-white py-16 text-center shadow-sm">
            <p className="text-sm text-neutral-500">
              Cargando catálogo...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 py-16 text-center">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">
              No encontramos productos
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Probá modificando la búsqueda o alguno
              de los filtros.
            </p>
          </div>
        ) : (
          <ProductGrid
            productos={filteredProducts}
          />
        )}
      </main>
    </div>
  );
}

export default CatalogPage;