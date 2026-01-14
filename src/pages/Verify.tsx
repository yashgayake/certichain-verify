import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, QrCode, Camera, Fingerprint, Loader2, 
  Upload, FileText, CheckCircle, XCircle, Shield,
  User, Calendar, GraduationCap, Hash
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import AnimatedVerificationResult from '@/components/verify/AnimatedVerificationResult';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBlockchain, BlockchainCertificate } from '@/hooks/useBlockchain';

interface VerificationState {
  isValid: boolean;
  certificate?: BlockchainCertificate;
  message: string;
}

const Verify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [certificateHash, setCertificateHash] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { verifyCertificate, getCertificate } = useBlockchain();

  // Check URL for certificate hash on mount
  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setCertificateHash(idFromUrl);
      handleVerify(idFromUrl);
    }
  }, [searchParams]);

  const handleVerify = async (hash?: string) => {
    const searchHash = hash || certificateHash;
    if (!searchHash.trim()) return;

    setIsVerifying(true);
    setResult(null);

    try {
      // Call smart contract verifyCertificate function
      const isValid = await verifyCertificate(searchHash.trim());

      if (isValid) {
        // Certificate exists, get full details
        const certResult = await getCertificate(searchHash.trim());
        
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, show a message about extracting hash
      // In production, you'd parse the QR code from the image or PDF
      alert('File upload for QR extraction requires additional integration. Please enter the certificate hash manually.');
    }
  };

  const handleReset = () => {
    setCertificateHash('');
    setResult(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Blockchain Verification</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Verify Certificate</h1>
          <p className="text-lg text-muted-foreground">
            Verify the authenticity of any certificate directly on the Ethereum blockchain.
          </p>
        </div>

        {/* Verification Methods */}
        <div className="max-w-2xl mx-auto mb-12">
          <Tabs defaultValue="hash" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hash">
                <Hash className="w-4 h-4 mr-2" />
                Enter Hash
              </TabsTrigger>
              <TabsTrigger value="scan">
                <Camera className="w-4 h-4 mr-2" />
                Scan QR
              </TabsTrigger>
              <TabsTrigger value="upload">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hash" className="mt-6">
              <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }}>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={certificateHash}
                      onChange={(e) => setCertificateHash(e.target.value)}
                      placeholder="Enter Certificate Hash (e.g., CERT-EN2024001-...)"
                      className="h-14 pl-12 text-lg rounded-xl"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    variant="gradient" 
                    size="xl" 
                    disabled={isVerifying || !certificateHash.trim()}
                  >
                    {isVerifying ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Fingerprint className="w-5 h-5" />
                    )}
                    Verify
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="scan" className="mt-6">
              <Card className="p-8 text-center">
                <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Scan QR Code</h3>
                <p className="text-muted-foreground mb-4">
                  Use your device camera to scan the certificate QR code
                </p>
                <Button variant="gradient">
                  <Camera className="w-4 h-4 mr-2" />
                  Open Camera
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Camera access requires HTTPS and browser permissions
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="upload" className="mt-6">
              <Card className="p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Certificate</h3>
                <p className="text-muted-foreground mb-4">
                  Upload a certificate PDF or image with QR code
                </p>
                <Button variant="gradient" onClick={() => fileInputRef.current?.click()}>
                  <FileText className="w-4 h-4 mr-2" />
                  Select File
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: PDF, PNG, JPG
                </p>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Info Box */}
          <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border/50">
            <p className="text-sm text-muted-foreground">
              <strong>How it works:</strong> This page calls the <code className="text-primary">verifyCertificate()</code> function 
              on the Ethereum smart contract to check if the certificate exists on the blockchain.
            </p>
          </div>
        </div>

        {/* Loading / Result */}
        <div className="max-w-3xl mx-auto">
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
                title={result.isValid ? 'CERTIFICATE VERIFIED' : 'VERIFICATION FAILED'} 
                message={result.message} 
              />
              
              {result.certificate && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Certificate Details (From Blockchain)
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Hash className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Certificate Hash</p>
                          <p className="font-mono text-sm break-all">{result.certificate.certificateHash}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Student Name</p>
                          <p className="font-semibold">{result.certificate.studentName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <GraduationCap className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Course</p>
                          <p className="font-semibold">{result.certificate.course}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Enrollment Number</p>
                          <p className="font-mono">{result.certificate.enrollmentNumber}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Year</p>
                          <p className="font-semibold">{result.certificate.year}</p>
                        </div>
                      </div>

                      {result.certificate.grade && (
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Grade</p>
                            <p className="font-semibold">{result.certificate.grade}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Issuer Address</p>
                        <p className="font-mono text-sm break-all">{result.certificate.issuer}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 mt-4">
                      <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Issued On</p>
                        <p className="font-semibold">
                          {new Date(result.certificate.issuedAt * 1000).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
              
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleReset}>
                  Verify Another
                </Button>
                {result.isValid && (
                  <Button variant="gradient">
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate QR Code
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Verify;
