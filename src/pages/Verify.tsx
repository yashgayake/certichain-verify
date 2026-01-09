import React, { useState } from 'react';
import { Search, QrCode, Camera, ExternalLink, Building2, Calendar, GraduationCap, Fingerprint } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import AnimatedVerificationResult from '@/components/verify/AnimatedVerificationResult';
import QRScanner from '@/components/verify/QRScanner';
import TransactionViewer from '@/components/blockchain/TransactionViewer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockCertificates } from '@/lib/mockData';
import { Certificate } from '@/types/certificate';

const Verify: React.FC = () => {
  const [certificateId, setCertificateId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [result, setResult] = useState<{ success: boolean; certificate?: Certificate; message: string } | null>(null);

  const handleVerify = async (id?: string) => {
    const searchId = id || certificateId;
    if (!searchId.trim()) return;

    setIsVerifying(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 2500));

    const foundCert = mockCertificates.find(c => c.id.toLowerCase() === searchId.trim().toLowerCase());

    if (foundCert) {
      setResult({
        success: foundCert.status !== 'revoked',
        certificate: foundCert,
        message: foundCert.status === 'revoked' 
          ? 'This certificate has been REVOKED by the issuing authority.'
          : 'Certificate is VALID and verified on blockchain.',
      });
    } else {
      setResult({ success: false, message: 'Certificate NOT FOUND. This may be a fake or invalid certificate.' });
    }
    setIsVerifying(false);
  };

  const handleQRScan = (data: string) => {
    setCertificateId(data);
    handleVerify(data);
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Verify Certificate Authenticity</h1>
          <p className="text-lg text-muted-foreground">
            Enter a certificate ID or scan a QR code to instantly verify authenticity.
          </p>
        </div>

        {/* Verification Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="Enter Certificate ID (e.g., CERT-2024-001)"
                className="h-14 pl-12 text-lg rounded-xl"
              />
            </div>
            <Button type="submit" variant="gradient" size="xl" disabled={isVerifying || !certificateId.trim()}>
              <Search className="w-5 h-5" />
              Verify
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="text-sm text-muted-foreground">or</span>
            <Button variant="outline" onClick={() => setShowScanner(true)}>
              <Camera className="w-4 h-4 mr-2" />
              Scan QR Code
            </Button>
          </div>

          {/* Quick Demo */}
          <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border/50">
            <p className="text-sm text-muted-foreground mb-3">Try with sample certificates:</p>
            <div className="flex flex-wrap gap-2">
              {mockCertificates.slice(0, 3).map(cert => (
                <Button key={cert.id} variant="outline" size="sm" onClick={() => { setCertificateId(cert.id); handleVerify(cert.id); }} className="font-mono text-xs">
                  {cert.id}
                  {cert.status === 'revoked' && <Badge variant="revoked" className="ml-2 text-[10px]">Revoked</Badge>}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading / Result */}
        <div className="max-w-2xl mx-auto">
          {isVerifying && <AnimatedVerificationResult success={false} isLoading />}
          
          {result && !isVerifying && (
            <div className="space-y-6 animate-fade-in">
              <AnimatedVerificationResult success={result.success} title={result.success ? 'VALID CERTIFICATE' : 'VERIFICATION FAILED'} message={result.message} />
              
              {result.certificate && (
                <div className="grid md:grid-cols-2 gap-4 p-6 rounded-2xl bg-card border border-border/50">
                  {[
                    { icon: GraduationCap, label: 'Student', value: result.certificate.studentName },
                    { icon: Building2, label: 'Issuer', value: result.certificate.issuedBy },
                    { icon: Fingerprint, label: 'Course', value: result.certificate.course },
                    { icon: Calendar, label: 'Issued', value: result.certificate.issueDate },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="font-semibold">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {result.certificate && <TransactionViewer certificate={result.certificate} />}
              
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => { setCertificateId(''); setResult(null); }}>Verify Another</Button>
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
      </div>

      <QRScanner isOpen={showScanner} onClose={() => setShowScanner(false)} onScan={handleQRScan} />
    </Layout>
  );
};

export default Verify;
