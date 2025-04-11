
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import DemoChatInterface from "@/components/DemoChatInterface";
import CodeDemo from "@/components/CodeDemo";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <DemoChatInterface />
        <CodeDemo />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
