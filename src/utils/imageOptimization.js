const DEFAULT_MAX_DIMENSION = 2400;
const DEFAULT_QUALITY = 0.82;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`No se pudo procesar la imagen "${file.name}".`));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("No se pudo comprimir la imagen seleccionada."));
      },
      type,
      quality,
    );
  });
}

function getOptimizedFileName(fileName) {
  const baseName = fileName.replace(/\.[^.]+$/, "") || "imagen";
  return `${baseName}.webp`;
}

export async function optimizeImageForUpload(
  file,
  {
    maxDimension = DEFAULT_MAX_DIMENSION,
    quality = DEFAULT_QUALITY,
  } = {},
) {
  const image = await loadImage(file);
  const largestSide = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = largestSide > maxDimension ? maxDimension / largestSide : 1;
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("El navegador no pudo preparar la imagen para subirla.");
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  const optimizedBlob = await canvasToBlob(canvas, "image/webp", quality);

  return new File(
    [optimizedBlob],
    getOptimizedFileName(file.name),
    {
      type: optimizedBlob.type || "image/webp",
      lastModified: Date.now(),
    },
  );
}
