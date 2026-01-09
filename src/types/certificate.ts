export interface Certificate {
  id: string;
  studentName: string;
  studentWallet: string;
  course: string;
  degree: string;
  year: string;
  issueDate: string;
  issuedBy: string;
  issuerWallet: string;
  status: 'valid' | 'revoked' | 'pending';
  transactionHash: string;
  blockNumber?: number;
  timestamp?: number;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId?: number;
}

export interface DashboardStats {
  totalCertificates: number;
  totalStudents: number;
  totalVerifications: number;
  validCertificates: number;
  revokedCertificates: number;
}

export interface VerificationResult {
  isValid: boolean;
  certificate?: Certificate;
  message: string;
  verifiedAt?: string;
}
