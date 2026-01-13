import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, QrCode, Award, Loader2, CheckCircle, XCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import EmptyState from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBlockchain, BlockchainCertificate } from '@/hooks/useBlockchain';

const CertificateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getCertificate, verifyCertificate, isLoading } = useBlockchain();
  
  const [certificate, setCertificate] = useState<BlockchainCertificate | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!id) {
        setError('No certificate ID provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      
      // First verify if certificate exists
      const valid = await verifyCertificate(id);
      setIsValid(valid);

      if (valid) {
        // Get certificate details from blockchain
        const result = await getCertificate(id);
        
        if (result.isValid && result.certificate) {
          setCertificate(result.certificate);
        } else {
          setError(result.error || 'Failed to fetch certificate details');
        }
      } else {
        setError('Certificate not found on blockchain');
      }

      setLoading(false);
    };

    fetchCertificate();
  }, [id, getCertificate, verifyCertificate]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Fetching from Blockchain...</p>
            <p className="text-sm text-muted-foreground">
              Querying smart contract for certificate data
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !certificate) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            icon={Award}
            title="Certificate Not Found"
            description={error || "This certificate does not exist on the blockchain."}
            action={{ label: 'Go Back', onClick: () => window.history.back() }}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/verify" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Verification
        </Link>

        <div className="max-w-3xl mx-auto">
          {/* Certificate Card */}
          <div className="rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-8 md:p-12 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Certificate of Achievement</h1>
              <p className="text-muted-foreground">Verified on Ethereum Blockchain</p>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center mb-8">
              <Badge 
                variant={isValid ? 'valid' : 'revoked'} 
                className="px-6 py-2 text-lg flex items-center gap-2"
              >
                {isValid ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    BLOCKCHAIN VERIFIED
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    INVALID
                  </>
                )}
              </Badge>
            </div>

            {/* Certificate Details */}
            <div className="space-y-6 text-center">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">This certifies that</p>
                <p className="text-2xl md:text-3xl font-bold text-primary mt-1">
                  {certificate.studentName}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">has successfully completed</p>
                <p className="text-xl md:text-2xl font-semibold mt-1">
                  {certificate.course}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Year of Completion</p>
                <p className="text-xl font-semibold mt-1">
                  {certificate.year}
                </p>
              </div>

              <div className="pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Certificate ID</p>
                <p className="font-mono text-lg mt-1">
                  {certificate.certificateID}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Issuer Address</p>
                <p className="font-mono text-sm mt-1 break-all">
                  {certificate.issuer}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Button variant="gradient" size="lg">
              <Download className="w-4 h-4" />
              Download Certificate
            </Button>
            <Button variant="outline" size="lg">
              <QrCode className="w-4 h-4" />
              Generate QR Code
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="w-4 h-4" />
              Share Certificate
            </Button>
          </div>

          {/* Blockchain Info */}
          <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Blockchain Verification:</strong> This certificate data was fetched directly from the 
              Ethereum smart contract using the <code className="text-primary">getCertificate()</code> function.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CertificateDetail;
