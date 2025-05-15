
import { useState } from 'react';
import { toast } from 'sonner';

interface SteganographyResult {
  originalCanvas: HTMLCanvasElement | null;
  nulledCanvas: HTMLCanvasElement | null;
  messageCanvas: HTMLCanvasElement | null;
  binaryMessage: string;
  decodedMessage: string;
}

export const useSteganography = () => {
  const [result, setResult] = useState<SteganographyResult>({
    originalCanvas: null,
    nulledCanvas: null,
    messageCanvas: null,
    binaryMessage: '',
    decodedMessage: '',
  });

  const encode = (canvas: HTMLCanvasElement, message: string) => {
    const width = canvas.width;
    const height = canvas.height;
    const context = canvas.getContext('2d');

    if (!context) {
      toast.error("Couldn't get canvas context");
      return;
    }

    // Check if the image is big enough to hide the message
    if (message.length * 8 > width * height * 3) {
      toast.error("Text too long for chosen image");
      return;
    }

    // Create canvases
    const nulledCanvas = document.createElement('canvas');
    nulledCanvas.width = width;
    nulledCanvas.height = height;
    const nulledContext = nulledCanvas.getContext('2d');

    const messageCanvas = document.createElement('canvas');
    messageCanvas.width = width;
    messageCanvas.height = height;
    const messageContext = messageCanvas.getContext('2d');

    if (!nulledContext || !messageContext) {
      toast.error("Couldn't create canvas contexts");
      return;
    }

    // Normalize the original image and draw it
    const original = context.getImageData(0, 0, width, height);
    const pixel = original.data;
    for (let i = 0, n = pixel.length; i < n; i += 4) {
      for (let offset = 0; offset < 3; offset++) {
        if (pixel[i + offset] % 2 !== 0) {
          pixel[i + offset]--;
        }
      }
    }
    nulledContext.putImageData(original, 0, 0);

    // Convert the message to a binary string
    let binaryMessage = "";
    for (let i = 0; i < message.length; i++) {
      let binaryChar = message[i].charCodeAt(0).toString(2);
      // Pad with 0 until the binaryChar has a length of 8 (1 Byte)
      while (binaryChar.length < 8) {
        binaryChar = "0" + binaryChar;
      }
      binaryMessage += binaryChar;
    }

    // Apply the binary string to the image and draw it
    const messageData = nulledContext.getImageData(0, 0, width, height);
    const messagePixel = messageData.data;
    let counter = 0;
    for (let i = 0, n = messagePixel.length; i < n; i += 4) {
      for (let offset = 0; offset < 3; offset++) {
        if (counter < binaryMessage.length) {
          messagePixel[i + offset] += parseInt(binaryMessage[counter]);
          counter++;
        } else {
          break;
        }
      }
    }
    messageContext.putImageData(messageData, 0, 0);

    setResult({
      originalCanvas: canvas,
      nulledCanvas,
      messageCanvas,
      binaryMessage,
      decodedMessage: '',
    });

    toast.success("Message encoded successfully!");
    return { nulledCanvas, messageCanvas, binaryMessage };
  };

  const decode = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');

    if (!context) {
      toast.error("Couldn't get canvas context");
      return;
    }

    const width = canvas.width;
    const height = canvas.height;
    const original = context.getImageData(0, 0, width, height);
    let binaryMessage = "";
    const pixel = original.data;

    for (let i = 0, n = pixel.length; i < n; i += 4) {
      for (let offset = 0; offset < 3; offset++) {
        let value = 0;
        if (pixel[i + offset] % 2 !== 0) {
          value = 1;
        }
        binaryMessage += value;
      }
    }

    let output = "";
    for (let i = 0; i < binaryMessage.length; i += 8) {
      if (i + 8 > binaryMessage.length) break;
      
      let c = 0;
      for (let j = 0; j < 8; j++) {
        c <<= 1;
        c |= parseInt(binaryMessage[i + j]);
      }

      // Stop at null terminator or non-printable character
      if (c === 0 || (c < 32 && c !== 9 && c !== 10 && c !== 13)) break;
      output += String.fromCharCode(c);
    }

    setResult({
      ...result,
      decodedMessage: output,
    });

    toast.success("Message decoded successfully!");
    return output;
  };

  const reset = () => {
    setResult({
      originalCanvas: null,
      nulledCanvas: null,
      messageCanvas: null,
      binaryMessage: '',
      decodedMessage: '',
    });
  };

  return {
    result,
    encode,
    decode,
    reset
  };
};
