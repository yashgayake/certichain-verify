import { Certificate, DashboardStats } from '@/types/certificate';

export const mockCertificates: Certificate[] = [
  {
    id: 'CERT-2024-001',
    studentName: 'Alice Johnson',
    studentWallet: '0x1234...5678',
    course: 'Computer Science',
    degree: 'Bachelor of Technology',
    year: '2024',
    issueDate: '2024-05-15',
    issuedBy: 'Tech University',
    issuerWallet: '0xABCD...EFGH',
    status: 'valid',
    transactionHash: '0x9f8e7d6c5b4a3928f1e0d9c8b7a6958473625140',
    blockNumber: 18234567,
    timestamp: 1715788800,
  },
  {
    id: 'CERT-2024-002',
    studentName: 'Bob Smith',
    studentWallet: '0x2345...6789',
    course: 'Data Science',
    degree: 'Master of Science',
    year: '2024',
    issueDate: '2024-05-20',
    issuedBy: 'Tech University',
    issuerWallet: '0xABCD...EFGH',
    status: 'valid',
    transactionHash: '0x8e7d6c5b4a392817f0e9d8c7b6a5948362514039',
    blockNumber: 18234890,
    timestamp: 1716220800,
  },
  {
    id: 'CERT-2023-045',
    studentName: 'Carol Williams',
    studentWallet: '0x3456...7890',
    course: 'Artificial Intelligence',
    degree: 'Master of Technology',
    year: '2023',
    issueDate: '2023-12-10',
    issuedBy: 'Tech University',
    issuerWallet: '0xABCD...EFGH',
    status: 'revoked',
    transactionHash: '0x7d6c5b4a3928170fe9d8c7b6a59483625140382e',
    blockNumber: 17856234,
    timestamp: 1702166400,
  },
  {
    id: 'CERT-2024-003',
    studentName: 'David Brown',
    studentWallet: '0x4567...8901',
    course: 'Cybersecurity',
    degree: 'Bachelor of Engineering',
    year: '2024',
    issueDate: '2024-06-01',
    issuedBy: 'Tech University',
    issuerWallet: '0xABCD...EFGH',
    status: 'valid',
    transactionHash: '0x6c5b4a39281706fe9d8c7b6a594836251403827d',
    blockNumber: 18267123,
    timestamp: 1717257600,
  },
  {
    id: 'CERT-2024-004',
    studentName: 'Emma Davis',
    studentWallet: '0x5678...9012',
    course: 'Blockchain Technology',
    degree: 'Master of Science',
    year: '2024',
    issueDate: '2024-06-15',
    issuedBy: 'Tech University',
    issuerWallet: '0xABCD...EFGH',
    status: 'pending',
    transactionHash: '0x5b4a392817f06ed9c8b7a6594836251403827d6c',
    blockNumber: 18289456,
    timestamp: 1718467200,
  },
];

export const mockStats: DashboardStats = {
  totalCertificates: 1247,
  totalStudents: 892,
  totalVerifications: 3456,
  validCertificates: 1198,
  revokedCertificates: 49,
};

export const generateCertificateId = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CERT-${year}-${random}`;
};

export const generateTransactionHash = (): string => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 40; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};
