
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeSnippetsUI from "@/components/CodeSnippetsUI";
import ConceptCards from "@/components/ConceptCards";
import { Code, BookOpen } from "lucide-react";
import Footer from "@/components/Footer";

const CodeAndConcepts = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-8 gradient-text">
          Learn & Generate Sui Move Code
        </h1>
        
        <Tabs defaultValue="snippets" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="snippets" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>Code Generation</span>
            </TabsTrigger>
            <TabsTrigger value="concepts" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Sui Concepts</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="snippets">
            <CodeSnippetsUI />
          </TabsContent>
          
          <TabsContent value="concepts">
            <ConceptCards />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default CodeAndConcepts;
