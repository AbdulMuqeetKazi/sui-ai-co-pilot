
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import AIChatInterface from "@/components/AIChatInterface";
import ProjectScaffolder from "@/components/ProjectScaffolder";
import CodeSnippetBrowser from "@/components/CodeSnippetBrowser"; 
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
        <CodeSnippetBrowser />
        <AIChatInterface />
        <ProjectScaffolder />
        <CodeDemo />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
