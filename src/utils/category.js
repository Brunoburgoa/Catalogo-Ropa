export function isClothingCategory(categoryName) {
  return (
    String(categoryName ?? "")
      .trim()
      .toLocaleLowerCase("es-AR") === "ropa"
  );
}
