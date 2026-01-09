import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Download, Share2, QrCode } from 'lucide-react';
import { Certificate } from '@/types/certificate';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CertificateCardProps {
  certificate: Certificate;
  showActions?: boolean;
  variant?: 'compact' | 'full';
}

const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  showActions = true,
  variant = 'full',
}) => {
  const statusVariant = {
    valid: 'valid' as const,
    revoked: 'revoked' as const,
    pending: 'pending' as const,
  };

  if (variant === 'compact') {
    return (
      <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-4 transition-all duration-300 hover:shadow-lg hover:border-primary/30">
        <div className="flex items-center justify-between mb-3">
          <Badge variant={statusVariant[certificate.status]} className="uppercase text-xs">
            {certificate.status}
          </Badge>
          <span className="font-mono text-xs text-muted-foreground">{certificate.id}</span>
        </div>
        <h3 className="font-semibold mb-1">{certificate.studentName}</h3>
        <p className="text-sm text-muted-foreground">{certificate.course}</p>
        <p className="text-sm text-muted-foreground">{certificate.degree} • {certificate.year}</p>
        
        <Link 
          to={`/certificate/${certificate.id}`}
          className="absolute inset-0"
        />
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary/30">
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {certificate.studentName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{certificate.studentName}</h3>
              <p className="text-sm text-muted-foreground font-mono">
                {certificate.studentWallet}
              </p>
            </div>
          </div>
          <Badge variant={statusVariant[certificate.status]} className="uppercase text-xs">
            {certificate.status}
          </Badge>
        </div>

        {/* Certificate Details */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Course</p>
              <p className="font-medium">{certificate.course}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Degree</p>
              <p className="font-medium">{certificate.degree}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Year</p>
              <p className="font-medium">{certificate.year}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Issue Date</p>
              <p className="font-medium">{certificate.issueDate}</p>
            </div>
          </div>
        </div>

        {/* Blockchain Info */}
        <div className="p-4 rounded-xl bg-muted/50 border border-border/50 mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Transaction Hash</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 font-mono text-xs text-primary truncate">
              {certificate.transactionHash}
            </code>
            <a
              href={`https://etherscan.io/tx/${certificate.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateCard;
