import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createProduct } from "../services/productService";
import { getCategories } from "../services/categoryService";

import ImageManager from "../components/admin/ImageManager/ImageManager";
import { isClothingCategory } from "../utils/category";
import { validateProduct } from "../utils/productValidation";

function CreateProductPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    categoriaId: "",
    categoria: "",
    subcategoriaId: "",
    subcategoria: "",
    temporada: "",
    condicion: "",
    estado: "Disponible",
    descripcion: "",
    imagenes: [],
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [saving, setSaving] = useState(false);
  const [imagesUploading, setImagesUploading] =
    useState(false);
  const [error, setError] = useState("");
  const [touchedFields, setTouchedFields] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const mainCategories = categories.filter(
    (category) => !category.categoriaPadre,
  );
  const availableSubcategories = formData.categoriaId
    ? categories.filter(
        (category) =>
          category.categoriaPadre === formData.categoriaId,
      )
    : [];
  const requiresSeason = isClothingCategory(formData.categoria);

  const fieldErrors = validateProduct(formData, {
    requireSubcategory: availableSubcategories.length > 0,
    requireSeason: requiresSeason,
  });
  const visibleFieldErrors = Object.fromEntries(
    Object.entries(fieldErrors).filter(
      ([field]) => submitAttempted || touchedFields[field],
    ),
  );
  const isFormValid =
    Object.keys(fieldErrors).length === 0;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);

        const data = await getCategories();

        setCategories(data);
      } catch (error) {
        console.error(
          "Error al cargar categorías:",
          error,
        );

        setError(
          "No se pudieron cargar las categorías.",
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleBlur = (event) => {
    const { name } = event.target;

    setTouchedFields((current) => ({
      ...current,
      [name]: true,
    }));
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = mainCategories.find(
      (category) => category.id === event.target.value,
    );

    setFormData((current) => ({
      ...current,
      categoriaId: selectedCategory?.id || "",
      categoria: selectedCategory?.nombre || "",
      subcategoriaId: "",
      subcategoria: "",
      temporada: isClothingCategory(selectedCategory?.nombre)
        ? current.temporada
        : "",
    }));
    setError("");
  };

  const handleSubcategoryChange = (event) => {
    const selectedSubcategory = availableSubcategories.find(
      (category) => category.id === event.target.value,
    );

    setFormData((current) => ({
      ...current,
      subcategoriaId: selectedSubcategory?.id || "",
      subcategoria: selectedSubcategory?.nombre || "",
    }));
    setError("");
  };

  const handleImagesChange = (images) => {
    setFormData((current) => ({
      ...current,
      imagenes: images,
    }));

    setError("");
    setTouchedFields((current) => ({
      ...current,
      imagenes: true,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (!isFormValid || imagesUploading) {
      const firstInvalidField = Object.keys(fieldErrors)[0];

      if (firstInvalidField) {
        requestAnimationFrame(() => {
          const errorElement = document.getElementById(
            `${firstInvalidField}-error`,
          );
          const fieldElement = document.querySelector(
            `[name="${firstInvalidField}"]`,
          );

          errorElement?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          if (fieldElement?.type !== "file") {
            fieldElement?.focus({ preventScroll: true });
          }
        });
      }

      return;
    }

    try {
      setSaving(true);
      setError("");

      await createProduct(formData);

      navigate("/admin");
    } catch (error) {
      console.error(
        "Error al crear el producto:",
        error,
      );

      setError(
        "No se pudo crear el producto.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Crear producto
          </h1>

          <p className="mt-1 text-gray-500">
            Completá los datos del producto.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="rounded-lg border px-4 py-2 font-medium hover:bg-gray-100"
        >
          Volver al panel
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
      >
        <div>
          {visibleFieldErrors.nombre && (
            <p
              id="nombre-error"
              role="alert"
              className="mb-3 rounded-lg bg-red-100 p-3 text-sm text-red-700"
            >
              {visibleFieldErrors.nombre}
            </p>
          )}

          <label className="mb-2 block font-medium">
            Nombre
          </label>

          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ej: campera, celular, mesa..."
            required
            aria-invalid={Boolean(visibleFieldErrors.nombre)}
            aria-describedby={
              visibleFieldErrors.nombre ? "nombre-error" : undefined
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-sky-500"
          />
        </div>

        <div>
          {visibleFieldErrors.precio && (
            <p
              id="precio-error"
              role="alert"
              className="mb-3 rounded-lg bg-red-100 p-3 text-sm text-red-700"
            >
              {visibleFieldErrors.precio}
            </p>
          )}

          <label className="mb-2 block font-medium">
            Precio
          </label>

          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ej: 18000"
            min="0"
            required
            aria-invalid={Boolean(visibleFieldErrors.precio)}
            aria-describedby={
              visibleFieldErrors.precio ? "precio-error" : undefined
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-sky-500"
          />
        </div>

        <div>
          {visibleFieldErrors.categoriaId && (
            <p
              id="categoriaId-error"
              role="alert"
              className="mb-3 rounded-lg bg-red-100 p-3 text-sm text-red-700"
            >
              {visibleFieldErrors.categoriaId}
            </p>
          )}

          <label className="mb-2 block font-medium">
            Categoría principal
          </label>

          <select
            name="categoriaId"
            value={formData.categoriaId}
            onChange={handleCategoryChange}
            onBlur={handleBlur}
            required
            aria-invalid={Boolean(visibleFieldErrors.categoriaId)}
            aria-describedby={
              visibleFieldErrors.categoriaId
                ? "categoriaId-error"
                : undefined
            }
            disabled={
              loadingCategories ||
              mainCategories.length === 0
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
          >
            <option value="">
              {loadingCategories
                ? "Cargando categorías..."
                : mainCategories.length === 0
                  ? "No hay categorías principales"
                  : "Seleccionar categoría principal"}
            </option>

            {mainCategories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          {visibleFieldErrors.subcategoriaId && (
            <p
              id="subcategoriaId-error"
              role="alert"
              className="mb-3 rounded-lg bg-red-100 p-3 text-sm text-red-700"
            >
              {visibleFieldErrors.subcategoriaId}
            </p>
          )}

          <label className="mb-2 block font-medium">
            Subcategoría
          </label>

          <select
            name="subcategoriaId"
            value={formData.subcategoriaId}
            onChange={handleSubcategoryChange}
            onBlur={handleBlur}
            required={availableSubcategories.length > 0}
            disabled={
              !formData.categoriaId ||
              availableSubcategories.length === 0
            }
            aria-invalid={Boolean(
              visibleFieldErrors.subcategoriaId,
            )}
            aria-describedby={
              visibleFieldErrors.subcategoriaId
                ? "subcategoriaId-error"
                : undefined
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
          >
            <option value="">
              {!formData.categoriaId
                ? "Primero seleccioná una categoría principal"
                : availableSubcategories.length === 0
                  ? "Esta categoría no tiene subcategorías"
                  : "Seleccionar subcategoría"}
            </option>

            {availableSubcategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nombre}
              </option>
            ))}
          </select>
        </div>

        {requiresSeason && (
        <div>
          {visibleFieldErrors.temporada && (
            <p
              id="temporada-error"
              role="alert"
              className="mb-3 rounded-lg bg-red-100 p-3 text-sm text-red-700"
            >
              {visibleFieldErrors.temporada}
            </p>
          )}

          <label className="mb-2 block font-medium">
            Temporada
          </label>

          <select
            name="temporada"
            value={formData.temporada}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={Boolean(visibleFieldErrors.temporada)}
            aria-describedby={
              visibleFieldErrors.temporada
                ? "temporada-error"
                : undefined
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
          >
            <option value="">Seleccionar temporada</option>
            <option value="Verano">Verano</option>
            <option value="Otoño">Otoño</option>
            <option value="Invierno">Invierno</option>
            <option value="Primavera">Primavera</option>
          </select>
        </div>
        )}

        <div>
          {visibleFieldErrors.condicion && (
            <p
              id="condicion-error"
              role="alert"
              className="mb-3 rounded-lg bg-red-100 p-3 text-sm text-red-700"
            >
              {visibleFieldErrors.condicion}
            </p>
          )}

          <label className="mb-2 block font-medium">
            Condición
          </label>

          <select
            name="condicion"
            value={formData.condicion}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={Boolean(visibleFieldErrors.condicion)}
            aria-describedby={
              visibleFieldErrors.condicion
                ? "condicion-error"
                : undefined
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
          >
            <option value="">
              Seleccionar condición
            </option>

            <option value="Excelente estado">
              Excelente estado
            </option>

            <option value="Muy buen estado">
              Muy buen estado
            </option>

            <option value="Buen estado">
              Buen estado
            </option>
          </select>
        </div>

        <div>
          {visibleFieldErrors.estado && (
            <p
              id="estado-error"
              role="alert"
              className="mb-3 rounded-lg bg-red-100 p-3 text-sm text-red-700"
            >
              {visibleFieldErrors.estado}
            </p>
          )}

          <label className="mb-2 block font-medium">
            Estado
          </label>

          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={Boolean(visibleFieldErrors.estado)}
            aria-describedby={
              visibleFieldErrors.estado ? "estado-error" : undefined
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
          >
            <option value="Disponible">
              Disponible
            </option>

            <option value="Vendido">
              Vendido
            </option>
          </select>
        </div>

        <div>
          {visibleFieldErrors.descripcion && (
            <p
              id="descripcion-error"
              role="alert"
              className="mb-3 rounded-lg bg-red-100 p-3 text-sm text-red-700"
            >
              {visibleFieldErrors.descripcion}
            </p>
          )}

          <label className="mb-2 block font-medium">
            Descripción
          </label>

          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Escribí una descripción del producto..."
            rows="5"
            required
            aria-invalid={Boolean(visibleFieldErrors.descripcion)}
            aria-describedby={
              visibleFieldErrors.descripcion
                ? "descripcion-error"
                : undefined
            }
            className="w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-sky-500"
          />

          <p className="mt-2 text-sm text-gray-500">
            Podés incluir talle, medidas, marca, modelo u otros
            detalles relevantes.
          </p>
        </div>

        <ImageManager
          images={formData.imagenes}
          onChange={handleImagesChange}
          onUploadingChange={setImagesUploading}
          validationError={visibleFieldErrors.imagenes}
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving || imagesUploading}
            className="w-full rounded-lg border border-gray-300 bg-white py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-40"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={
              saving ||
              imagesUploading ||
              loadingCategories ||
              mainCategories.length === 0
            }
            className="w-full flex-1 rounded-lg bg-sky-600 py-3 font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Guardando producto..."
              : imagesUploading
                ? "Subiendo imágenes..."
                : "Crear producto"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateProductPage;
