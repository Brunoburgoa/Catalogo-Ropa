import { useEffect, useState } from "react";

import { uploadImages } from "../../../services/cloudinaryService";

function ImageManager({
  images,
  onChange,
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) {
      return;
    }

    const remainingSlots = 6 - images.length;

    if (files.length > remainingSlots) {
      setError(
        `Solo podés agregar ${remainingSlots} imagen${
          remainingSlots === 1 ? "" : "es"
        } más.`,
      );

      event.target.value = "";
      return;
    }

    const invalidFile = files.find(
      (file) => !file.type.startsWith("image/"),
    );

    if (invalidFile) {
      setError("Solo se pueden seleccionar imágenes.");

      event.target.value = "";
      return;
    }

    try {
      setError("");
      setUploading(true);

      const previews = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      /*
       * Mostramos las imágenes inmediatamente mientras
       * se realiza la subida.
       */
      const temporaryImages = [
        ...images,
        ...previews.map((item) => item.preview),
      ];

      onChange(temporaryImages);

      /*
       * Subimos las imágenes a Cloudinary.
       */
      const uploadedUrls = await uploadImages(files);

      /*
       * Reemplazamos las URLs temporales por las
       * URLs definitivas de Cloudinary.
       */
      const currentImages = images;

      onChange([
        ...currentImages,
        ...uploadedUrls,
      ]);

      previews.forEach((item) => {
        URL.revokeObjectURL(item.preview);
      });
    } catch (error) {
      console.error(
        "Error al subir las imágenes:",
        error,
      );

      setError(
        "No se pudieron subir las imágenes.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter(
      (_, imageIndex) => imageIndex !== index,
    );

    onChange(newImages);
  };

  const moveImage = (index, direction) => {
    const newImages = [...images];

    const newIndex =
      direction === "left"
        ? index - 1
        : index + 1;

    if (
      newIndex < 0 ||
      newIndex >= newImages.length
    ) {
      return;
    }

    [
      newImages[index],
      newImages[newIndex],
    ] = [
      newImages[newIndex],
      newImages[index],
    ];

    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block font-medium">
          Imágenes
        </label>

        <p className="text-sm text-gray-500">
          Máximo 6 imágenes. La primera será la imagen
          principal.
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="relative overflow-hidden rounded-lg border bg-white"
            >
              <img
                src={image}
                alt={`Producto - imagen ${index + 1}`}
                className="aspect-square w-full object-cover"
              />

              {index === 0 && (
                <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
                  Principal
                </span>
              )}

              <div className="absolute bottom-2 left-2 right-2 flex justify-between gap-2">
                <button
                  type="button"
                  onClick={() =>
                    moveImage(index, "left")
                  }
                  disabled={
                    index === 0 || uploading
                  }
                  className="rounded bg-black/70 px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={() =>
                    removeImage(index)
                  }
                  disabled={uploading}
                  className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Eliminar
                </button>

                <button
                  type="button"
                  onClick={() =>
                    moveImage(index, "right")
                  }
                  disabled={
                    index === images.length - 1 ||
                    uploading
                  }
                  className="rounded bg-black/70 px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {images.length < 6 && (
          <label
            className={`cursor-pointer rounded-lg border border-gray-300 px-4 py-2.5 text-center font-medium hover:bg-gray-100 ${
              uploading
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
          >
            {uploading
              ? "Subiendo imágenes..."
              : "Seleccionar imágenes"}

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export default ImageManager;