import React, { useState } from 'react';
import { 
  Blocks, 
  Clock, 
  Hash, 
  Fuel, 
  ArrowRight, 
  ExternalLink,
  Copy,
  Check,
  Shield,
  Layers,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Certificate } from '@/types/certificate';
import { cn } from '@/lib/utils';

interface TransactionViewerProps {
  certificate: Certificate;
  className?: string;
}

interface TransactionDetail {
  label: string;
  value: string;
  copyable?: boolean;
  link?: string;
  icon: React.ElementType;
}

const TransactionViewer: React.FC<TransactionViewerProps> = ({
  certificate,
  className,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = async (value: string, field: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const transactionDetails: TransactionDetail[] = [
    {
      label: 'Transaction Hash',
      value: certificate.transactionHash,
      copyable: true,
      link: `https://etherscan.io/tx/${certificate.transactionHash}`,
      icon: Hash,
    },
    {
      label: 'Block Number',
      value: certificate.blockNumber?.toLocaleString() || 'N/A',
      icon: Blocks,
    },
    {
      label: 'Timestamp',
      value: certificate.timestamp 
        ? new Date(certificate.timestamp * 1000).toLocaleString()
        : 'N/A',
      icon: Clock,
    },
    {
      label: 'Gas Used',
      value: '21,000 Gwei',
      icon: Fuel,
    },
  ];

  const additionalDetails = [
    { label: 'Network', value: 'Ethereum Mainnet', icon: Activity },
    { label: 'From', value: certificate.issuerWallet, copyable: true, icon: ArrowRight },
    { label: 'Contract', value: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', copyable: true, icon: Layers },
    { label: 'Method', value: 'issueCertificate()', icon: Shield },
    { label: 'Status', value: 'Success', icon: Check },
    { label: 'Confirmations', value: '15,234,567', icon: Blocks },
  ];

  return (
    <div className={cn(
      "rounded-2xl border border-border/50 bg-card overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Blocks className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Blockchain Transaction</h3>
              <p className="text-sm text-muted-foreground">Ethereum Mainnet</p>
            </div>
          </div>
          <Badge variant="blockchain" className="text-xs">
            <Activity className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        </div>
      </div>

      {/* Main transaction info */}
      <div className="p-6 space-y-4">
        {transactionDetails.map((detail, index) => {
          const Icon = detail.icon;
          return (
            <div 
              key={index}
              className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {detail.label}
                </p>
                <div className="flex items-center gap-2">
                  <p className={cn(
                    "font-mono text-sm truncate",
                    detail.link && "text-primary"
                  )}>
                    {detail.value}
                  </p>
                  {detail.copyable && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleCopy(detail.value, detail.label)}
                    >
                      {copiedField === detail.label ? (
                        <Check className="w-3 h-3 text-success" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  )}
                  {detail.link && (
                    <a
                      href={detail.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expandable additional details */}
      <div className="border-t border-border/50">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>View more details</span>
          <ArrowRight className={cn(
            "w-4 h-4 transition-transform",
            isExpanded && "rotate-90"
          )} />
        </button>
        
        {isExpanded && (
          <div className="px-6 pb-6 grid gap-3 animate-fade-in">
            {additionalDetails.map((detail, index) => {
              const Icon = detail.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{detail.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm font-mono",
                      detail.value === 'Success' && "text-success"
                    )}>
                      {detail.value.length > 20 
                        ? `${detail.value.slice(0, 10)}...${detail.value.slice(-8)}`
                        : detail.value
                      }
                    </span>
                    {detail.copyable && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopy(detail.value, detail.label)}
                      >
                        {copiedField === detail.label ? (
                          <Check className="w-3 h-3 text-success" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* View on explorer button */}
      <div className="p-4 border-t border-border/50 bg-muted/20">
        <a
          href={`https://etherscan.io/tx/${certificate.transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="w-full">
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Etherscan
          </Button>
        </a>
      </div>
    </div>
  );
};

export default TransactionViewer;
