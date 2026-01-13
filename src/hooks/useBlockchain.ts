import { useState, useCallback } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/contract';
import { toast } from 'sonner';

// Types for blockchain certificate data
export interface BlockchainCertificate {
  studentName: string;
  course: string;
  year: number;
  certificateID: string;
  issuer: string;
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

  // Issue a new certificate (calls addCertificate on smart contract)
  const issueCertificate = useCallback(async (
    studentName: string,
    course: string,
    year: number,
    certificateID: string
  ): Promise<TransactionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const contract = await getContract();
      
      toast.info('Awaiting MetaMask Confirmation...', {
        description: 'Please confirm the transaction in MetaMask',
      });

      // Call addCertificate function on smart contract
      const tx = await contract.addCertificate(studentName, course, year, certificateID);
      
      toast.info('Transaction Submitted', {
        description: `Hash: ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`,
      });

      // Wait for transaction confirmation
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
      
      // Handle user rejection
      const ethError = err as { code?: number | string };
      if (ethError.code === 4001 || ethError.code === 'ACTION_REJECTED') {
        toast.error('Transaction Rejected', {
          description: 'You rejected the transaction in MetaMask',
        });
      } else {
        toast.error('Transaction Failed', {
          description: errorMessage,
        });
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [getContract]);

  // Verify a certificate (calls verifyCertificate on smart contract)
  const verifyCertificate = useCallback(async (certificateID: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const contract = await getReadOnlyContract();
      const isValid = await contract.verifyCertificate(certificateID);
      setIsLoading(false);
      return isValid;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed';
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  }, [getReadOnlyContract]);

  // Get certificate details (calls getCertificate on smart contract)
  const getCertificate = useCallback(async (certificateID: string): Promise<VerificationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const contract = await getReadOnlyContract();
      
      // First check if certificate exists
      const isValid = await contract.verifyCertificate(certificateID);
      
      if (!isValid) {
        setIsLoading(false);
        return {
          isValid: false,
          error: 'Certificate not found on blockchain',
        };
      }

      // Get certificate details
      const result = await contract.getCertificate(certificateID);
      
      const certificate: BlockchainCertificate = {
        studentName: result[0],
        course: result[1],
        year: Number(result[2]),
        certificateID: result[3],
        issuer: result[4],
      };

      setIsLoading(false);
      return {
        isValid: true,
        certificate,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch certificate';
      setError(errorMessage);
      setIsLoading(false);
      return {
        isValid: false,
        error: errorMessage,
      };
    }
  }, [getReadOnlyContract]);

  // Get admin address
  const getAdmin = useCallback(async (): Promise<string | null> => {
    try {
      const contract = await getReadOnlyContract();
      const adminAddress = await contract.admin();
      return adminAddress;
    } catch (err) {
      console.error('Failed to get admin:', err);
      return null;
    }
  }, [getReadOnlyContract]);

  return {
    isLoading,
    error,
    issueCertificate,
    verifyCertificate,
    getCertificate,
    getAdmin,
  };
};
