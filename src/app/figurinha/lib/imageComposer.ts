const CARD_FONT = '"Haettenschweiler", "Impact", "Arial Narrow", sans-serif';

const TEXT_POS = {
  nameCenterX: 0.45,
  nameCenterY: 0.94,
  nameMaxWidth: 0.7,
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  weight: string,
  minSize: number,
  maxSize: number,
  font: string
): number {
  let size = maxSize;
  while (size > minSize) {
    ctx.font = `${weight} ${size}px ${font}`;
    if (ctx.measureText(text).width <= maxWidth) return size;
    size -= 2;
  }
  return minSize;
}

export async function composeCard(
  capturedFrame: HTMLCanvasElement,
  personImg: HTMLImageElement | null,
  nome: string
): Promise<HTMLCanvasElement> {
  const [fundoImg, dadosImg] = await Promise.all([
    loadImage("/assets/figurinha/fundo.png"),
    loadImage("/assets/figurinha/dados.png"),
  ]);

  const cardW = fundoImg.naturalWidth;
  const cardH = fundoImg.naturalHeight;

  const canvas = document.createElement("canvas");
  canvas.width = cardW;
  canvas.height = cardH;
  const ctx = canvas.getContext("2d")!;

  // 1) Background
  ctx.drawImage(fundoImg, 0, 0, cardW, cardH);

  // 2) Person photo (cover fit)
  const sourceImg: HTMLImageElement | HTMLCanvasElement = personImg || capturedFrame;
  const srcW = "naturalWidth" in sourceImg ? sourceImg.naturalWidth : sourceImg.width;
  const srcH = "naturalHeight" in sourceImg ? sourceImg.naturalHeight : sourceImg.height;
  const destH = cardH;
  const destW = cardW;
  const srcAspect = srcW / srcH;
  const destAspect = destW / destH;

  let sx = 0, sy = 0, sw = srcW, sh = srcH;
  if (srcAspect > destAspect) {
    sw = srcH * destAspect;
    sx = (srcW - sw) / 2;
  } else {
    sh = srcW / destAspect;
    sy = 0;
  }

  // White border outline around person
  if (personImg) {
    const borderSize = Math.round(cardW * 0.006);
    const offsets: [number, number][] = [];
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      offsets.push([Math.cos(a) * borderSize, Math.sin(a) * borderSize]);
    }

    const silCanvas = document.createElement("canvas");
    silCanvas.width = destW;
    silCanvas.height = destH;
    const silCtx = silCanvas.getContext("2d")!;
    silCtx.drawImage(sourceImg, sx, sy, sw, sh, 0, 0, destW, destH);
    silCtx.globalCompositeOperation = "source-in";
    silCtx.fillStyle = "#FFFFFF";
    silCtx.fillRect(0, 0, destW, destH);

    for (const [ox, oy] of offsets) {
      ctx.drawImage(silCanvas, ox, oy);
    }
  }

  // Draw person
  ctx.drawImage(sourceImg, sx, sy, sw, sh, 0, 0, destW, destH);

  // 3) Dados overlay
  ctx.drawImage(dadosImg, 0, 0, cardW, cardH);

  // 4) Name text
  const nameX = cardW * TEXT_POS.nameCenterX;
  const nameY = cardH * TEXT_POS.nameCenterY;
  const nameMaxW = cardW * TEXT_POS.nameMaxWidth;
  const displayName = nome.toUpperCase();

  const fontSize = fitText(ctx, displayName, nameMaxW, "400", 50, 180, CARD_FONT);
  ctx.font = `400 ${fontSize}px ${CARD_FONT}`;
  ctx.fillStyle = "#1a1a1a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(displayName, nameX, nameY);

  return canvas;
}
