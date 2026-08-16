import ProductCard from "../ProductCard/ProductCard";

function ProductGrid({ productos }) {
  const sortedProducts = [...productos].sort((a, b) => {
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

  return (
    <section className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sortedProducts.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
        />
      ))}
    </section>
  );
}

export default ProductGrid;