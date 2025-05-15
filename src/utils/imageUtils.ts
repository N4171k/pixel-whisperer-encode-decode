
export const previewImage = (
  file: File,
  callback: (canvas: HTMLCanvasElement, width: number, height: number) => void
): void => {
  const reader = new FileReader();
  const image = new Image();

  reader.readAsDataURL(file);
  reader.onloadend = () => {
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(image, 0, 0);
        callback(canvas, image.width, image.height);
      }
    };
  };
};

export const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      }
    }, 'image/png');
  });
};

export const downloadCanvas = (canvas: HTMLCanvasElement, filename: string): void => {
  canvasToBlob(canvas).then((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
};
