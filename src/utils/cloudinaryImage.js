const CLOUDINARY_UPLOAD_MARKER = "/image/upload/";

export function getOptimizedImageUrl(
  url,
  {
    width,
    height,
    crop = "limit",
  } = {},
) {
  if (
    typeof url !== "string" ||
    !url.includes(CLOUDINARY_UPLOAD_MARKER)
  ) {
    return url;
  }

  const resizeParameters = [
    `c_${crop}`,
    width ? `w_${width}` : null,
    height ? `h_${height}` : null,
    crop === "fill" ? "g_auto" : null,
  ].filter(Boolean);

  const transformations = [
    resizeParameters.join(","),
    "f_auto",
    "q_auto",
  ].filter(Boolean);

  return url.replace(
    CLOUDINARY_UPLOAD_MARKER,
    `${CLOUDINARY_UPLOAD_MARKER}${transformations.join("/")}/`,
  );
}
