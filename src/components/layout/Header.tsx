import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Sun, Moon, Menu, X, Wallet, LogOut, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useWallet } from '@/contexts/WalletContext';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/college', label: 'College Dashboard' },
    { href: '/student', label: 'Student Dashboard' },
    { href: '/verify', label: 'Verify' },
  ];

  const formatAddress = (addr: string) => 
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleWalletClick = () => {
    setWalletDialogOpen(true);
  };

  const handleConnect = async () => {
    setWalletDialogOpen(false);
    await connect();
  };

  const handleDisconnect = () => {
    disconnect();
    setWalletDialogOpen(false);
  };

  const handleSwitchAccount = async () => {
    // Request MetaMask to show account selection
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
        setWalletDialogOpen(false);
      } catch (error) {
        console.error('Failed to switch account:', error);
      }
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Shield className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-bold text-lg md:text-xl gradient-text hidden sm:block">
                CertChain
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    location.pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hidden sm:flex"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>

              {isConnected ? (
                <Button
                  variant="outline"
                  onClick={handleWalletClick}
                  className="font-mono text-sm"
                >
                  {formatAddress(address!)}
                </Button>
              ) : (
                <Button
                  variant="wallet"
                  onClick={handleWalletClick}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect Wallet'
                  )}
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-border/50 animate-fade-in">
              <div className="flex flex-col gap-1">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                      location.pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center gap-2 px-4 py-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
                  </span>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Wallet Connection Dialog */}
      <Dialog open={walletDialogOpen} onOpenChange={setWalletDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Wallet Options
            </DialogTitle>
            <DialogDescription>
              {isConnected 
                ? `Connected: ${formatAddress(address!)}`
                : 'Connect your MetaMask wallet to continue'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-3 mt-4">
            {isConnected ? (
              <>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12"
                  onClick={handleSwitchAccount}
                >
                  <RefreshCw className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">Switch Account</div>
                    <div className="text-xs text-muted-foreground">Change to a different wallet</div>
                  </div>
                </Button>
                
                <Button
                  variant="destructive"
                  className="w-full justify-start gap-3 h-12"
                  onClick={handleDisconnect}
                >
                  <LogOut className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Disconnect</div>
                    <div className="text-xs opacity-80">Reset wallet connection</div>
                  </div>
                </Button>
              </>
            ) : (
              <Button
                variant="wallet"
                className="w-full justify-start gap-3 h-12"
                onClick={handleConnect}
              >
                <Wallet className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Connect MetaMask</div>
                  <div className="text-xs opacity-80">Link your wallet to continue</div>
                </div>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
