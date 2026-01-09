import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl gradient-text">CertChain</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Securing academic credentials with blockchain technology. 
              Verify certificates instantly, permanently.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/verify" className="hover:text-primary transition-colors">Verify Certificate</Link></li>
              <li><Link to="/college" className="hover:text-primary transition-colors">College Dashboard</Link></li>
              <li><Link to="/student" className="hover:text-primary transition-colors">Student Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Smart Contract</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} CertChain. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by Ethereum Blockchain
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
