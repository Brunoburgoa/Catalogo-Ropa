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

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    talle: "",
    categoria: "",
    epoca: "",
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

  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");

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

        setFormData({
          nombre: product.nombre || "",
          precio: product.precio || "",
          talle: product.talle || "",
          categoria: product.categoria || "",
          epoca: product.epoca || "",
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

    if (formData.imagenes.length === 0) {
      setFormError(
        "La publicación debe tener al menos una imagen.",
      );

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
        className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-2 block font-medium">
            Nombre
          </label>

          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-sky-500"
          />
        </div>

        <div>
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
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Talle
          </label>

          <select
            name="talle"
            value={formData.talle}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
          >
            <option value="">
              Seleccionar talle
            </option>

            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
            <option value="Único">Único</option>

            <option value="36">36</option>
            <option value="38">38</option>
            <option value="40">40</option>
            <option value="42">42</option>
            <option value="44">44</option>
            <option value="46">46</option>
            <option value="48">48</option>
            <option value="50">50</option>
            <option value="52">52</option>
            <option value="54">54</option>
            <option value="56">56</option>
            <option value="58">58</option>
            <option value="60">60</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Categoría
          </label>

          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
            disabled={
              loadingCategories ||
              categories.length === 0
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
          >
            <option value="">
              {loadingCategories
                ? "Cargando categorías..."
                : categories.length === 0
                  ? "No hay categorías"
                  : "Seleccionar categoría"}
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.nombre}
              >
                {category.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Época
          </label>

          <select
            name="epoca"
            value={formData.epoca}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
          >
            <option value="">
              Seleccionar época
            </option>

            <option value="Verano">
              Verano
            </option>

            <option value="Invierno">
              Invierno
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Condición
          </label>

          <select
            name="condicion"
            value={formData.condicion}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
          >
            <option value="">
              Seleccionar condición
            </option>

            <option value="Como nueva">
              Como nueva
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
          <label className="mb-2 block font-medium">
            Estado
          </label>

          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
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
          <label className="mb-2 block font-medium">
            Descripción
          </label>

          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="5"
            required
            className="w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-sky-500"
          />
        </div>

        <ImageManager
          images={formData.imagenes}
          onChange={handleImagesChange}
        />

        <button
          type="submit"
          disabled={
            saving ||
            loadingCategories ||
            categories.length === 0
          }
          className="w-full rounded-lg bg-sky-600 py-3 font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Guardando cambios..."
            : "Guardar cambios"}
        </button>
      </form>
    </main>
  );
}

export default EditProductPage;