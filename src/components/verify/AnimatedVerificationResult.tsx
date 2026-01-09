import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Shield, 
  Sparkles,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedVerificationResultProps {
  success: boolean;
  isLoading?: boolean;
  title?: string;
  message?: string;
  onAnimationComplete?: () => void;
}

const AnimatedVerificationResult: React.FC<AnimatedVerificationResultProps> = ({
  success,
  isLoading = false,
  title,
  message,
  onAnimationComplete,
}) => {
  const [animationPhase, setAnimationPhase] = useState<'scanning' | 'processing' | 'result'>('scanning');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Show scanning animation
      const timer1 = setTimeout(() => setAnimationPhase('processing'), 500);
      const timer2 = setTimeout(() => {
        setAnimationPhase('result');
        setTimeout(() => setShowContent(true), 300);
        onAnimationComplete?.();
      }, 1200);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isLoading, onAnimationComplete]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        {/* Scanning animation */}
        <div className="relative w-32 h-32 mb-8">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-4 rounded-full bg-primary/10 animate-pulse flex items-center justify-center">
            <Shield className="w-12 h-12 text-primary animate-pulse" />
          </div>
          
          {/* Scanning line */}
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
        </div>
        
        <p className="text-lg font-medium text-foreground mb-2">Verifying Certificate</p>
        <p className="text-sm text-muted-foreground animate-pulse">
          Querying blockchain...
        </p>
        
        {/* Progress dots */}
        <div className="flex gap-1 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border-2 p-8",
      success 
        ? "border-success bg-success/5" 
        : "border-destructive bg-destructive/5"
    )}>
      {/* Background particles animation for success */}
      {success && animationPhase === 'result' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-success/30 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${1.5 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Main icon with animation */}
      <div className="flex flex-col items-center">
        <div className={cn(
          "relative w-24 h-24 mb-6 transition-transform duration-500",
          animationPhase === 'result' && "scale-100",
          animationPhase !== 'result' && "scale-75 opacity-50"
        )}>
          {/* Glow effect */}
          <div className={cn(
            "absolute inset-0 rounded-full blur-xl transition-opacity duration-500",
            success ? "bg-success/40" : "bg-destructive/40",
            showContent ? "opacity-100" : "opacity-0"
          )} />
          
          {/* Icon container */}
          <div className={cn(
            "relative w-full h-full rounded-full flex items-center justify-center transition-all duration-500",
            success 
              ? "bg-success/20 border-2 border-success/50" 
              : "bg-destructive/20 border-2 border-destructive/50",
            showContent && "animate-bounce"
          )}
          style={{ animationIterationCount: 1, animationDuration: '0.5s' }}
          >
            {success ? (
              <CheckCircle className={cn(
                "w-12 h-12 text-success transition-all duration-300",
                showContent ? "scale-100 opacity-100" : "scale-50 opacity-0"
              )} />
            ) : (
              <XCircle className={cn(
                "w-12 h-12 text-destructive transition-all duration-300",
                showContent ? "scale-100 opacity-100" : "scale-50 opacity-0"
              )} />
            )}
          </div>
          
          {/* Success sparkles */}
          {success && showContent && (
            <>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-success animate-pulse" />
              <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-success animate-pulse" style={{ animationDelay: '0.3s' }} />
            </>
          )}
        </div>
        
        {/* Text content with fade-in */}
        <div className={cn(
          "text-center transition-all duration-500",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <h2 className={cn(
            "text-2xl md:text-3xl font-bold mb-2",
            success ? "text-success" : "text-destructive"
          )}>
            {title || (success ? 'CERTIFICATE VERIFIED' : 'VERIFICATION FAILED')}
          </h2>
          
          <p className="text-muted-foreground max-w-md mx-auto">
            {message || (success 
              ? 'This certificate is authentic and recorded on the blockchain.' 
              : 'This certificate could not be verified. It may be invalid or fake.'
            )}
          </p>
          
          {/* Security badge */}
          <div className={cn(
            "mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm",
            success 
              ? "bg-success/10 text-success border border-success/20" 
              : "bg-destructive/10 text-destructive border border-destructive/20"
          )}>
            {success ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Blockchain Secured</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" />
                <span>Verification Failed</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedVerificationResult;
