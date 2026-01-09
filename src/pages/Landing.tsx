import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  CheckCircle, 
  Lock, 
  Zap, 
  Building2, 
  GraduationCap, 
  Search,
  ArrowRight,
  Globe,
  FileCheck,
  Blocks
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const Landing: React.FC = () => {
  const features = [
    {
      icon: Lock,
      title: 'Immutable Records',
      description: 'Once issued, certificates cannot be altered or tampered with, ensuring permanent authenticity.',
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Verify any certificate in seconds using the certificate ID or QR code.',
    },
    {
      icon: Globe,
      title: 'Global Accessibility',
      description: 'Access and verify certificates from anywhere in the world, 24/7.',
    },
    {
      icon: FileCheck,
      title: 'Fraud Prevention',
      description: 'Eliminate certificate fraud with cryptographic proof of authenticity.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'College Issues Certificate',
      description: 'Educational institution creates and issues a certificate on the blockchain.',
      icon: Building2,
    },
    {
      number: '02',
      title: 'Student Receives Proof',
      description: 'Student gets a unique certificate ID and QR code linked to the blockchain.',
      icon: GraduationCap,
    },
    {
      number: '03',
      title: 'Employer Verifies',
      description: 'Anyone can instantly verify the certificate authenticity using the ID or QR.',
      icon: Search,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse-slow" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <Blocks className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by Blockchain</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Secure Your{' '}
              <span className="gradient-text">Academic Credentials</span>{' '}
              Forever
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              CertChain is a blockchain-based certificate verification system that eliminates 
              fraud and enables instant, trustless verification of academic credentials.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <Link to="/verify">
                <Button variant="hero" size="xl">
                  <Search className="w-5 h-5" />
                  Verify Certificate
                </Button>
              </Link>
              <Link to="/college">
                <Button variant="hero-outline" size="xl">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border/50 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div>
                <p className="text-3xl md:text-4xl font-bold gradient-text">1,247+</p>
                <p className="text-sm text-muted-foreground mt-1">Certificates Issued</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold gradient-text">892</p>
                <p className="text-sm text-muted-foreground mt-1">Students Verified</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold gradient-text">99.9%</p>
                <p className="text-sm text-muted-foreground mt-1">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Problem with Traditional Certificates
            </h2>
            <p className="text-lg text-muted-foreground">
              Fake certificates are a growing problem, costing companies billions and 
              undermining trust in academic credentials.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy to Forge</h3>
              <p className="text-muted-foreground text-sm">
                Physical certificates can be easily duplicated or manipulated with modern technology.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                <span className="text-2xl">🐌</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Slow Verification</h3>
              <p className="text-muted-foreground text-sm">
                Manual verification can take weeks, delaying hiring and enrollment processes.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                <span className="text-2xl">💸</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Costly Process</h3>
              <p className="text-muted-foreground text-sm">
                Background verification services charge high fees for each certificate check.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Blockchain Solves This
            </h2>
            <p className="text-lg text-muted-foreground">
              By storing certificate hashes on an immutable blockchain, we create 
              a tamper-proof record that anyone can verify instantly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="group p-6 rounded-2xl bg-card border border-border/50 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              A simple three-step process for issuing and verifying certificates.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-accent opacity-30" />
                  )}
                  
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent p-[2px] mb-6">
                      <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                        <step.icon className="w-10 h-10 text-primary" />
                      </div>
                    </div>
                    <span className="text-5xl font-bold text-muted-foreground/20 mb-2">{step.number}</span>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-border/50 p-8 md:p-16">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />
            
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <Shield className="w-16 h-16 mx-auto text-primary mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join the future of credential verification. Issue tamper-proof certificates 
                or verify existing ones in seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/college">
                  <Button variant="gradient" size="lg">
                    <Building2 className="w-5 h-5" />
                    College Dashboard
                  </Button>
                </Link>
                <Link to="/student">
                  <Button variant="gradient" size="lg">
                    <GraduationCap className="w-5 h-5" />
                    Student Dashboard
                  </Button>
                </Link>
                <Link to="/verify">
                  <Button variant="outline" size="lg">
                    <CheckCircle className="w-5 h-5" />
                    Verify Certificate
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Landing;
