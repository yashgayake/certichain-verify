import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, QrCode, Camera, Fingerprint, Loader2, ExternalLink } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import AnimatedVerificationResult from '@/components/verify/AnimatedVerificationResult';
import QRScanner from '@/components/verify/QRScanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBlockchain, BlockchainCertificate } from '@/hooks/useBlockchain';

interface VerificationState {
  isValid: boolean;
  certificate?: BlockchainCertificate;
  message: string;
}

const Verify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [certificateId, setCertificateId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [result, setResult] = useState<VerificationState | null>(null);
  
  const { verifyCertificate, getCertificate } = useBlockchain();

  // Check URL for certificate ID on mount
  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setCertificateId(idFromUrl);
      handleVerify(idFromUrl);
    }
  }, [searchParams]);

  const handleVerify = async (id?: string) => {
    const searchId = id || certificateId;
    if (!searchId.trim()) return;

    setIsVerifying(true);
    setResult(null);

    try {
      // Call smart contract verifyCertificate function
      const isValid = await verifyCertificate(searchId.trim());

      if (isValid) {
        // Certificate exists, get full details
        const certResult = await getCertificate(searchId.trim());
        
        if (certResult.isValid && certResult.certificate) {
          setResult({
            isValid: true,
            certificate: certResult.certificate,
            message: 'Certificate is VALID and verified on the Ethereum blockchain.',
          });
        } else {
          setResult({
            isValid: false,
            message: 'Certificate data could not be retrieved.',
          });
        }
      } else {
        setResult({
          isValid: false,
          message: 'Certificate NOT FOUND on blockchain. This may be a fake or invalid certificate.',
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setResult({
        isValid: false,
        message: 'Error verifying certificate. Please ensure MetaMask is connected.',
      });
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
            <span className="text-sm font-medium text-primary">Real Blockchain Verification</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Verify Certificate Authenticity</h1>
          <p className="text-lg text-muted-foreground">
            Enter a certificate ID to verify directly on the Ethereum blockchain.
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
            <Button 
              type="submit" 
              variant="gradient" 
              size="xl" 
              disabled={isVerifying || !certificateId.trim()}
            >
              {isVerifying ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
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

          {/* Info Box */}
          <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border/50">
            <p className="text-sm text-muted-foreground">
              <strong>How it works:</strong> This page calls the <code className="text-primary">verifyCertificate()</code> function 
              on the Ethereum smart contract to check if the certificate exists on the blockchain.
            </p>
          </div>
        </div>

        {/* Loading / Result */}
        <div className="max-w-2xl mx-auto">
          {isVerifying && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">Querying Blockchain...</p>
              <p className="text-sm text-muted-foreground">
                Calling verifyCertificate() on smart contract
              </p>
            </div>
          )}
          
          {result && !isVerifying && (
            <div className="space-y-6 animate-fade-in">
              <AnimatedVerificationResult 
                success={result.isValid} 
                title={result.isValid ? 'VALID CERTIFICATE' : 'VERIFICATION FAILED'} 
                message={result.message} 
              />
              
              {result.certificate && (
                <div className="p-6 rounded-2xl bg-card border border-border/50">
                  <h3 className="text-lg font-semibold mb-4">Certificate Details (From Blockchain)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Certificate ID</p>
                      <p className="font-mono font-semibold">{result.certificate.certificateID}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Student Name</p>
                      <p className="font-semibold">{result.certificate.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Course</p>
                      <p className="font-semibold">{result.certificate.course}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Year</p>
                      <p className="font-semibold">{result.certificate.year}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Issuer Address</p>
                      <p className="font-mono text-sm break-all">{result.certificate.issuer}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => { setCertificateId(''); setResult(null); }}>
                  Verify Another
                </Button>
                {result.isValid && (
                  <Button variant="gradient">
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate Proof
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
