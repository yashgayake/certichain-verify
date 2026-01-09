import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  Scan,
  Focus,
  Zap,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({
  isOpen,
  onClose,
  onScan,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Simulate camera permission request
      setTimeout(() => setHasPermission(true), 500);
      setIsScanning(true);
      setScanProgress(0);
      setScanComplete(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isScanning && !scanComplete) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isScanning, scanComplete]);

  const handleSimulateScan = () => {
    setScanComplete(true);
    setTimeout(() => {
      onScan('CERT-2024-001');
      onClose();
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate QR code detection from image
      setScanComplete(true);
      setTimeout(() => {
        onScan('CERT-2024-002');
        onClose();
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-12 right-0 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>

        {/* Scanner container */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-card shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-border/50 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Camera className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">QR Scanner</span>
            </div>
            <h3 className="text-xl font-bold">Scan Certificate QR Code</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Position the QR code within the frame
            </p>
          </div>

          {/* Camera viewport */}
          <div className="relative aspect-square bg-black/90">
            {/* Simulated camera feed background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />
            </div>

            {/* Scanning frame */}
            <div className="absolute inset-8 md:inset-16">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-primary rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-12 h-12 border-r-4 border-t-4 border-primary rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-l-4 border-b-4 border-primary rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-primary rounded-br-lg" />

              {/* Scanning line animation */}
              {isScanning && !scanComplete && (
                <div 
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-100"
                  style={{ top: `${scanProgress}%` }}
                />
              )}

              {/* Success overlay */}
              {scanComplete && (
                <div className="absolute inset-0 flex items-center justify-center bg-success/20 rounded-lg animate-scale-in">
                  <div className="w-16 h-16 rounded-full bg-success/30 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-success" />
                  </div>
                </div>
              )}
            </div>

            {/* Focus indicator */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {!scanComplete && (
                <Focus className={cn(
                  "w-8 h-8 text-primary/50 transition-all duration-300",
                  isScanning && "animate-pulse"
                )} />
              )}
            </div>

            {/* Demo QR placeholder */}
            {!scanComplete && (
              <button
                onClick={handleSimulateScan}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm hover:bg-white/20 transition-colors"
              >
                <Zap className="w-4 h-4 inline mr-2" />
                Simulate QR Scan
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="p-6 border-t border-border/50">
            <div className="flex items-center justify-center gap-4">
              {/* Scan status */}
              <div className="flex-1 text-center">
                {isScanning && !scanComplete && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Scan className="w-4 h-4 animate-pulse" />
                    <span>Scanning...</span>
                    <span className="font-mono">{scanProgress.toFixed(0)}%</span>
                  </div>
                )}
                {scanComplete && (
                  <div className="flex items-center justify-center gap-2 text-sm text-success">
                    <CheckCircle className="w-4 h-4" />
                    <span>QR Code Detected!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upload option */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <label className="w-full cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Or upload QR code image
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
