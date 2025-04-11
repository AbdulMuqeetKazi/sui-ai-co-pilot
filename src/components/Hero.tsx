
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const [text, setText] = useState('');
  const fullText = "Build smarter, faster Sui blockchain apps with AI assistance";
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 md:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sui-900/20 via-background to-accent/10 -z-10" />
      <div className="container max-w-5xl mx-auto">
        <div className="flex flex-col gap-8 text-center items-center">
          <div className="inline-block bg-sui-100 px-4 py-1.5 rounded-full text-sui-800 text-sm font-medium">
            Sui Overflow 2025 Hackathon
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="blinking-cursor">{text}</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl">
            The first AI-powered co-pilot built specifically for Sui blockchain developers.
            Get smart suggestions, instant code snippets, and seamless integration with your projects.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button size="lg" className="gap-2">
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
