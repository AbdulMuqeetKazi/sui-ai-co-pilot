
import { Code } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-sui-950 text-sui-100 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-6 w-6 text-sui-400" />
              <span className="text-xl font-bold tracking-tight text-white">
                SUI<span className="text-sui-400">CoPilot</span>
              </span>
            </div>
            <p className="text-sui-300 mb-4">
              AI-powered development assistant for the Sui blockchain ecosystem.
            </p>
            <div className="text-sm text-sui-400">
              © 2025 SuiCoPilot. All rights reserved.
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sui-300 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-sui-300 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sui-300 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-sui-300 hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sui-300 hover:text-white transition-colors">Sui Docs</a></li>
              <li><a href="#" className="text-sui-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-sui-300 hover:text-white transition-colors">Tutorials</a></li>
              <li><a href="#" className="text-sui-300 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sui-300 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-sui-300 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-sui-300 hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sui-300 hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
