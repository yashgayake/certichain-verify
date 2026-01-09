import React, { useState } from 'react';
import { 
  Award, 
  Download, 
  Share2, 
  QrCode, 
  ExternalLink,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import CertificateCard from '@/components/common/CertificateCard';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { mockCertificates } from '@/lib/mockData';
import { toast } from 'sonner';

const StudentDashboard: React.FC = () => {
  const { isConnected, address, connect, isConnecting } = useWallet();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter certificates for the "student" (in real app, filter by wallet)
  const studentCertificates = mockCertificates.filter(cert => cert.status !== 'revoked');

  const handleCopyLink = (certId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/verify?id=${certId}`);
    setCopiedId(certId);
    toast.success('Verification link copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
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
              Connect your wallet to view your blockchain-verified certificates 
              and share them with potential employers.
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
              View and share your blockchain-verified academic credentials
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border/50">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-mono text-muted-foreground">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{studentCertificates.length}</p>
                <p className="text-sm text-muted-foreground">Total Certificates</p>
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
                  {studentCertificates.filter(c => c.status === 'valid').length}
                </p>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <Share2 className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Times Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        {studentCertificates.length === 0 ? (
          <EmptyState
            icon={Award}
            title="No Certificates Yet"
            description="You don't have any certificates associated with this wallet address yet."
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {studentCertificates.map((cert) => (
              <div key={cert.id} className="relative group">
                <CertificateCard certificate={cert} showActions={false} />
                
                {/* Action Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-card via-card/90 to-transparent rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <QrCode className="w-4 h-4 mr-2" />
                      QR Code
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleCopyLink(cert.id)}
                    >
                      {copiedId === cert.id ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      Share
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={`https://etherscan.io/tx/${cert.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentDashboard;
