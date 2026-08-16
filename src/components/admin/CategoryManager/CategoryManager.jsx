import { useEffect, useState } from "react";

import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../../../services/categoryService";

function CategoryManager() {
  const [categories, setCategories] =
    useState([]);

  const [newCategory, setNewCategory] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

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
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = async (
    event,
  ) => {
    event.preventDefault();

    const categoryName =
      newCategory.trim();

    if (!categoryName) {
      setError(
        "Ingresá un nombre para la categoría.",
      );

      return;
    }

    const alreadyExists =
      categories.some(
        (category) =>
          category.nombre.toLowerCase() ===
          categoryName.toLowerCase(),
      );

    if (alreadyExists) {
      setError(
        "Esa categoría ya existe.",
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      await createCategory(
        categoryName,
      );

      setNewCategory("");

      await loadCategories();
    } catch (error) {
      console.error(
        "Error al crear categoría:",
        error,
      );

      setError(
        "No se pudo crear la categoría.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (
    category,
  ) => {
    const confirmed =
      window.confirm(
        `¿Seguro que querés eliminar la categoría "${category.nombre}"?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteCategory(
        category.id,
        category.nombre,
      );

      setCategories((current) =>
        current.filter(
          (item) =>
            item.id !== category.id,
        ),
      );
    } catch (error) {
      console.error(
        "Error al eliminar categoría:",
        error,
      );

      setError(
        error.message ||
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
          Administrá las categorías utilizadas por las publicaciones.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={
          handleCreateCategory
        }
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="text"
          value={newCategory}
          onChange={(event) =>
            setNewCategory(
              event.target.value,
            )
          }
          placeholder="Nombre de la nueva categoría"
          className="min-w-0 flex-1 rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:bg-white"
        />

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Guardando..."
            : "Agregar categoría"}
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
            {categories.map(
              (category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-4 py-3"
                >
                  <span className="font-medium text-neutral-900">
                    {category.nombre}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteCategory(
                        category,
                      )
                    }
                    className="rounded-xl border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    Eliminar
                  </button>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default CategoryManager;