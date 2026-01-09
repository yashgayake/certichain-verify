import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  QrCode, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Shield,
  Calendar,
  Building2,
  GraduationCap,
  Award
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import EmptyState from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockCertificates } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const CertificateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const certificate = mockCertificates.find(c => c.id === id);

  if (!certificate) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            icon={Award}
            title="Certificate Not Found"
            description="The certificate you're looking for doesn't exist or has been removed."
            action={{
              label: 'Go Back',
              onClick: () => window.history.back(),
            }}
          />
        </div>
      </Layout>
    );
  }

  const isValid = certificate.status === 'valid';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/college" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Certificate Display */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Certificate Card */}
              <div className="relative overflow-hidden rounded-3xl border-4 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-8 md:p-12 shadow-2xl">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-hero-pattern opacity-30" />
                
                {/* Status Badge */}
                <div className="absolute top-6 right-6">
                  <Badge 
                    variant={isValid ? 'valid' : 'revoked'} 
                    className="text-sm px-4 py-1"
                  >
                    {isValid ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-1" />
                    )}
                    {certificate.status.toUpperCase()}
                  </Badge>
                </div>

                {/* Header */}
                <div className="relative text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Shield className="w-10 h-10 text-primary" />
                    <span className="text-2xl font-bold gradient-text">CertChain</span>
                  </div>
                  <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                    Certificate of Achievement
                  </h2>
                </div>

                {/* Certificate Content */}
                <div className="relative text-center space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">This is to certify that</p>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{certificate.studentName}</h1>
                    <p className="font-mono text-sm text-muted-foreground">{certificate.studentWallet}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">has successfully completed</p>
                    <h2 className="text-2xl font-bold text-primary">{certificate.course}</h2>
                    <p className="text-lg text-muted-foreground">{certificate.degree}</p>
                  </div>

                  <div className="flex items-center justify-center gap-8 pt-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Year</p>
                      <p className="text-xl font-bold">{certificate.year}</p>
                    </div>
                    <div className="w-px h-12 bg-border" />
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Issue Date</p>
                      <p className="text-xl font-bold">{certificate.issueDate}</p>
                    </div>
                  </div>

                  {/* Issuer */}
                  <div className="pt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Issued by</p>
                    <p className="font-semibold text-lg">{certificate.issuedBy}</p>
                    <p className="font-mono text-xs text-muted-foreground">{certificate.issuerWallet}</p>
                  </div>

                  {/* Certificate ID */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="font-mono text-sm">{certificate.id}</span>
                  </div>
                </div>

                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-24 h-24 border-l-4 border-t-4 border-primary/30 rounded-tl-3xl" />
                <div className="absolute top-0 right-0 w-24 h-24 border-r-4 border-t-4 border-primary/30 rounded-tr-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 border-l-4 border-b-4 border-primary/30 rounded-bl-3xl" />
                <div className="absolute bottom-0 right-0 w-24 h-24 border-r-4 border-b-4 border-primary/30 rounded-br-3xl" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-lg">
              <h3 className="font-semibold mb-4">Actions</h3>
              <div className="space-y-3">
                <Button variant="gradient" className="w-full">
                  <Download className="w-4 h-4" />
                  Download Certificate
                </Button>
                <Button variant="outline" className="w-full">
                  <QrCode className="w-4 h-4" />
                  Generate QR Code
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4" />
                  Share Certificate
                </Button>
              </div>
            </div>

            {/* Blockchain Proof */}
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-lg">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Blockchain Proof
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Transaction Hash
                  </p>
                  <a
                    href={`https://etherscan.io/tx/${certificate.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-mono text-sm text-primary hover:underline break-all"
                  >
                    {certificate.transactionHash}
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Block Number
                  </p>
                  <p className="font-mono text-sm">{certificate.blockNumber?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Timestamp
                  </p>
                  <p className="font-mono text-sm">
                    {certificate.timestamp 
                      ? new Date(certificate.timestamp * 1000).toLocaleString()
                      : 'N/A'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Network
                  </p>
                  <p className="text-sm">Ethereum Mainnet</p>
                </div>
              </div>
            </div>

            {/* Verification Status */}
            <div className={cn(
              "p-6 rounded-2xl border-2",
              isValid 
                ? "bg-success/5 border-success/30" 
                : "bg-destructive/5 border-destructive/30"
            )}>
              <div className="flex items-center gap-3">
                {isValid ? (
                  <CheckCircle className="w-8 h-8 text-success" />
                ) : (
                  <XCircle className="w-8 h-8 text-destructive" />
                )}
                <div>
                  <p className={cn(
                    "font-bold",
                    isValid ? "text-success" : "text-destructive"
                  )}>
                    {isValid ? 'Verified' : 'Revoked'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isValid 
                      ? 'This certificate is valid on the blockchain'
                      : 'This certificate has been revoked'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CertificateDetail;
