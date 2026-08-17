import { useState } from "react";

import { uploadImages } from "../../../services/cloudinaryService";
import { getOptimizedImageUrl } from "../../../utils/cloudinaryImage";

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const ACCEPTED_IMAGE_FORMATS = ".jpg,.jpeg,.png,.webp";

function ImageManager({
  images,
  onChange,
  onUploadingChange,
  validationError,
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) {
      return;
    }

    const remainingSlots = MAX_IMAGES - images.length;

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
      (file) => !ALLOWED_IMAGE_TYPES.has(file.type),
    );

    if (invalidFile) {
      setError(
        "Formato no permitido. Usá imágenes JPG, JPEG, PNG o WebP.",
      );

      event.target.value = "";
      return;
    }

    const oversizedFile = files.find(
      (file) => file.size > MAX_FILE_SIZE,
    );

    if (oversizedFile) {
      setError(
        `La imagen "${oversizedFile.name}" supera el máximo de 10 MB.`,
      );

      event.target.value = "";
      return;
    }

    let previews = [];

    try {
      setError("");
      setUploading(true);
      onUploadingChange?.(true);

      previews = files.map((file) => ({
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

      onChange(images);
      previews.forEach((item) => {
        URL.revokeObjectURL(item.preview);
      });
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
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
        {validationError && (
          <p
            id="imagenes-error"
            role="alert"
            className="mb-3 rounded-lg bg-red-100 p-3 text-sm text-red-700"
          >
            {validationError}
          </p>
        )}

        <label className="mb-2 block font-medium">
          Imágenes
        </label>

        <p className="text-sm text-gray-500">
          Máximo 6 imágenes de hasta 10 MB cada una. Formatos JPG,
          JPEG, PNG o WebP. La primera será la imagen principal.
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
                src={getOptimizedImageUrl(image, {
                  width: 480,
                  height: 480,
                  crop: "fill",
                })}
                alt={`Producto - imagen ${index + 1}`}
                loading="lazy"
                decoding="async"
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
        {images.length < MAX_IMAGES && (
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
              accept={ACCEPTED_IMAGE_FORMATS}
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
