
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Menu, X, Code, Database } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-6 w-6 text-sui-600" />
          <span className="text-xl font-bold tracking-tight">
            SUI<span className="gradient-text">CoPilot</span>
          </span>
        </div>
        
        <nav className="hidden md:flex gap-6 items-center">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#capabilities" className="text-muted-foreground hover:text-foreground transition-colors">
            Capabilities
          </a>
          <a href="#examples" className="text-muted-foreground hover:text-foreground transition-colors">
            Examples
          </a>
          <Button variant="outline" size="sm" className="gap-2">
            <GitHubLogoIcon className="h-4 w-4" />
            <span>GitHub</span>
          </Button>
          <Button size="sm">Try Demo</Button>
        </nav>
        
        <button onClick={toggleMenu} className="block md:hidden">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {isMenuOpen && (
        <div className="container py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#capabilities" className="text-muted-foreground hover:text-foreground transition-colors">
              Capabilities
            </a>
            <a href="#examples" className="text-muted-foreground hover:text-foreground transition-colors">
              Examples
            </a>
            <Button variant="outline" size="sm" className="gap-2 justify-center">
              <GitHubLogoIcon className="h-4 w-4" />
              <span>GitHub</span>
            </Button>
            <Button size="sm">Try Demo</Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
