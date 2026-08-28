import { useEffect, useState } from "react";

import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../../../services/categoryService";

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const mainCategories = categories.filter(
    (category) => !category.categoriaPadre,
  );

  const getParentName = (category) =>
    categories.find(
      (item) => item.id === category.categoriaPadre,
    )?.nombre || "Categoría principal no disponible";

  const loadCategories = async () => {
    try {
      setError("");
      const data = await getCategories();
      setCategories(data);
    } catch (loadError) {
      console.error("Error al cargar categorías:", loadError);
      setError("No se pudieron cargar las categorías.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    getCategories()
      .then((data) => {
        if (isActive) {
          setCategories(data);
        }
      })
      .catch((loadError) => {
        console.error("Error al cargar categorías:", loadError);

        if (isActive) {
          setError("No se pudieron cargar las categorías.");
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

  const handleCreateCategory = async (event) => {
    event.preventDefault();

    const categoryName = newCategory.trim();

    if (!categoryName) {
      setError("Ingresá un nombre para la categoría.");
      return;
    }

    const alreadyExists = categories.some(
      (category) =>
        category.nombre.toLowerCase() ===
          categoryName.toLowerCase() &&
        category.categoriaPadre === parentCategoryId,
    );

    if (alreadyExists) {
      setError(
        parentCategoryId
          ? "Esa subcategoría ya existe dentro de la categoría seleccionada."
          : "Esa categoría principal ya existe.",
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      await createCategory(categoryName, parentCategoryId);
      setNewCategory("");
      setParentCategoryId("");
      await loadCategories();
    } catch (createError) {
      console.error("Error al crear categoría:", createError);
      setError("No se pudo crear la categoría.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    const categoryType = category.categoriaPadre
      ? "subcategoría"
      : "categoría principal";
    const confirmed = window.confirm(
      `¿Seguro que querés eliminar la ${categoryType} "${category.nombre}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      await deleteCategory(category);
      setCategories((current) =>
        current.filter((item) => item.id !== category.id),
      );
    } catch (deleteError) {
      console.error("Error al eliminar categoría:", deleteError);
      setError(
        deleteError.message ||
          "No se pudo eliminar la categoría.",
      );
    }
  };

  return (
    <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-neutral-950">
          Categorías
        </h3>

        <p className="mt-1 text-sm text-neutral-500">
          Creá categorías principales o elegí una categoría padre
          para agregar una subcategoría.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleCreateCategory}
        className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
      >
        <label className="min-w-0">
          <span className="mb-2 block text-sm font-semibold text-neutral-700">
            Nombre
          </span>

          <input
            type="text"
            value={newCategory}
            onChange={(event) => {
              setNewCategory(event.target.value);
              setError("");
            }}
            placeholder="Ej: Ropa o Remeras"
            className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:bg-white"
          />
        </label>

        <label className="min-w-0">
          <span className="mb-2 block text-sm font-semibold text-neutral-700">
            Categoría padre
          </span>

          <select
            value={parentCategoryId}
            onChange={(event) => {
              setParentCategoryId(event.target.value);
              setError("");
            }}
            className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:bg-white"
          >
            <option value="">
              Ninguna (será categoría principal)
            </option>

            {mainCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nombre}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="self-end rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Agregar categoría"}
        </button>
      </form>

      <div className="mt-6">
        {loading ? (
          <div className="rounded-xl bg-neutral-50 p-5 text-sm text-neutral-500">
            Cargando categorías...
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-xl bg-neutral-50 p-5 text-sm text-neutral-500">
            No hay categorías cargadas.
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-4 py-3"
              >
                <div className="min-w-0">
                  <span className="block truncate font-medium text-neutral-900">
                    {category.nombre}
                  </span>

                  <span className="mt-1 block text-xs text-neutral-500">
                    {category.categoriaPadre
                      ? `Subcategoría de ${getParentName(category)}`
                      : "Categoría principal"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteCategory(category)}
                  className="shrink-0 rounded-xl border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CategoryManager;
