import React from 'react';
import { 
  FileCheck, 
  Shield, 
  Eye, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Building2,
  Fingerprint,
  Send
} from 'lucide-react';
import { Certificate } from '@/types/certificate';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  type: 'issued' | 'verified' | 'viewed' | 'shared' | 'revoked';
  title: string;
  description: string;
  timestamp: string;
  actor?: string;
  location?: string;
  transactionHash?: string;
}

interface CertificateTimelineProps {
  certificate: Certificate;
  className?: string;
}

// Generate mock timeline events based on certificate
const generateTimelineEvents = (certificate: Certificate): TimelineEvent[] => {
  const events: TimelineEvent[] = [
    {
      id: '1',
      type: 'issued',
      title: 'Certificate Issued',
      description: `Certificate created and recorded on Ethereum blockchain`,
      timestamp: certificate.issueDate,
      actor: certificate.issuedBy,
      transactionHash: certificate.transactionHash,
    },
    {
      id: '2',
      type: 'verified',
      title: 'Initial Verification',
      description: 'Certificate authenticity verified by issuing authority',
      timestamp: certificate.issueDate,
      actor: 'Automated Verification System',
    },
    {
      id: '3',
      type: 'viewed',
      title: 'Certificate Viewed',
      description: 'Student accessed and downloaded the certificate',
      timestamp: new Date(new Date(certificate.issueDate).getTime() + 86400000).toLocaleDateString(),
      actor: certificate.studentName,
    },
    {
      id: '4',
      type: 'verified',
      title: 'External Verification',
      description: 'Certificate verified by third-party employer',
      timestamp: new Date(new Date(certificate.issueDate).getTime() + 172800000).toLocaleDateString(),
      location: 'Mumbai, India',
    },
    {
      id: '5',
      type: 'shared',
      title: 'Certificate Shared',
      description: 'Verification link shared via email',
      timestamp: new Date(new Date(certificate.issueDate).getTime() + 259200000).toLocaleDateString(),
      actor: certificate.studentName,
    },
  ];

  if (certificate.status === 'revoked') {
    events.push({
      id: '6',
      type: 'revoked',
      title: 'Certificate Revoked',
      description: 'Certificate marked as invalid by issuing authority',
      timestamp: new Date().toLocaleDateString(),
      actor: certificate.issuedBy,
    });
  }

  return events;
};

const getEventIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'issued':
      return FileCheck;
    case 'verified':
      return Shield;
    case 'viewed':
      return Eye;
    case 'shared':
      return Send;
    case 'revoked':
      return XCircle;
    default:
      return Clock;
  }
};

const getEventStyles = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'issued':
      return {
        bg: 'bg-primary/10',
        border: 'border-primary/30',
        icon: 'text-primary',
        line: 'bg-primary/30',
      };
    case 'verified':
      return {
        bg: 'bg-success/10',
        border: 'border-success/30',
        icon: 'text-success',
        line: 'bg-success/30',
      };
    case 'viewed':
      return {
        bg: 'bg-accent/10',
        border: 'border-accent/30',
        icon: 'text-accent',
        line: 'bg-accent/30',
      };
    case 'shared':
      return {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        icon: 'text-blue-500',
        line: 'bg-blue-500/30',
      };
    case 'revoked':
      return {
        bg: 'bg-destructive/10',
        border: 'border-destructive/30',
        icon: 'text-destructive',
        line: 'bg-destructive/30',
      };
    default:
      return {
        bg: 'bg-muted',
        border: 'border-border',
        icon: 'text-muted-foreground',
        line: 'bg-border',
      };
  }
};

const CertificateTimeline: React.FC<CertificateTimelineProps> = ({
  certificate,
  className,
}) => {
  const events = generateTimelineEvents(certificate);

  return (
    <div className={cn("relative", className)}>
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        Certificate History
      </h3>
      
      <div className="space-y-0">
        {events.map((event, index) => {
          const Icon = getEventIcon(event.type);
          const styles = getEventStyles(event.type);
          const isLast = index === events.length - 1;

          return (
            <div key={event.id} className="relative flex gap-4">
              {/* Timeline line */}
              {!isLast && (
                <div 
                  className={cn(
                    "absolute left-[19px] top-10 w-0.5 h-[calc(100%-8px)]",
                    styles.line
                  )} 
                />
              )}
              
              {/* Icon */}
              <div className={cn(
                "relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2",
                styles.bg,
                styles.border
              )}>
                <Icon className={cn("w-4 h-4", styles.icon)} />
              </div>
              
              {/* Content */}
              <div className={cn(
                "flex-1 pb-8",
                isLast && "pb-0"
              )}>
                <div className="p-4 rounded-xl bg-card border border-border/50 hover:border-border transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h4 className="font-semibold">{event.title}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {event.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {event.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 text-xs">
                    {event.actor && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Building2 className="w-3 h-3" />
                        <span>{event.actor}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Fingerprint className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.transactionHash && (
                      <div className="flex items-center gap-1 text-primary">
                        <Shield className="w-3 h-3" />
                        <span className="font-mono">
                          {event.transactionHash.slice(0, 10)}...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CertificateTimeline;
