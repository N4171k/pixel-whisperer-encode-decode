
import { useState, useRef, ChangeEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SteganoTabs, TabsContent } from "@/components/SteganoTabs";
import FileUpload from "@/components/FileUpload";
import ImagePreview from "@/components/ImagePreview";
import MessageInput from "@/components/MessageInput";
import { useSteganography } from "@/hooks/useSteganography";
import { previewImage, downloadCanvas } from "@/utils/imageUtils";
import { ArrowDown } from "lucide-react";

const Index = () => {
  const { result, encode, decode, reset } = useSteganography();
  
  // Encode states
  const [encodeFile, setEncodeFile] = useState<File | null>(null);
  const [encodeCanvas, setEncodeCanvas] = useState<HTMLCanvasElement | null>(null);
  const [message, setMessage] = useState<string>("");
  
  // Decode states
  const [decodeFile, setDecodeFile] = useState<File | null>(null);
  const [decodeCanvas, setDecodeCanvas] = useState<HTMLCanvasElement | null>(null);
  
  const handleEncodeFileSelect = (file: File) => {
    setEncodeFile(file);
    previewImage(file, (canvas) => {
      setEncodeCanvas(canvas);
    });
  };
  
  const handleDecodeFileSelect = (file: File) => {
    setDecodeFile(file);
    previewImage(file, (canvas) => {
      setDecodeCanvas(canvas);
    });
  };
  
  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  
  const handleEncode = () => {
    if (encodeCanvas && message) {
      encode(encodeCanvas, message);
    }
  };
  
  const handleDecode = () => {
    if (decodeCanvas) {
      decode(decodeCanvas);
    }
  };
  
  const handleDownload = (canvas: HTMLCanvasElement | null, prefix: string) => {
    if (canvas) {
      downloadCanvas(canvas, `${prefix}-${Date.now()}.png`);
    }
  };
  
  return (
    <div className="steganography-container">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
          Steganography Tool
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Hide secret messages in images using steganography. This tool allows you to encode text 
          within an image and decode messages from images containing hidden data.
        </p>
      </div>
      
      <SteganoTabs>
        <TabsContent value="encode">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 h-fit">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">1. Select Image</h2>
                  <FileUpload
                    onFileSelected={handleEncodeFileSelect}
                    buttonText={encodeFile ? "Change Image" : "Select Image"}
                  />
                  {encodeFile && (
                    <p className="text-xs text-muted-foreground mt-2 truncate">
                      {encodeFile.name}
                    </p>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <h2 className="text-lg font-medium mb-4">2. Enter Message</h2>
                  <MessageInput
                    value={message}
                    onChange={handleMessageChange}
                    label="Message to Hide"
                    placeholder="Type your secret message here..."
                  />
                </div>
                
                <Button 
                  onClick={handleEncode}
                  disabled={!encodeCanvas || !message}
                  className="w-full"
                >
                  Encode Message
                </Button>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4">Image Processing</h2>
                
                <div className="space-y-6">
                  {encodeCanvas && (
                    <ImagePreview canvas={encodeCanvas} title="Original Image" />
                  )}
                  
                  {result.nulledCanvas && (
                    <>
                      <div className="flex justify-center">
                        <ArrowDown className="text-muted-foreground" size={20} />
                      </div>
                      
                      <ImagePreview canvas={result.nulledCanvas} title="Normalized Image" />
                      
                      <div className="flex justify-center">
                        <ArrowDown className="text-muted-foreground" size={20} />
                      </div>
                      
                      <div className="flex flex-col gap-4">
                        <ImagePreview canvas={result.messageCanvas!} title="Encoded Image" />
                        
                        <div className="flex flex-wrap gap-4 mt-2 justify-end">
                          <Button 
                            onClick={() => handleDownload(result.nulledCanvas, 'normalized')}
                            variant="outline"
                          >
                            Download Normalized
                          </Button>
                          <Button 
                            onClick={() => handleDownload(result.messageCanvas, 'encoded')}
                          >
                            Download Encoded
                          </Button>
                        </div>
                        
                        {result.binaryMessage && (
                          <div className="mt-4">
                            <h3 className="text-sm font-medium mb-2">Binary Representation:</h3>
                            <Card className="overflow-hidden">
                              <pre className="binary-text p-4 max-h-32 overflow-auto bg-muted">
                                {result.binaryMessage}
                              </pre>
                            </Card>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                  {!encodeCanvas && (
                    <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                      <p className="text-muted-foreground">
                        Select an image to begin encoding
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="decode">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 h-fit">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">1. Select Encoded Image</h2>
                  <FileUpload
                    onFileSelected={handleDecodeFileSelect}
                    buttonText={decodeFile ? "Change Image" : "Select Image"}
                  />
                  {decodeFile && (
                    <p className="text-xs text-muted-foreground mt-2 truncate">
                      {decodeFile.name}
                    </p>
                  )}
                </div>
                
                <Button 
                  onClick={handleDecode}
                  disabled={!decodeCanvas}
                  className="w-full"
                >
                  Decode Message
                </Button>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4">Decoded Results</h2>
                
                {decodeCanvas && (
                  <div className="space-y-6">
                    <ImagePreview canvas={decodeCanvas} title="Encoded Image" />
                    
                    {result.decodedMessage && (
                      <div className="space-y-4 mt-6">
                        <h3 className="text-sm font-medium">Hidden Message:</h3>
                        <MessageInput
                          value={result.decodedMessage}
                          onChange={() => {}}
                          label=""
                          readOnly
                          className="binary-text"
                          rows={6}
                        />
                      </div>
                    )}
                  </div>
                )}
                
                {!decodeCanvas && (
                  <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                    <p className="text-muted-foreground">
                      Select an encoded image to extract hidden message
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </SteganoTabs>
      
      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>Steganography Tool • Secure message hiding in digital images</p>
      </footer>
    </div>
  );
};

export default Index;
