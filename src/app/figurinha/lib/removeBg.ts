const REMOVE_BG_API_KEY = "P3xTjeMNWLX5fat5V39UxNgf";

export async function removeBackground(canvas: HTMLCanvasElement): Promise<HTMLImageElement> {
  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), "image/png")
  );

  const formData = new FormData();
  formData.append("image_file", blob, "photo.png");
  formData.append("size", "auto");

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": REMOVE_BG_API_KEY },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`remove.bg erro ${response.status}: ${text}`);
  }

  const resultBlob = await response.blob();
  const url = URL.createObjectURL(resultBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}
