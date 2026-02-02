import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode, Download } from 'lucide-react';

interface QRCodeDialogProps {
  matchId: string;
  accessCode: string;
}

export function QRCodeDialog({ matchId, accessCode }: QRCodeDialogProps) {
  const viewerUrl = `${window.location.origin}/match/${matchId}`;

  const downloadQR = () => {
    const svg = document.getElementById('match-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `match-${accessCode}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode className="w-4 h-4 mr-1" />
          QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Share Match</DialogTitle>
          <DialogDescription>
            Scan this QR code to view the live scoreboard
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="bg-white p-4 rounded-lg">
            <QRCodeSVG
              id="match-qr-code"
              value={viewerUrl}
              size={200}
              level="H"
              includeMargin
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Access Code: <span className="font-mono font-bold">{accessCode}</span>
          </p>
          <p className="text-xs text-muted-foreground text-center break-all max-w-full">
            {viewerUrl}
          </p>
          <Button onClick={downloadQR} variant="secondary" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
