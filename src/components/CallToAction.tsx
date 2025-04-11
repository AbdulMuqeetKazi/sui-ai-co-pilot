
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-20 px-4">
      <div className="container max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-br from-sui-900/90 to-sui-700/90 text-white rounded-3xl py-16 px-6 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your Sui development?
          </h2>
          <p className="text-xl text-sui-100 max-w-2xl mx-auto mb-8">
            Join thousands of developers using SuiCoPilot to build faster and smarter on the Sui blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default" className="bg-white text-sui-900 hover:bg-sui-50">
              Get Early Access
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
