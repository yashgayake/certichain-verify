import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { WalletState } from '@/types/certificate';
import { toast } from 'sonner';
import '@/types/ethereum.d.ts';

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
  });

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          }) as string[];
          
          if (accounts.length > 0) {
            const chainId = await window.ethereum.request({ 
              method: 'eth_chainId' 
            }) as string;
            
            setWalletState({
              address: accounts[0],
              isConnected: true,
              isConnecting: false,
              chainId: parseInt(chainId, 16),
            });
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };
    
    checkConnection();
  }, []);

  // Listen for account and chain changes
  useEffect(() => {
    if (typeof window.ethereum === 'undefined') return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accountList = accounts as string[];
      if (accountList.length === 0) {
        // User disconnected their wallet
        setWalletState({
          address: null,
          isConnected: false,
          isConnecting: false,
        });
        toast.info('Wallet Disconnected');
      } else {
        // User switched accounts
        setWalletState(prev => ({
          ...prev,
          address: accountList[0],
          isConnected: true,
        }));
        toast.success('Account Changed', {
          description: `Connected: ${accountList[0].slice(0, 6)}...${accountList[0].slice(-4)}`,
        });
      }
    };

    const handleChainChanged = (chainId: unknown) => {
      const newChainId = parseInt(chainId as string, 16);
      setWalletState(prev => ({
        ...prev,
        chainId: newChainId,
      }));
      toast.info('Network Changed', {
        description: `Chain ID: ${newChainId}`,
      });
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  const connect = useCallback(async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask Not Installed', {
        description: 'Please install MetaMask browser extension to connect your wallet.',
      });
      return;
    }

    setWalletState(prev => ({ ...prev, isConnecting: true }));

    try {
      // Request account access - this opens the MetaMask popup
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];

      // Get current chain ID
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      }) as string;

      const address = accounts[0];
      
      setWalletState({
        address,
        isConnected: true,
        isConnecting: false,
        chainId: parseInt(chainId, 16),
      });

      toast.success('Wallet Connected', {
        description: `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    } catch (error: unknown) {
      setWalletState(prev => ({ ...prev, isConnecting: false }));
      
      // Handle user rejection (code 4001)
      const ethError = error as { code?: number; message?: string };
      if (ethError.code === 4001) {
        toast.error('Connection Rejected', {
          description: 'You rejected the connection request.',
        });
      } else {
        toast.error('Connection Failed', {
          description: ethError.message || 'Failed to connect wallet. Please try again.',
        });
      }
    }
  }, []);

  const disconnect = useCallback(() => {
    // Note: MetaMask doesn't have a programmatic disconnect
    // We just clear our local state
    setWalletState({
      address: null,
      isConnected: false,
      isConnecting: false,
    });
    toast.info('Wallet Disconnected', {
      description: 'To fully disconnect, please disconnect from MetaMask settings.',
    });
  }, []);

  return (
    <WalletContext.Provider value={{ ...walletState, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
