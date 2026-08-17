const REQUIRED_FIELD_MESSAGES = {
  nombre: "Ingresá el nombre del producto.",
  precio: "Ingresá el precio del producto.",
  talle: "Seleccioná un talle.",
  categoria: "Seleccioná una categoría.",
  epoca: "Seleccioná una época.",
  condicion: "Seleccioná una condición.",
  estado: "Seleccioná el estado del producto.",
  descripcion: "Ingresá una descripción.",
};

function isEmpty(value) {
  return String(value ?? "").trim() === "";
}

export function validateProduct(product) {
  const errors = {};

  Object.entries(REQUIRED_FIELD_MESSAGES).forEach(
    ([field, message]) => {
      if (isEmpty(product[field])) {
        errors[field] = message;
      }
    },
  );

  if (
    !isEmpty(product.precio) &&
    (!Number.isFinite(Number(product.precio)) ||
      Number(product.precio) < 0)
  ) {
    errors.precio = "Ingresá un precio válido.";
  }

  const hasImage =
    Array.isArray(product.imagenes) &&
    product.imagenes.some(
      (image) =>
        typeof image === "string" && image.trim() !== "",
    );

  if (!hasImage) {
    errors.imagenes =
      "La publicación debe tener al menos una imagen.";
  }

  return errors;
}
