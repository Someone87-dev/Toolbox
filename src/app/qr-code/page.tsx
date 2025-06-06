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

export default function QrCodePage() {
  const { toast } = useToast();
  const [qrText, setQrText] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [decodedText, setDecodedText] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
   const [isScanning, setIsScanning] = useState<boolean>(false);


  // Placeholder for QR generation library
  const generateQrCode = async (text: string) => {
    if (!text) {
      setQrDataUrl('');
      return;
    }
    // In a real app, you would use a library like qrcode.react or qrcode
    // For this placeholder, we'll use a public API for simplicity
    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`);
      if (response.ok) {
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setQrDataUrl(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } else {
        toast({ title: 'Error', description: 'Failed to generate QR code.', variant: 'destructive' });
        setQrDataUrl('');
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to generate QR code.', variant: 'destructive' });
      setQrDataUrl('');
    }
  };

  // Placeholder for QR decoding library
  const decodeQrCodeFromFile = async (file: File) => {
    // In a real app, you'd use a library like jsQR or zxing-js
    setDecodedText(`Placeholder: Decoded text from ${file.name} would appear here.`);
    toast({ title: 'Info', description: 'QR Code decoding from file is a placeholder feature.' });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setUploadedImage(file);
      decodeQrCodeFromFile(file);
    }
  };
  
  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        console.error('Camera API not supported in this browser.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    if (isScanning) {
      getCameraPermission();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => { // Cleanup function
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isScanning, toast]);


  // Placeholder for live scanning
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isScanning && hasCameraPermission && videoRef.current) {
      // Placeholder: In a real app, continuously capture frames and attempt to decode
      intervalId = setInterval(() => {
        // console.log("Scanning frame...");
        // Example: if (decodedSuccessfully) { setIsScanning(false); setDecodedText(result); }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isScanning, hasCameraPermission]);


  return (
    <ToolPageLayout title="QR Code Generator & Reader" description="Generate QR codes from text or read them from an image or your camera.">
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Generate QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter text to encode..."
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              rows={4}
            />
            <Button onClick={() => generateQrCode(qrText)} disabled={!qrText}>Generate</Button>
            {qrDataUrl && (
              <div className="mt-4 p-4 border rounded-md flex flex-col items-center">
                <Image src={qrDataUrl} alt="Generated QR Code" width={200} height={200} data-ai-hint="qr code" />
                <Button variant="link" asChild className="mt-2">
                  <a href={qrDataUrl} download="qr-code.png">Download QR Code</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Read QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="qrUpload" className="block text-sm font-medium text-foreground mb-1">Upload Image</label>
              <Input id="qrUpload" type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <Button onClick={() => setIsScanning(prev => !prev)} variant="outline">
              {isScanning ? 'Stop Camera Scan' : 'Scan with Camera'}
            </Button>
            
            {isScanning && (
                <div className="mt-4 p-2 border rounded-md">
                    <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay playsInline muted />
                    {hasCameraPermission === false && (
                         <Alert variant="destructive" className="mt-2">
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access to use this feature. Check your browser settings.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            )}

            {decodedText && (
              <div className="mt-4">
                <h3 className="font-semibold">Decoded Text:</h3>
                <p className="p-2 bg-muted rounded-md break-all">{decodedText}</p>
              </div>
            )}
             {isScanning && !decodedText && <p className="text-sm text-muted-foreground">Position QR code within the frame...</p>}
          </CardContent>
        </Card>
      </div>
       <Alert className="mt-8">
        <AlertTitle>Developer Note</AlertTitle>
        <AlertDescription>
          QR code generation uses a public API for demo purposes. QR code reading (file/camera) is a placeholder and would require a client-side QR decoding library (e.g., jsQR) for full functionality. Camera access requires user permission.
        </AlertDescription>
      </Alert>
    </ToolPageLayout>
  );
}
