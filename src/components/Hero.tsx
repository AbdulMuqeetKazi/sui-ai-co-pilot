import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, BookOpen, Wallet, Bot } from 'lucide-react';
import { typeWriter } from '@/lib/typewriter';

const Hero = () => {
  const [isTyping, setIsTyping] = useState(true);
  const typingRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    if (typingRef.current) {
      const stopTyping = typeWriter(
        typingRef.current,
        ["Build on Sui with AI-powered assistance", "Generate Move code with natural language", "Understand Sui concepts and best practices", "Simulate transactions and test your code"],
        {
          startDelay: 500,
          typeSpeed: 50,
          backSpeed: 30,
          backDelay: 2000,
          loop: true,
          onComplete: () => setIsTyping(false),
        }
      );
      
      return () => {
        stopTyping();
      };
    }
  }, []);

  return (
    <section className="py-24 px-4 bg-primary/5 dark:bg-primary/10">
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="gradient-text">SuiCoPilot</span>
            </h1>
            
            <div className="h-24">
              <h2 
                ref={typingRef} 
                className="text-2xl md:text-3xl font-medium"
              >
                Build on Sui with AI-powered assistance
              </h2>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-lg">
              Accelerate your development with AI-powered tools and resources specifically designed for Sui blockchain developers.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/sui-development">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://docs.sui.io" target="_blank" rel="noopener noreferrer">
                  Sui Documentation
                </a>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Link to="/sui-development?tab=chat" className="group">
              <div className="bg-card border rounded-lg p-6 transition-all hover:shadow-md hover:-translate-y-1">
                <Bot className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-medium mb-2">AI Assistant</h3>
                <p className="text-muted-foreground">Chat with an AI assistant specialized in Sui blockchain</p>
              </div>
            </Link>
            
            <Link to="/sui-development?tab=code" className="group">
              <div className="bg-card border rounded-lg p-6 transition-all hover:shadow-md hover:-translate-y-1">
                <Code className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-medium mb-2">Code Generation</h3>
                <p className="text-muted-foreground">Generate Move code from natural language descriptions</p>
              </div>
            </Link>
            
            <Link to="/sui-development?tab=concepts" className="group">
              <div className="bg-card border rounded-lg p-6 transition-all hover:shadow-md hover:-translate-y-1">
                <BookOpen className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-medium mb-2">Concept Explorer</h3>
                <p className="text-muted-foreground">Learn about Sui concepts and best practices</p>
              </div>
            </Link>
            
            <Link to="/sui-development?tab=transactions" className="group">
              <div className="bg-card border rounded-lg p-6 transition-all hover:shadow-md hover:-translate-y-1">
                <Wallet className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-medium mb-2">Transaction Simulator</h3>
                <p className="text-muted-foreground">Test transactions without spending gas</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
