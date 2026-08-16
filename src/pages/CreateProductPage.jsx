import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createProduct } from "../services/productService";
import { getCategories } from "../services/categoryService";

import ImageManager from "../components/admin/ImageManager/ImageManager";

function CreateProductPage() {
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
    imagenes: [],
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
  };

  const handleImagesChange = (images) => {
    setFormData((current) => ({
      ...current,
      imagenes: images,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.imagenes.length === 0) {
      setError(
        "Debés agregar al menos una imagen para crear la publicación.",
      );

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
            placeholder="Ej: Remera Adidas"
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
            placeholder="Ej: 18000"
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

            <option value="Verano">Verano</option>
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

        <div>
          <label className="mb-2 block font-medium">
            Descripción
          </label>

          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Escribí una descripción del producto..."
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
            ? "Guardando producto..."
            : "Crear producto"}
        </button>
      </form>
    </main>
  );
}

export default CreateProductPage;