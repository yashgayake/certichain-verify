import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, QrCode, Award } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import EmptyState from '@/components/common/EmptyState';
import ElegantCertificate from '@/components/certificate/ElegantCertificate';
import CertificateTimeline from '@/components/certificate/CertificateTimeline';
import TransactionViewer from '@/components/blockchain/TransactionViewer';
import { Button } from '@/components/ui/button';
import { mockCertificates } from '@/lib/mockData';

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
          to="/college" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Certificate Display */}
          <div className="lg:col-span-2 space-y-8">
            <ElegantCertificate certificate={certificate} />
            
            {/* Actions */}
            <div className="flex flex-wrap gap-3">
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TransactionViewer certificate={certificate} />
            <CertificateTimeline certificate={certificate} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CertificateDetail;
