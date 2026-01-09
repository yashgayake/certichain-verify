import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { WalletState } from '@/types/certificate';
import { toast } from 'sonner';

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

  const connect = useCallback(async () => {
    setWalletState(prev => ({ ...prev, isConnecting: true }));
    
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a mock wallet address
    const mockAddress = '0x' + Array.from({ length: 40 }, () => 
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('');
    
    setWalletState({
      address: mockAddress,
      isConnected: true,
      isConnecting: false,
      chainId: 1,
    });
    
    toast.success('Wallet Connected', {
      description: `Connected: ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`,
    });
  }, []);

  const disconnect = useCallback(() => {
    setWalletState({
      address: null,
      isConnected: false,
      isConnecting: false,
    });
    toast.info('Wallet Disconnected');
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
