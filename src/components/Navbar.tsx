
import { Link } from 'react-router-dom';
import { UserMenu } from '@/components/UserMenu';
import { Code, BookOpen, Wallet, Home, FileCode } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-semibold text-lg flex items-center">
            <span className="gradient-text">SuiCoPilot</span>
          </Link>
          
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/code-snippets">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Code className="w-4 h-4 mr-2" />
                    Code Snippets
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/code-and-concepts">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <FileCode className="w-4 h-4 mr-2" />
                    Code & Concepts
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/concepts">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Concepts
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/wallet">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Wallet className="w-4 h-4 mr-2" />
                    Wallet
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/code-snippets">
            <Button variant="ghost" size="sm">
              <Code className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/code-and-concepts">
            <Button variant="ghost" size="sm">
              <FileCode className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/concepts">
            <Button variant="ghost" size="sm">
              <BookOpen className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/wallet">
            <Button variant="ghost" size="sm">
              <Wallet className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        
        <UserMenu />
      </div>
    </header>
  );
};

export default Navbar;
