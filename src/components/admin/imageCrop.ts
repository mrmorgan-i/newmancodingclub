import type { Area } from 'react-easy-crop';

const MAX_OUTPUT_DIMENSION = 1200;

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = 'anonymous';
    image.addEventListener('load', () => resolve(image), { once: true });
    image.addEventListener('error', () => reject(new Error('The image could not be loaded.')), {
      once: true,
    });
    image.src = source;
  });
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function rotatedBounds(width: number, height: number, rotation: number) {
  const radians = toRadians(rotation);

  return {
    width: Math.abs(Math.cos(radians) * width) + Math.abs(Math.sin(radians) * height),
    height: Math.abs(Math.sin(radians) * width) + Math.abs(Math.cos(radians) * height),
  };
}

export async function cropHeadshot(
  source: string,
  crop: Area,
  rotation: number,
): Promise<File> {
  const image = await loadImage(source);
  const bounds = rotatedBounds(image.naturalWidth, image.naturalHeight, rotation);
  const sourceCanvas = document.createElement('canvas');
  const sourceContext = sourceCanvas.getContext('2d');

  if (!sourceContext) throw new Error('Image editing is not available in this browser.');

  sourceCanvas.width = Math.ceil(bounds.width);
  sourceCanvas.height = Math.ceil(bounds.height);
  sourceContext.translate(sourceCanvas.width / 2, sourceCanvas.height / 2);
  sourceContext.rotate(toRadians(rotation));
  sourceContext.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);
  sourceContext.drawImage(image, 0, 0);

  const scale = Math.min(1, MAX_OUTPUT_DIMENSION / Math.max(crop.width, crop.height));
  const outputCanvas = document.createElement('canvas');
  const outputContext = outputCanvas.getContext('2d');

  if (!outputContext) throw new Error('Image editing is not available in this browser.');

  outputCanvas.width = Math.max(1, Math.round(crop.width * scale));
  outputCanvas.height = Math.max(1, Math.round(crop.height * scale));
  outputContext.imageSmoothingEnabled = true;
  outputContext.imageSmoothingQuality = 'high';
  outputContext.drawImage(
    sourceCanvas,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outputCanvas.width,
    outputCanvas.height,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    outputCanvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error('The edited image could not be saved.'));
      },
      'image/jpeg',
      0.92,
    );
  });

  return new File([blob], 'leadership-headshot.jpg', {
    type: 'image/jpeg',
    lastModified: Date.now(),
  });
}
