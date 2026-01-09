import React, { useState } from 'react';
import { 
  Search, 
  QrCode, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Building2,
  Calendar,
  GraduationCap,
  Fingerprint,
  Upload
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockCertificates } from '@/lib/mockData';
import { Certificate } from '@/types/certificate';
import { cn } from '@/lib/utils';

const Verify: React.FC = () => {
  const [certificateId, setCertificateId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    certificate?: Certificate;
    message: string;
  } | null>(null);

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!certificateId.trim()) return;

    setIsVerifying(true);
    setResult(null);

    // Simulate blockchain verification
    await new Promise(resolve => setTimeout(resolve, 2000));

    const foundCert = mockCertificates.find(
      c => c.id.toLowerCase() === certificateId.trim().toLowerCase()
    );

    if (foundCert) {
      if (foundCert.status === 'revoked') {
        setResult({
          success: false,
          certificate: foundCert,
          message: 'This certificate has been REVOKED by the issuing authority.',
        });
      } else {
        setResult({
          success: true,
          certificate: foundCert,
          message: 'Certificate is VALID and verified on blockchain.',
        });
      }
    } else {
      setResult({
        success: false,
        message: 'Certificate NOT FOUND. This may be a fake or invalid certificate.',
      });
    }

    setIsVerifying(false);
  };

  const handleQuickVerify = (id: string) => {
    setCertificateId(id);
    setTimeout(() => handleVerify(), 100);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Fingerprint className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Blockchain Verification</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Verify Certificate Authenticity
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter a certificate ID or scan a QR code to instantly verify 
            the authenticity of any blockchain-issued certificate.
          </p>
        </div>

        {/* Verification Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleVerify} className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder="Enter Certificate ID (e.g., CERT-2024-001)"
                  className="h-14 pl-12 text-lg rounded-xl"
                />
              </div>
              <Button 
                type="submit" 
                variant="gradient" 
                size="xl"
                disabled={isVerifying || !certificateId.trim()}
              >
                {isVerifying ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Verify
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* QR Code Upload */}
          <div className="mt-4 text-center">
            <span className="text-sm text-muted-foreground">or</span>
            <Button variant="ghost" className="ml-2">
              <Upload className="w-4 h-4 mr-2" />
              Upload QR Code
            </Button>
          </div>

          {/* Quick Demo */}
          <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border/50">
            <p className="text-sm text-muted-foreground mb-3">Try with sample certificates:</p>
            <div className="flex flex-wrap gap-2">
              {mockCertificates.slice(0, 3).map(cert => (
                <Button
                  key={cert.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickVerify(cert.id)}
                  className="font-mono text-xs"
                >
                  {cert.id}
                  {cert.status === 'revoked' && (
                    <Badge variant="revoked" className="ml-2 text-[10px]">Revoked</Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isVerifying && (
          <div className="max-w-2xl mx-auto">
            <div className="p-12 rounded-2xl border border-border/50 bg-card text-center">
              <LoadingSpinner size="lg" text="Verifying on blockchain..." />
              <p className="text-sm text-muted-foreground mt-4 animate-pulse">
                Querying smart contract...
              </p>
            </div>
          </div>
        )}

        {/* Result */}
        {result && !isVerifying && (
          <div className="max-w-2xl mx-auto animate-scale-in">
            <div className={cn(
              "rounded-2xl border-2 overflow-hidden",
              result.success 
                ? "border-success bg-success/5" 
                : "border-destructive bg-destructive/5"
            )}>
              {/* Result Header */}
              <div className={cn(
                "p-6 flex items-center gap-4",
                result.success ? "bg-success/10" : "bg-destructive/10"
              )}>
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center",
                  result.success ? "bg-success/20" : "bg-destructive/20"
                )}>
                  {result.success ? (
                    <CheckCircle className="w-8 h-8 text-success" />
                  ) : (
                    <XCircle className="w-8 h-8 text-destructive" />
                  )}
                </div>
                <div>
                  <h2 className={cn(
                    "text-2xl font-bold",
                    result.success ? "text-success" : "text-destructive"
                  )}>
                    {result.success ? 'VALID CERTIFICATE' : 'VERIFICATION FAILED'}
                  </h2>
                  <p className="text-muted-foreground">{result.message}</p>
                </div>
              </div>

              {/* Certificate Details */}
              {result.certificate && (
                <div className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Student Name</p>
                        <p className="font-semibold">{result.certificate.studentName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Issuing Authority</p>
                        <p className="font-semibold">{result.certificate.issuedBy}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Fingerprint className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Course / Degree</p>
                        <p className="font-semibold">{result.certificate.course}</p>
                        <p className="text-sm text-muted-foreground">{result.certificate.degree}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Issue Date</p>
                        <p className="font-semibold">{result.certificate.issueDate}</p>
                        <p className="text-sm text-muted-foreground">Year: {result.certificate.year}</p>
                      </div>
                    </div>
                  </div>

                  {/* Blockchain Proof */}
                  <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                    <p className="text-sm font-medium mb-3">Blockchain Proof</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Transaction Hash</span>
                        <a
                          href={`https://etherscan.io/tx/${result.certificate.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 font-mono text-primary hover:underline"
                        >
                          {result.certificate.transactionHash.slice(0, 10)}...{result.certificate.transactionHash.slice(-8)}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Block Number</span>
                        <span className="font-mono">{result.certificate.blockNumber?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Issuer Wallet</span>
                        <span className="font-mono">{result.certificate.issuerWallet}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCertificateId('');
                  setResult(null);
                }}
              >
                Verify Another
              </Button>
              {result.certificate && result.success && (
                <Button variant="gradient">
                  <QrCode className="w-4 h-4 mr-2" />
                  Download Proof
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Verify;
