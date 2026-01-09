import React from 'react';
import { Shield, Award, CheckCircle, Star, Stamp } from 'lucide-react';
import { Certificate } from '@/types/certificate';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ElegantCertificateProps {
  certificate: Certificate;
  showWatermark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ElegantCertificate: React.FC<ElegantCertificateProps> = ({
  certificate,
  showWatermark = true,
  size = 'lg',
}) => {
  const isValid = certificate.status === 'valid';
  
  const sizeClasses = {
    sm: 'p-6 md:p-8',
    md: 'p-8 md:p-12',
    lg: 'p-10 md:p-16',
  };

  return (
    <div className="relative">
      {/* Outer decorative border */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary rounded-3xl p-[3px] shadow-2xl">
        <div className="absolute inset-[3px] bg-card rounded-[calc(1.5rem-3px)]" />
      </div>
      
      {/* Certificate container */}
      <div className={cn(
        "relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-primary/5",
        sizeClasses[size]
      )}>
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Decorative rosette corners */}
        <div className="absolute top-4 left-4 w-16 h-16 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute top-4 right-4 w-16 h-16 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute bottom-4 left-4 w-16 h-16 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute bottom-4 right-4 w-16 h-16 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

        {/* Watermark */}
        {showWatermark && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <Shield className="w-96 h-96" />
          </div>
        )}

        {/* Status seal */}
        <div className="absolute top-6 right-6 md:top-8 md:right-8">
          <div className={cn(
            "relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center",
            isValid 
              ? "bg-success/10 border-2 border-success/30" 
              : "bg-destructive/10 border-2 border-destructive/30"
          )}>
            <div className="absolute inset-2 rounded-full border border-dashed border-current opacity-30" />
            <div className="text-center">
              {isValid ? (
                <>
                  <CheckCircle className="w-6 h-6 md:w-8 md:h-8 mx-auto text-success" />
                  <span className="text-[10px] md:text-xs font-bold text-success uppercase tracking-wider">Verified</span>
                </>
              ) : (
                <>
                  <Stamp className="w-6 h-6 md:w-8 md:h-8 mx-auto text-destructive" />
                  <span className="text-[10px] md:text-xs font-bold text-destructive uppercase tracking-wider">Revoked</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Certificate content */}
        <div className="relative text-center">
          {/* Header emblem */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 flex items-center justify-center mb-4">
              <Shield className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text tracking-wide">CertChain</h1>
            <p className="text-xs md:text-sm text-muted-foreground tracking-[0.4em] uppercase mt-1">
              Blockchain Verified
            </p>
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[1px] w-16 md:w-24 bg-gradient-to-r from-transparent to-primary/50" />
            <Star className="w-4 h-4 text-primary" />
            <div className="h-[1px] w-16 md:w-24 bg-gradient-to-l from-transparent to-primary/50" />
          </div>

          {/* Title */}
          <h2 className="text-sm md:text-base uppercase tracking-[0.3em] text-muted-foreground font-medium mb-2">
            Certificate of Achievement
          </h2>
          <p className="text-muted-foreground mb-6 italic text-sm">This is to certify that</p>

          {/* Student name */}
          <div className="mb-6">
            <h3 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight">
              {certificate.studentName}
            </h3>
            <p className="font-mono text-xs md:text-sm text-muted-foreground">
              {certificate.studentWallet}
            </p>
          </div>

          {/* Achievement text */}
          <p className="text-muted-foreground mb-2 italic text-sm">has successfully completed</p>

          {/* Course details */}
          <div className="mb-8">
            <h4 className="text-2xl md:text-3xl font-bold text-primary mb-2">
              {certificate.course}
            </h4>
            <p className="text-lg md:text-xl text-foreground/80">{certificate.degree}</p>
          </div>

          {/* Date and year */}
          <div className="flex items-center justify-center gap-8 md:gap-16 mb-8">
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Year</p>
              <p className="text-2xl md:text-3xl font-bold">{certificate.year}</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Issued On</p>
              <p className="text-lg md:text-xl font-semibold">{certificate.issueDate}</p>
            </div>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[1px] flex-1 max-w-32 bg-gradient-to-r from-transparent to-border" />
            <Award className="w-6 h-6 text-primary" />
            <div className="h-[1px] flex-1 max-w-32 bg-gradient-to-l from-transparent to-border" />
          </div>

          {/* Issuer section */}
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Issued By</p>
            <p className="text-lg md:text-xl font-semibold">{certificate.issuedBy}</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              {certificate.issuerWallet}
            </p>
          </div>

          {/* Certificate ID badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
            <Award className="w-5 h-5 text-primary" />
            <span className="font-mono text-sm font-medium">{certificate.id}</span>
          </div>
        </div>

        {/* Corner decorative borders */}
        <div className="absolute top-0 left-0 w-20 h-20 md:w-32 md:h-32 border-l-4 border-t-4 border-primary/20 rounded-tl-3xl" />
        <div className="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 border-r-4 border-t-4 border-primary/20 rounded-tr-3xl" />
        <div className="absolute bottom-0 left-0 w-20 h-20 md:w-32 md:h-32 border-l-4 border-b-4 border-primary/20 rounded-bl-3xl" />
        <div className="absolute bottom-0 right-0 w-20 h-20 md:w-32 md:h-32 border-r-4 border-b-4 border-primary/20 rounded-br-3xl" />
      </div>
    </div>
  );
};

export default ElegantCertificate;
