import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getProductById,
  updateProduct,
} from "../services/productService";

import {
  getCategories,
} from "../services/categoryService";

import ImageManager from "../components/admin/ImageManager/ImageManager";
import { isClothingCategory } from "../utils/category";
import { validateProduct } from "../utils/productValidation";

function EditProductPage() {
  const { id } = useParams();
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
    visible: true,
    imagenes: [],
  });

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [saving, setSaving] = useState(false);
  const [imagesUploading, setImagesUploading] =
    useState(false);

  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");

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
  const isFormValid =
    Object.keys(fieldErrors).length === 0;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setLoadingCategories(true);

        setLoadError("");

        const [product, categoryData] =
          await Promise.all([
            getProductById(id),
            getCategories(),
          ]);

        if (!product) {
          setLoadError("El producto no existe.");
          return;
        }

        const selectedMainCategory = categoryData.find(
          (category) =>
            !category.categoriaPadre &&
            (category.id === product.categoriaId ||
              category.nombre === product.categoria),
        );
        const selectedSubcategory = categoryData.find(
          (category) =>
            category.categoriaPadre === selectedMainCategory?.id &&
            (category.id === product.subcategoriaId ||
              category.nombre === product.subcategoria),
        );

        setFormData({
          nombre: product.nombre || "",
          precio: product.precio || "",
          categoriaId: selectedMainCategory?.id || "",
          categoria:
            selectedMainCategory?.nombre ||
            product.categoria ||
            "",
          subcategoriaId: selectedSubcategory?.id || "",
          subcategoria:
            selectedSubcategory?.nombre ||
            product.subcategoria ||
            "",
          temporada: product.temporada || "",
          condicion: product.condicion || "",
          estado:
            product.estado || "Disponible",
          descripcion:
            product.descripcion || "",
          visible:
            product.visible ?? true,
          imagenes: product.imagenes || [],
        });

        setCategories(categoryData);
      } catch (error) {
        console.error(
          "Error al cargar los datos:",
          error,
        );

        setLoadError(
          "No se pudo cargar el producto.",
        );
      } finally {
        setLoading(false);
        setLoadingCategories(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");
  };

  const handleVisibleChange = (event) => {
    setFormData((current) => ({
      ...current,
      visible: event.target.checked,
    }));

    setFormError("");
  };

  const handleImagesChange = (images) => {
    setFormData((current) => ({
      ...current,
      imagenes: images,
    }));

    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid || imagesUploading) {
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      await updateProduct(id, formData);

      navigate("/admin");
    } catch (error) {
      console.error(
        "Error al actualizar el producto:",
        error,
      );

      setFormError(
        "No se pudo actualizar el producto.",
      );
    } finally {
      setSaving(false);
    }
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
    setFormError("");
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
    setFormError("");
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Cargando producto...
        </p>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
          {loadError}
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="rounded-lg border px-4 py-2 font-medium hover:bg-gray-100"
        >
          Volver al panel
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Editar producto
          </h1>

          <p className="mt-1 text-gray-500">
            Modificá los datos del producto.
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

      {formError && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
          {formError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
      >
        <div>
          {fieldErrors.nombre && (
            <p
              id="nombre-error"
              role="alert"
              className="mb-3 rounded-lg bg-red-100 p-3 text-sm text-red-700"
            >
              {fieldErrors.nombre}
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
            placeholder="Ej: campera, celular, mesa..."
            required
            aria-invalid={Boolean(fieldErrors.nombre)}
            aria-describedby={
              fieldErrors.nombre ? "nombre-error" : undefined
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-sky-500"
          />
        </div>

        <div>
          {fieldErrors.precio && (
            <p
              id="precio-error"
              role="alert"
              className="mb-3 rounded-lg bg-red-100 p-3 text-sm text-red-700"
            >
              {fieldErrors.precio}
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
            min="0"
            required
            aria-invalid={Boolean(fieldErrors.precio)}
            aria-describedby={
              fieldErrors.precio ? "precio-error" : undefined
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-sky-500"
          />
        </div>

        <div>
          {fieldErrors.categoriaId && (
            <p
              id="categoriaId-error"
              role="alert"
              className="mb-3 rounded-lg bg-red-100 p-3 text-sm text-red-700"
            >
              {fieldErrors.categoriaId}
            </p>
          )}

          <label className="mb-2 block font-medium">
            Categoría principal
          </label>

          <select
            name="categoriaId"
            value={formData.categoriaId}
            onChange={handleCategoryChange}
            required
            aria-invalid={Boolean(fieldErrors.categoriaId)}
            aria-describedby={
              fieldErrors.categoriaId
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
          {fieldErrors.subcategoriaId && (
            <p
              id="subcategoriaId-error"
              role="alert"
              className="mb-3 rounded-lg bg-red-100 p-3 text-sm text-red-700"
            >
              {fieldErrors.subcategoriaId}
            </p>
          )}

          <label className="mb-2 block font-medium">
            Subcategoría
          </label>

          <select
            name="subcategoriaId"
            value={formData.subcategoriaId}
            onChange={handleSubcategoryChange}
            required={availableSubcategories.length > 0}
            disabled={
              !formData.categoriaId ||
              availableSubcategories.length === 0
            }
            aria-invalid={Boolean(fieldErrors.subcategoriaId)}
            aria-describedby={
              fieldErrors.subcategoriaId
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
          {fieldErrors.temporada && (
            <p
              id="temporada-error"
              role="alert"
              className="mb-3 rounded-lg bg-red-100 p-3 text-sm text-red-700"
            >
              {fieldErrors.temporada}
            </p>
          )}

          <label className="mb-2 block font-medium">
            Temporada
          </label>

          <select
            name="temporada"
            value={formData.temporada}
            onChange={handleChange}
            required
            aria-invalid={Boolean(fieldErrors.temporada)}
            aria-describedby={
              fieldErrors.temporada
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
          {fieldErrors.condicion && (
            <p
              id="condicion-error"
              role="alert"
              className="mb-3 rounded-lg bg-red-100 p-3 text-sm text-red-700"
            >
              {fieldErrors.condicion}
            </p>
          )}

          <label className="mb-2 block font-medium">
            Condición
          </label>

          <select
            name="condicion"
            value={formData.condicion}
            onChange={handleChange}
            required
            aria-invalid={Boolean(fieldErrors.condicion)}
            aria-describedby={
              fieldErrors.condicion
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
          {fieldErrors.estado && (
            <p
              id="estado-error"
              role="alert"
              className="mb-3 rounded-lg bg-red-100 p-3 text-sm text-red-700"
            >
              {fieldErrors.estado}
            </p>
          )}

          <label className="mb-2 block font-medium">
            Estado
          </label>

          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
            aria-invalid={Boolean(fieldErrors.estado)}
            aria-describedby={
              fieldErrors.estado ? "estado-error" : undefined
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

        <div className="flex items-center gap-3">
          <input
            id="visible"
            type="checkbox"
            checked={formData.visible}
            onChange={handleVisibleChange}
            className="h-4 w-4"
          />

          <label
            htmlFor="visible"
            className="font-medium"
          >
            Producto visible en el catálogo
          </label>
        </div>

        <div>
          {fieldErrors.descripcion && (
            <p
              id="descripcion-error"
              role="alert"
              className="mb-3 rounded-lg bg-red-100 p-3 text-sm text-red-700"
            >
              {fieldErrors.descripcion}
            </p>
          )}

          <label className="mb-2 block font-medium">
            Descripción
          </label>

          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="5"
            required
            aria-invalid={Boolean(fieldErrors.descripcion)}
            aria-describedby={
              fieldErrors.descripcion
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
          validationError={fieldErrors.imagenes}
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
              !isFormValid ||
              loadingCategories ||
              mainCategories.length === 0
            }
            className="w-full flex-1 rounded-lg bg-sky-600 py-3 font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Guardando cambios..."
              : imagesUploading
                ? "Subiendo imágenes..."
                : "Guardar cambios"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default EditProductPage;
