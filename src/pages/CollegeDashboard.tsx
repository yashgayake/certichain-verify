import React, { useState } from 'react';
import { 
  Award, 
  Users, 
  CheckCircle, 
  XCircle, 
  Plus,
  Eye,
  QrCode,
  MoreHorizontal,
  Search,
  Filter,
  AlertCircle
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
import { mockCertificates, mockStats, generateCertificateId, generateTransactionHash } from '@/lib/mockData';
import { Certificate } from '@/types/certificate';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const CollegeDashboard: React.FC = () => {
  const { isConnected, address, connect, isConnecting } = useWallet();
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);
  const [isIssuing, setIsIssuing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    studentName: '',
    studentWallet: '',
    course: '',
    degree: '',
    year: new Date().getFullYear().toString(),
  });

  const filteredCertificates = certificates.filter(cert =>
    cert.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsIssuing(true);

    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newCertificate: Certificate = {
      id: generateCertificateId(),
      studentName: formData.studentName,
      studentWallet: formData.studentWallet || '0x' + Math.random().toString(16).slice(2, 42),
      course: formData.course,
      degree: formData.degree,
      year: formData.year,
      issueDate: new Date().toISOString().split('T')[0],
      issuedBy: 'Tech University',
      issuerWallet: address || '0x0000...0000',
      status: 'valid',
      transactionHash: generateTransactionHash(),
      blockNumber: 18300000 + Math.floor(Math.random() * 10000),
      timestamp: Date.now() / 1000,
    };

    setCertificates(prev => [newCertificate, ...prev]);
    setFormData({
      studentName: '',
      studentWallet: '',
      course: '',
      degree: '',
      year: new Date().getFullYear().toString(),
    });
    setIsIssuing(false);
    setIsDialogOpen(false);

    toast.success('Certificate Issued Successfully', {
      description: `Certificate ID: ${newCertificate.id}`,
    });
  };

  const handleRevokeCertificate = (certId: string) => {
    setCertificates(prev =>
      prev.map(cert =>
        cert.id === certId ? { ...cert, status: 'revoked' as const } : cert
      )
    );
    toast.success('Certificate Revoked', {
      description: `Certificate ${certId} has been marked as revoked.`,
    });
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">College Dashboard</h1>
            <p className="text-muted-foreground">
              Manage and issue blockchain-verified certificates
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient" size="lg">
                <Plus className="w-5 h-5" />
                Issue Certificate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Issue New Certificate</DialogTitle>
                <DialogDescription>
                  Fill in the details to issue a new blockchain certificate.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleIssueCertificate} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="studentName">Student Name</Label>
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
                  <Label htmlFor="studentWallet">Student Wallet (Optional)</Label>
                  <Input
                    id="studentWallet"
                    name="studentWallet"
                    value={formData.studentWallet}
                    onChange={handleInputChange}
                    placeholder="0x..."
                  />
                </div>
                <div>
                  <Label htmlFor="course">Course</Label>
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
                  <Label htmlFor="degree">Degree</Label>
                  <Input
                    id="degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    placeholder="Bachelor of Technology"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
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
                  disabled={isIssuing}
                >
                  {isIssuing ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Issuing on Blockchain...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      Issue Certificate
                    </>
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Certificates"
            value={mockStats.totalCertificates}
            icon={Award}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total Students"
            value={mockStats.totalStudents}
            icon={Users}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Valid Certificates"
            value={mockStats.validCertificates}
            icon={CheckCircle}
            iconClassName="bg-success/10"
          />
          <StatsCard
            title="Revoked Certificates"
            value={mockStats.revokedCertificates}
            icon={XCircle}
            iconClassName="bg-destructive/10"
          />
        </div>

        {/* Certificates Table */}
        <div className="rounded-2xl border border-border/50 bg-card shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-lg font-semibold">Issued Certificates</h2>
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
              title="No Certificates Found"
              description="Issue your first certificate or try a different search query."
              action={{
                label: 'Issue Certificate',
                onClick: () => setIsDialogOpen(true),
              }}
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
                    <TableRow key={cert.id}>
                      <TableCell className="font-mono text-sm">{cert.id}</TableCell>
                      <TableCell className="font-medium">{cert.studentName}</TableCell>
                      <TableCell className="hidden md:table-cell">{cert.course}</TableCell>
                      <TableCell className="hidden lg:table-cell">{cert.year}</TableCell>
                      <TableCell>
                        <Badge variant={cert.status === 'valid' ? 'valid' : cert.status === 'revoked' ? 'revoked' : 'pending'}>
                          {cert.status}
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
                              <Link to={`/certificate/${cert.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <QrCode className="w-4 h-4 mr-2" />
                              Generate QR
                            </DropdownMenuItem>
                            {cert.status === 'valid' && (
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleRevokeCertificate(cert.id)}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Revoke
                              </DropdownMenuItem>
                            )}
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
      </div>
    </Layout>
  );
};

export default CollegeDashboard;
