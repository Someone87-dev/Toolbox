
'use client';

import ToolPageLayout from '@/components/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import jsQR from 'jsqr';
import { Camera, FileImage, Zap, RotateCcw } from 'lucide-react';

export default function QrCodePage() {
  const { toast } = useToast();
  const [qrText, setQrText] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [decodedText, setDecodedText] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanError, setScanError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const animationFrameId = useRef<number | null>(null);


  const generateQrCode = async (text: string) => {
    if (!text) {
      setQrDataUrl('');
      toast({ title: 'Input Required', description: 'Please enter text to generate a QR code.', variant: 'default' });
      return;
    }
    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(text)}&format=png`);
      if (response.ok) {
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setQrDataUrl(reader.result as string);
          toast({ title: 'QR Generated', description: 'QR code successfully created.' });
        };
        reader.readAsDataURL(blob);
      } else {
        toast({ title: 'Error', description: 'Failed to generate QR code from API.', variant: 'destructive' });
        setQrDataUrl('');
      }
    } catch (error) {
      console.error('QR generation error:', error);
      toast({ title: 'Error', description: 'An error occurred while generating the QR code.', variant: 'destructive' });
      setQrDataUrl('');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDecodedText('');
      setScanError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (ctx) {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0, img.width, img.height);
              const imageData = ctx.getImageData(0, 0, img.width, img.height);
              const code = jsQR(imageData.data, imageData.width, imageData.height);
              if (code) {
                setDecodedText(code.data);
                toast({ title: 'QR Decoded', description: 'Successfully read QR code from image.' });
              } else {
                setScanError('No QR code found in the uploaded image.');
                toast({ title: 'Decoding Failed', description: 'Could not find a QR code in the image.', variant: 'destructive' });
              }
            }
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (ctx) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code) {
          setDecodedText(code.data);
          setIsScanning(false); // Stop scanning once found
          toast({ title: 'QR Code Scanned!', description: 'Successfully read QR code from camera.' });
        }
      }
    }
    if (isScanning) { // only continue if isScanning is still true
        animationFrameId.current = requestAnimationFrame(tick);
    }
  };

  const startScan = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({ title: 'Error', description: 'Camera API not supported in this browser.', variant: 'destructive'});
        return;
    }
    setDecodedText('');
    setScanError(null);
    setIsScanning(true);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setHasCameraPermission(true);
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play(); // Ensure video plays
            animationFrameId.current = requestAnimationFrame(tick);
        }
    } catch (err) {
        console.error("Error accessing camera: ", err);
        setHasCameraPermission(false);
        setIsScanning(false);
        if (err instanceof DOMException && err.name === "NotAllowedError") {
            setScanError("Camera permission was denied. Please enable it in your browser settings.");
            toast({ title: 'Camera Access Denied', description: 'Please enable camera permissions.', variant: 'destructive' });
        } else {
            setScanError("Could not access the camera. Make sure it's not in use by another application.");
            toast({ title: 'Camera Error', description: 'Could not access the camera.', variant: 'destructive' });
        }
    }
  };

  const stopScan = () => {
    setIsScanning(false);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    // Cleanup function to stop camera when component unmounts or isScanning becomes false
    return () => {
      stopScan();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  // Effect to manage scanning state
  useEffect(() => {
    if (!isScanning) {
      stopScan();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScanning]);
  

  return (
    <ToolPageLayout title="QR Code Generator & Reader" description="Generate QR codes or read them from files/camera.">
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Zap className="mr-2 h-5 w-5 text-primary" />Generate QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter text or URL to encode..."
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              rows={4}
              aria-label="Text to encode in QR code"
            />
            <Button onClick={() => generateQrCode(qrText)} disabled={!qrText} className="w-full">
              <Zap className="mr-2 h-4 w-4" />Generate QR Code
            </Button>
            {qrDataUrl && (
              <div className="mt-4 p-4 border rounded-md flex flex-col items-center bg-muted/20">
                <Image src={qrDataUrl} alt="Generated QR Code" width={200} height={200} data-ai-hint="qr code" className="rounded-md shadow-md" />
                <Button variant="link" asChild className="mt-2">
                  <a href={qrDataUrl} download="qr-code.png">Download QR Code</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><RotateCcw className="mr-2 h-5 w-5 text-primary" />Read QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
              <FileImage className="mr-2 h-4 w-4" />Read from Image File
            </Button>
            <Input id="qrUpload" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
            
            <Button onClick={isScanning ? stopScan : startScan} variant="outline" className="w-full">
              <Camera className="mr-2 h-4 w-4" />{isScanning ? 'Stop Camera Scan' : 'Scan with Camera'}
            </Button>
            
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {isScanning && (
                <div className="mt-4 p-2 border rounded-md bg-muted/20">
                    <video ref={videoRef} className="w-full aspect-video rounded-md bg-black" autoPlay playsInline muted />
                    {hasCameraPermission === false && !scanError && (
                         <Alert variant="destructive" className="mt-2">
                            <AlertTitle>Camera Permission Needed</AlertTitle>
                            <AlertDescription>
                                Camera access is required for live scanning. Please allow access in your browser settings.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            )}

            {scanError && (
              <Alert variant="destructive" className="mt-2">
                <AlertTitle>Scan Error</AlertTitle>
                <AlertDescription>{scanError}</AlertDescription>
              </Alert>
            )}

            {decodedText && (
              <div className="mt-4 space-y-2">
                <h3 className="font-semibold text-lg">Decoded Text:</h3>
                <Textarea value={decodedText} readOnly rows={4} className="bg-muted/30" aria-label="Decoded QR code text"/>
                 <Button onClick={() => navigator.clipboard.writeText(decodedText)} variant="ghost" size="sm">Copy to Clipboard</Button>
              </div>
            )}
            {isScanning && !decodedText && !scanError && <p className="text-sm text-center text-muted-foreground">Position QR code within camera view...</p>}
          </CardContent>
        </Card>
      </div>
      <Alert className="mt-8">
        <AlertTitle>Functionality Notes</AlertTitle>
        <AlertDescription>
          QR code generation uses a public API. QR code reading from files and camera is implemented using client-side JavaScript (jsQR). Camera access requires user permission. For best camera scanning results, ensure good lighting and a clear QR code.
        </AlertDescription>
      </Alert>
    </ToolPageLayout>
  );
}
