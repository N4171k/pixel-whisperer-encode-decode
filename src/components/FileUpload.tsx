
import { ChangeEvent, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  buttonText: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

const FileUpload = ({ onFileSelected, accept = "image/*", buttonText, variant = "default" }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      <Button 
        variant={variant} 
        onClick={handleButtonClick}
        className="w-full"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default FileUpload;
