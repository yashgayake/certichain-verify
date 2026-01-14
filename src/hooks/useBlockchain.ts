import { useState, useCallback } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/contract';
import { toast } from 'sonner';

// Types for blockchain data
export interface BlockchainCertificate {
  certificateHash: string;
  studentName: string;
  course: string;
  grade: string;
  year: number;
  enrollmentNumber: string;
  issuer: string;
  issuedAt: number;
  pdfHash: string;
  photoHash: string;
  isValid: boolean;
}

export interface BlockchainStudent {
  enrollmentNumber: string;
  name: string;
  email: string;
  phone: string;
  photoHash: string;
  isRegistered: boolean;
  registeredAt: number;
}

export interface TransactionResult {
  success: boolean;
  transactionHash?: string;
  blockNumber?: number;
  error?: string;
}

export interface VerificationResult {
  isValid: boolean;
  certificate?: BlockchainCertificate;
  error?: string;
}

export const useBlockchain = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get provider and signer
  const getProviderAndSigner = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask not installed');
    }
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
  }, []);

  // Get read-only contract (no signer needed)
  const getReadOnlyContract = useCallback(async (): Promise<Contract> => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask not installed');
    }
    const provider = new BrowserProvider(window.ethereum);
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  }, []);

  // Get contract with signer (for write operations)
  const getContract = useCallback(async (): Promise<Contract> => {
    const { signer } = await getProviderAndSigner();
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }, [getProviderAndSigner]);

  // ============ ADMIN FUNCTIONS ============

  // Register a new student
  const registerStudent = useCallback(async (
    enrollmentNumber: string,
    name: string,
    email: string,
    phone: string,
    photoHash: string
  ): Promise<TransactionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const contract = await getContract();
      
      toast.info('Awaiting MetaMask Confirmation...', {
        description: 'Please confirm the transaction in MetaMask',
      });

      const tx = await contract.registerStudent(enrollmentNumber, name, email, phone, photoHash);
      
      toast.info('Transaction Submitted', {
        description: `Hash: ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`,
      });

      const receipt = await tx.wait();
      
      setIsLoading(false);
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
      setIsLoading(false);
      
      const ethError = err as { code?: number | string };
      if (ethError.code === 4001 || ethError.code === 'ACTION_REJECTED') {
        toast.error('Transaction Rejected');
      } else {
        toast.error('Transaction Failed', { description: errorMessage });
      }
      
      return { success: false, error: errorMessage };
    }
  }, [getContract]);

  // Issue a new certificate
  const issueCertificate = useCallback(async (
    certificateHash: string,
    enrollmentNumber: string,
    studentName: string,
    course: string,
    grade: string,
    year: number,
    pdfHash: string,
    photoHash: string
  ): Promise<TransactionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const contract = await getContract();
      
      toast.info('Awaiting MetaMask Confirmation...', {
        description: 'Please confirm the transaction in MetaMask',
      });

      const tx = await contract.issueCertificate(
        certificateHash,
        enrollmentNumber,
        studentName,
        course,
        grade,
        year,
        pdfHash,
        photoHash
      );
      
      toast.info('Transaction Submitted', {
        description: `Hash: ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`,
      });

      const receipt = await tx.wait();
      
      setIsLoading(false);
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
      setIsLoading(false);
      
      const ethError = err as { code?: number | string };
      if (ethError.code === 4001 || ethError.code === 'ACTION_REJECTED') {
        toast.error('Transaction Rejected');
      } else {
        toast.error('Transaction Failed', { description: errorMessage });
      }
      
      return { success: false, error: errorMessage };
    }
  }, [getContract]);

  // ============ VIEW FUNCTIONS ============

  // Verify a certificate
  const verifyCertificate = useCallback(async (certificateHash: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const contract = await getReadOnlyContract();
      const isValid = await contract.verifyCertificate(certificateHash);
      setIsLoading(false);
      return isValid;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed';
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  }, [getReadOnlyContract]);

  // Get certificate details
  const getCertificate = useCallback(async (certificateHash: string): Promise<VerificationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const contract = await getReadOnlyContract();
      
      const isValid = await contract.verifyCertificate(certificateHash);
      
      if (!isValid) {
        setIsLoading(false);
        return { isValid: false, error: 'Certificate not found on blockchain' };
      }

      const result = await contract.getCertificate(certificateHash);
      
      const certificate: BlockchainCertificate = {
        certificateHash,
        studentName: result[0],
        course: result[1],
        grade: result[2],
        year: Number(result[3]),
        enrollmentNumber: result[4],
        issuer: result[5],
        issuedAt: Number(result[6]),
        pdfHash: result[7],
        photoHash: result[8],
        isValid: result[9],
      };

      setIsLoading(false);
      return { isValid: true, certificate };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch certificate';
      setError(errorMessage);
      setIsLoading(false);
      return { isValid: false, error: errorMessage };
    }
  }, [getReadOnlyContract]);

  // Get student details
  const getStudent = useCallback(async (enrollmentNumber: string): Promise<BlockchainStudent | null> => {
    try {
      const contract = await getReadOnlyContract();
      const result = await contract.getStudent(enrollmentNumber);
      
      if (!result[4]) { // isRegistered check
        return null;
      }

      return {
        enrollmentNumber,
        name: result[0],
        email: result[1],
        phone: result[2],
        photoHash: result[3],
        isRegistered: result[4],
        registeredAt: Number(result[5]),
      };
    } catch {
      return null;
    }
  }, [getReadOnlyContract]);

  // Authenticate student
  const authenticateStudent = useCallback(async (
    enrollmentNumber: string,
    password: string
  ): Promise<boolean> => {
    try {
      const contract = await getReadOnlyContract();
      const isAuthenticated = await contract.authenticateStudent(enrollmentNumber, password);
      return isAuthenticated;
    } catch {
      return false;
    }
  }, [getReadOnlyContract]);

  // Get student's certificates
  const getStudentCertificates = useCallback(async (enrollmentNumber: string): Promise<string[]> => {
    try {
      const contract = await getReadOnlyContract();
      const certificateHashes = await contract.getStudentCertificates(enrollmentNumber);
      return certificateHashes;
    } catch {
      return [];
    }
  }, [getReadOnlyContract]);

  // Check if student is registered
  const isStudentRegistered = useCallback(async (enrollmentNumber: string): Promise<boolean> => {
    try {
      const contract = await getReadOnlyContract();
      return await contract.isStudentRegistered(enrollmentNumber);
    } catch {
      return false;
    }
  }, [getReadOnlyContract]);

  // Get all certificates (for admin)
  const getAllCertificates = useCallback(async (): Promise<BlockchainCertificate[]> => {
    try {
      const contract = await getReadOnlyContract();
      const hashes = await contract.getAllCertificateHashes();
      
      const certificates: BlockchainCertificate[] = [];
      for (const hash of hashes) {
        const result = await getCertificate(hash);
        if (result.certificate) {
          certificates.push(result.certificate);
        }
      }
      
      return certificates;
    } catch {
      return [];
    }
  }, [getReadOnlyContract, getCertificate]);

  // Get all students (for admin)
  const getAllStudents = useCallback(async (): Promise<BlockchainStudent[]> => {
    try {
      const contract = await getReadOnlyContract();
      const enrollments = await contract.getAllEnrollmentNumbers();
      
      const students: BlockchainStudent[] = [];
      for (const enrollment of enrollments) {
        const student = await getStudent(enrollment);
        if (student) {
          students.push(student);
        }
      }
      
      return students;
    } catch {
      return [];
    }
  }, [getReadOnlyContract, getStudent]);

  // Get blockchain stats
  const getStats = useCallback(async (): Promise<{ totalCertificates: number; totalStudents: number }> => {
    try {
      const contract = await getReadOnlyContract();
      const [totalCertificates, totalStudents] = await Promise.all([
        contract.getTotalCertificates(),
        contract.getTotalStudents(),
      ]);
      return {
        totalCertificates: Number(totalCertificates),
        totalStudents: Number(totalStudents),
      };
    } catch {
      return { totalCertificates: 0, totalStudents: 0 };
    }
  }, [getReadOnlyContract]);

  // Get admin address
  const getAdmin = useCallback(async (): Promise<string | null> => {
    try {
      const contract = await getReadOnlyContract();
      const adminAddress = await contract.admin();
      return adminAddress;
    } catch {
      console.error('Failed to get admin');
      return null;
    }
  }, [getReadOnlyContract]);

  return {
    isLoading,
    error,
    // Admin functions
    registerStudent,
    issueCertificate,
    // View functions
    verifyCertificate,
    getCertificate,
    getStudent,
    authenticateStudent,
    getStudentCertificates,
    isStudentRegistered,
    getAllCertificates,
    getAllStudents,
    getStats,
    getAdmin,
  };
};
