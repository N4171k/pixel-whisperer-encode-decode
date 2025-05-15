
import { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";

interface ImagePreviewProps {
  canvas: HTMLCanvasElement | null;
  title: string;
}

const ImagePreview = ({ canvas, title }: ImagePreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const targetCanvas = canvasRef.current;
    if (canvas && targetCanvas) {
      const context = targetCanvas.getContext('2d');
      targetCanvas.width = canvas.width;
      targetCanvas.height = canvas.height;
      
      if (context) {
        context.drawImage(canvas, 0, 0);
      }
    }
  }, [canvas]);

  if (!canvas) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-3 bg-card border-b">
        <h3 className="font-medium text-sm">{title}</h3>
      </div>
      <div className="max-h-[400px] overflow-auto p-2 flex justify-center">
        <canvas 
          ref={canvasRef} 
          className="max-w-full"
        />
      </div>
    </Card>
  );
};

export default ImagePreview;
