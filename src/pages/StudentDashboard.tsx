import React, { useState, useCallback } from 'react';
import { 
  Award, 
  Download, 
  Share2, 
  QrCode, 
  ExternalLink,
  AlertCircle,
  Copy,
  Check,
  Search,
  Loader2
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/contexts/WalletContext';
import { useBlockchain, BlockchainCertificate } from '@/hooks/useBlockchain';
import { toast } from 'sonner';

interface DisplayCertificate extends BlockchainCertificate {
  isValid: boolean;
}

const StudentDashboard: React.FC = () => {
  const { isConnected, address, connect, isConnecting } = useWallet();
  const { getCertificate, verifyCertificate, isLoading } = useBlockchain();
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchId, setSearchId] = useState('');
  const [certificates, setCertificates] = useState<DisplayCertificate[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleCopyLink = (certId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/verify?id=${certId}`);
    setCopiedId(certId);
    toast.success('Verification link copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddCertificate = useCallback(async () => {
    if (!searchId.trim()) {
      toast.error('Enter Certificate ID', {
        description: 'Please enter a certificate ID to search',
      });
      return;
    }

    // Check if already added
    if (certificates.some(c => c.certificateID.toLowerCase() === searchId.toLowerCase())) {
      toast.info('Already Added', {
        description: 'This certificate is already in your list',
      });
      return;
    }

    setIsSearching(true);
    
    const result = await getCertificate(searchId.trim());
    
    if (result.isValid && result.certificate) {
      const isValid = await verifyCertificate(searchId.trim());
      
      setCertificates(prev => [...prev, {
        ...result.certificate!,
        isValid,
      }]);
      
      setSearchId('');
      toast.success('Certificate Found!', {
        description: `Added ${result.certificate.studentName}'s certificate`,
      });
    } else {
      toast.error('Certificate Not Found', {
        description: result.error || 'This certificate does not exist on the blockchain',
      });
    }
    
    setIsSearching(false);
  }, [searchId, certificates, getCertificate, verifyCertificate]);

  const handleRemoveCertificate = (certId: string) => {
    setCertificates(prev => prev.filter(c => c.certificateID !== certId));
    toast.success('Certificate removed from list');
  };

  if (!isConnected) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-muted-foreground mb-8">
              Connect your wallet to view and manage your blockchain-verified certificates.
            </p>
            <Button 
              variant="wallet" 
              size="lg" 
              onClick={connect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Connecting...
                </>
              ) : (
                'Connect Wallet'
              )}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Certificates</h1>
            <p className="text-muted-foreground">
              Search and verify your blockchain certificates
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border/50">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-mono text-muted-foreground">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
        </div>

        {/* Search Box */}
        <div className="mb-8 p-6 rounded-2xl bg-card border border-border/50">
          <h2 className="text-lg font-semibold mb-4">Find Your Certificate</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Enter your certificate ID to fetch it from the blockchain
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Certificate ID (e.g., CERT-2024-001)"
                className="pl-10 h-12"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCertificate()}
              />
            </div>
            <Button 
              onClick={handleAddCertificate} 
              disabled={isSearching || !searchId.trim()}
              variant="gradient"
              size="lg"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Find
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Overview - Based on actual found certificates */}
        {certificates.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{certificates.length}</p>
                  <p className="text-sm text-muted-foreground">Certificates Found</p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                  <Check className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {certificates.filter(c => c.isValid).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Valid on Blockchain</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <EmptyState
            icon={Award}
            title="No Certificates Added"
            description="Search for your certificate ID above to view your blockchain-verified credentials."
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div key={cert.certificateID} className="relative group">
                <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-lg">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={cert.isValid ? 'valid' : 'revoked'}>
                      {cert.isValid ? 'VALID' : 'INVALID'}
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground">
                      {cert.certificateID}
                    </span>
                  </div>

                  {/* Certificate Info */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Student Name</p>
                      <p className="font-semibold text-lg">{cert.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Course</p>
                      <p className="font-medium">{cert.course}</p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Year</p>
                        <p className="font-medium">{cert.year}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Issuer</p>
                        <p className="font-mono text-xs">
                          {cert.issuer.slice(0, 6)}...{cert.issuer.slice(-4)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <QrCode className="w-4 h-4 mr-2" />
                        QR
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleCopyLink(cert.certificateID)}
                      >
                        {copiedId === cert.certificateID ? (
                          <Check className="w-4 h-4 mr-2" />
                        ) : (
                          <Copy className="w-4 h-4 mr-2" />
                        )}
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border/50">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Certificates are fetched directly from the Ethereum blockchain. 
            The validity status is determined by the smart contract's verifyCertificate() function.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
