import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  ExternalLink,
  Blocks,
  Code,
  FileCode,
  GraduationCap,
  Building2
} from 'lucide-react';

const Footer: React.FC = () => {
  const techStack = [
    { name: 'Blockchain', icon: Blocks },
    { name: 'Ethereum', icon: Code },
    { name: 'Smart Contracts', icon: FileCode },
    { name: 'Web3.js', icon: Code },
    { name: 'React', icon: Code },
    { name: 'TypeScript', icon: Code },
  ];

  return (
    <footer className="relative border-t border-border/50 bg-card/50 backdrop-blur-xl">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-16 relative">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl gradient-text">CertChain</span>
                <p className="text-xs text-muted-foreground">Blockchain Verified</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              A decentralized certificate verification system powered by blockchain technology. 
              Ensuring academic credential authenticity through immutable smart contracts.
            </p>
            
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: Github, href: '#', label: 'GitHub' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Mail, href: '#', label: 'Email' },
              ].map((social) => (
                <a 
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 hover:text-primary transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full" />
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'Verify Certificate', to: '/verify' },
                { label: 'College Dashboard', to: '/college' },
                { label: 'Student Dashboard', to: '/student' },
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full" />
              Resources
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Documentation', href: '#' },
                { label: 'Smart Contract', href: '#' },
                { label: 'API Reference', href: '#' },
                { label: 'Whitepaper', href: '#' },
                { label: 'GitHub Repository', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-300" />
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology Stack */}
          <div>
            <h4 className="font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full" />
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                >
                  <tech.icon className="w-3 h-3" />
                  {tech.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Academic Disclaimer */}
        <div className="mb-8 p-6 rounded-2xl bg-muted/30 border border-border/50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h5 className="font-semibold mb-2 flex items-center gap-2">
                Academic Project Disclaimer
                <Building2 className="w-4 h-4 text-muted-foreground" />
              </h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This project is developed as a <span className="text-foreground font-medium">Final Year B.Tech Project</span> for 
                academic and educational purposes. It demonstrates the implementation of blockchain technology 
                for certificate verification using Ethereum smart contracts. This is a prototype system and 
                is not intended for production use without proper auditing and compliance verification.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} CertChain. All rights reserved.</p>
            <span className="hidden md:inline">•</span>
            <p>Built with blockchain technology</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Powered by</span>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
              <Blocks className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Ethereum Blockchain</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
