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

      if (
        a.estado === "Disponible" &&
        b.estado === "Vendido"
      ) {
        return -1;
      }

      if (
        a.estado === "Vendido" &&
        b.estado === "Disponible"
      ) {
        return 1;
      }

      return 0;
    });

  const activeFilterCount = [
    search,
    category,
    condition,
    epoca,
    talle,
    sort,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setCondition("");
    setEpoca("");
    setTalle("");
    setSort("");
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <main className="mx-auto w-full max-w-[1480px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <header className="relative mb-6 overflow-hidden rounded-[1.5rem] bg-[#27221e] px-6 py-7 text-white shadow-sm sm:px-9 sm:py-8 lg:px-11 lg:py-9">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#d9a273]/20 blur-3xl" />
          <div className="absolute -bottom-28 right-1/4 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#e7bd97]">
              Venta de garaje
            </p>

            <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
              Ropa nueva y usada,
              <span className="block text-[#e7bd97]">
                tecnología y muebles para el hogar.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-300 sm:text-base">
              Encontrá productos únicos a buenos precios. Si algo te
              gusta, aprovechalo antes de que se vaya.
            </p>
          </div>
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
          resultsCount={filteredProducts.length}
          activeFilterCount={activeFilterCount}
          onClearFilters={clearFilters}
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
