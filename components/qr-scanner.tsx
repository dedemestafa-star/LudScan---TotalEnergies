"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";

export default function QRScanner({ onScan }: { onScan: (code: string) => void }) {
  const readerId = "qr-reader";
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showStartButton, setShowStartButton] = useState(true);
  const [hasScanned, setHasScanned] = useState(false);
  const errorCountRef = useRef(0);
  const maxErrorCount = 5; // Further reduce error messages to minimize console spam

  const startScanner = async () => {
    try {
      scannerRef.current = new Html5Qrcode(readerId);
      setIsScanning(true);
      setShowStartButton(false);
      setHasScanned(false); // Reset scan state when starting
      errorCountRef.current = 0; // Reset error count when starting

      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          // Only process if we haven't scanned yet
          if (!hasScanned) {
            // Reset error count on successful scan
            errorCountRef.current = 0;
            console.log("QR Code detected:", decodedText); // Debug log
            setHasScanned(true); // Mark as scanned
            onScan(decodedText);
            
            // Optionally stop scanning after first successful scan
            // stopScanner();
          }
        },
        (errorMessage) => {
          // This error is expected when no QR code is in frame
          // Only log occasionally to reduce console spam
          errorCountRef.current += 1;
          
          // Log first few errors, then periodically log every 50th error
          if (errorCountRef.current <= maxErrorCount || errorCountRef.current % 50 === 0) {
            if (errorCountRef.current === maxErrorCount + 1) {
              console.warn("QR scanning: Suppressing further 'not found' messages (normal when no QR code is visible)");
            } else {
              console.debug("QR scanning debug:", errorMessage); // Use debug level instead of warn
            }
          }
        }
      );
    } catch (err) {
      console.error("Failed to start scanner:", err);
      setIsScanning(false);
      setShowStartButton(true);
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      }
    } catch (e) {
      console.warn("Scanner cleanup error:", e);
    } finally {
      setIsScanning(false);
      setShowStartButton(true);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="w-full flex justify-center mt-6">
      <div id={readerId} style={{ width: "250px" }}></div>
      {showStartButton && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <Button onClick={startScanner} className="bg-red-500 hover:bg-red-600 text-white">
            Start Camera
          </Button>
        </div>
      )}
      {isScanning && !hasScanned && (
        <div className="absolute top-2 right-2">
          <Button 
            onClick={stopScanner} 
            variant="secondary" 
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Stop
          </Button>
        </div>
      )}
      {hasScanned && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <Button onClick={startScanner} className="bg-red-500 hover:bg-red-600 text-white">
            Scan Again
          </Button>
        </div>
      )}
    </div>
  );
}