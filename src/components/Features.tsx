
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, MessageSquare, BookOpen, Rocket, Brain, Zap } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Code className="h-8 w-8 text-sui-600" />,
      title: 'Code Snippet Generation',
      description: 'Generate optimized code snippets for common Sui patterns and smart contract templates with a single prompt.'
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-sui-600" />,
      title: 'Interactive Chat',
      description: 'Ask questions about Sui development and get instant, contextual answers tailored to your specific needs.'
    },
    {
      icon: <BookOpen className="h-8 w-8 text-sui-600" />,
      title: 'Documentation Explorer',
      description: 'Access and search through Sui documentation directly in your workflow without switching contexts.'
    },
    {
      icon: <Rocket className="h-8 w-8 text-sui-600" />,
      title: 'Project Scaffolding',
      description: 'Create new Sui projects with the right structure and dependencies in seconds, not hours.'
    },
    {
      icon: <Brain className="h-8 w-8 text-sui-600" />,
      title: 'AI-powered Insights',
      description: 'Get smart recommendations and best practices based on your code and development patterns.'
    },
    {
      icon: <Zap className="h-8 w-8 text-sui-600" />,
      title: 'Blockchain Integration',
      description: 'Connect directly to Sui networks for testing, deployment, and interaction with minimal configuration.'
    }
  ];

  return (
    <section id="features" className="py-20 px-4 bg-secondary/50">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Supercharge Your <span className="gradient-text">Sui Development</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Designed specifically for Sui blockchain developers, our AI-powered co-pilot enhances every aspect of your workflow.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
