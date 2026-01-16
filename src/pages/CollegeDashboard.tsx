import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  Plus,
  Eye,
  QrCode,
  MoreHorizontal,
  Search,
  Filter,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import StatsCard from '@/components/common/StatsCard';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useWallet } from '@/contexts/WalletContext';
import { useBlockchain, BlockchainCertificate } from '@/hooks/useBlockchain';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

// Local certificate type that includes transaction data
interface IssuedCertificate extends BlockchainCertificate {
  transactionHash: string;
  blockNumber: number;
  status: 'valid' | 'pending';
  issueDate: string;
}

const CollegeDashboard: React.FC = () => {
  const { isConnected, address, connect, isConnecting } = useWallet();
  const { issueCertificate, isLoading: blockchainLoading, getAdmin } = useBlockchain();
  
  // Store issued certificates in local state (from this session)
  // In production, you'd fetch these from an indexer or event logs
  const [issuedCertificates, setIssuedCertificates] = useState<IssuedCertificate[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  const [formData, setFormData] = useState({
    studentName: '',
    course: '',
    grade: '',
    year: new Date().getFullYear().toString(),
    certificateHash: '',
    enrollmentNumber: '',
    pdfHash: '',
    photoHash: '',
  });

  // Check if connected wallet is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isConnected || !address) {
        setCheckingAdmin(false);
        return;
      }
      
      setCheckingAdmin(true);
      const adminAddress = await getAdmin();
      
      if (adminAddress) {
        setIsAdmin(adminAddress.toLowerCase() === address.toLowerCase());
      } else {
        setIsAdmin(false);
      }
      setCheckingAdmin(false);
    };

    checkAdminStatus();
  }, [isConnected, address, getAdmin]);

  const filteredCertificates = issuedCertificates.filter(cert =>
    cert.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.certificateHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.certificateHash.trim()) {
      toast.error('Certificate Hash Required', {
        description: 'Please enter a unique certificate hash',
      });
      return;
    }

    if (!formData.enrollmentNumber.trim()) {
      toast.error('Enrollment Number Required', {
        description: 'Please enter the student enrollment number',
      });
      return;
    }

    const result = await issueCertificate(
      formData.certificateHash,
      formData.enrollmentNumber,
      formData.studentName,
      formData.course,
      formData.grade,
      parseInt(formData.year),
      formData.pdfHash || '',
      formData.photoHash || ''
    );

    if (result.success && result.transactionHash && result.blockNumber) {
      const newCertificate: IssuedCertificate = {
        certificateHash: formData.certificateHash,
        studentName: formData.studentName,
        course: formData.course,
        grade: formData.grade,
        year: parseInt(formData.year),
        enrollmentNumber: formData.enrollmentNumber,
        issuer: address || '',
        issuedAt: Date.now(),
        pdfHash: formData.pdfHash,
        photoHash: formData.photoHash,
        isValid: true,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber,
        status: 'valid',
        issueDate: new Date().toISOString().split('T')[0],
      };

      setIssuedCertificates(prev => [newCertificate, ...prev]);
      setFormData({
        studentName: '',
        course: '',
        grade: '',
        year: new Date().getFullYear().toString(),
        certificateHash: '',
        enrollmentNumber: '',
        pdfHash: '',
        photoHash: '',
      });
      setIsDialogOpen(false);

      toast.success('Certificate Issued on Blockchain!', {
        description: `TX: ${result.transactionHash.slice(0, 10)}...`,
      });
    }
  };

  // Calculate stats from actual issued certificates
  const stats = {
    totalCertificates: issuedCertificates.length,
    validCertificates: issuedCertificates.filter(c => c.status === 'valid').length,
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
              Connect your institutional wallet to access the College Dashboard and 
              issue blockchain-verified certificates.
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

  if (checkingAdmin) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Checking admin status...</p>
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
            <h1 className="text-3xl font-bold mb-2">College Dashboard</h1>
            <p className="text-muted-foreground">
              Issue blockchain-verified certificates
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-mono text-muted-foreground">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              {isAdmin && (
                <Badge variant="valid" className="ml-2">Admin</Badge>
              )}
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient" size="lg" disabled={!isAdmin}>
                <Plus className="w-5 h-5" />
                Issue Certificate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Issue New Certificate</DialogTitle>
                <DialogDescription>
                  This will create a permanent record on the Ethereum blockchain.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleIssueCertificate} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="certificateHash">Certificate Hash *</Label>
                  <Input
                    id="certificateHash"
                    name="certificateHash"
                    value={formData.certificateHash}
                    onChange={handleInputChange}
                    placeholder="CERT-2024-001"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Unique hash for this certificate
                  </p>
                </div>
                <div>
                  <Label htmlFor="enrollmentNumber">Enrollment Number *</Label>
                  <Input
                    id="enrollmentNumber"
                    name="enrollmentNumber"
                    value={formData.enrollmentNumber}
                    onChange={handleInputChange}
                    placeholder="ENR-2024-001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="studentName">Student Name *</Label>
                  <Input
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="course">Course *</Label>
                  <Input
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    placeholder="Computer Science"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    placeholder="A+"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="gradient" 
                  className="w-full"
                  disabled={blockchainLoading}
                >
                  {blockchainLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Waiting for Blockchain...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      Issue on Blockchain
                    </>
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Admin Warning */}
        {!isAdmin && (
          <div className="mb-8 p-4 rounded-xl bg-warning/10 border border-warning/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-warning">Not Contract Admin</p>
                <p className="text-sm text-muted-foreground">
                  Your connected wallet is not the contract admin. Only the admin can issue certificates.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats - Based on actual issued certificates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <StatsCard
            title="Certificates Issued (This Session)"
            value={stats.totalCertificates}
            icon={Award}
          />
          <StatsCard
            title="Valid Certificates"
            value={stats.validCertificates}
            icon={CheckCircle}
            iconClassName="bg-success/10"
          />
        </div>

        {/* Certificates Table */}
        <div className="rounded-2xl border border-border/50 bg-card shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-lg font-semibold">Issued Certificates (This Session)</h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search certificates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Table Content */}
          {filteredCertificates.length === 0 ? (
            <EmptyState
              icon={Award}
              title="No Certificates Issued Yet"
              description={isAdmin 
                ? "Issue your first certificate to see it here. Certificates are stored permanently on the blockchain."
                : "Only the contract admin can issue certificates."
              }
              action={isAdmin ? {
                label: 'Issue Certificate',
                onClick: () => setIsDialogOpen(true),
              } : undefined}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="hidden md:table-cell">Course</TableHead>
                    <TableHead className="hidden lg:table-cell">Year</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCertificates.map((cert) => (
                    <TableRow key={cert.certificateHash}>
                      <TableCell className="font-mono text-sm">{cert.certificateHash}</TableCell>
                      <TableCell className="font-medium">{cert.studentName}</TableCell>
                      <TableCell className="hidden md:table-cell">{cert.course}</TableCell>
                      <TableCell className="hidden lg:table-cell">{cert.year}</TableCell>
                      <TableCell>
                        <Badge variant="valid">
                          On Blockchain
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/verify?id=${cert.certificateHash}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                Verify
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a 
                                href={`https://sepolia.etherscan.io/tx/${cert.transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <QrCode className="w-4 h-4 mr-2" />
                                View on Etherscan
                              </a>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border/50">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> This dashboard shows certificates issued in your current session. 
            To verify any certificate, use the Verify page with the certificate ID.
            All certificates are permanently stored on the Ethereum blockchain.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default CollegeDashboard;
