
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, CheckCircle2, FolderTree } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ProjectScaffolder = () => {
  const [projectType, setProjectType] = useState('contract');
  const [projectName, setProjectName] = useState('my_sui_project');
  const [includeTests, setIncludeTests] = useState(true);
  const [includeExamples, setIncludeExamples] = useState(true);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const generateCommand = () => {
    return `sui move new ${projectName} ${projectType === 'package' ? '--package' : ''}`;
  };

  const getFolderStructure = () => {
    const hasTests = includeTests ? `
    |-- tests
    |   |-- ${projectName}_tests.move` : '';

    const hasExamples = includeExamples ? `
    |-- examples
    |   |-- ${projectName}_example.move` : '';

    return `${projectName}/
|-- sources
|   |-- ${projectName}.move${hasTests}${hasExamples}
|-- Move.toml`;
  };

  const getBasicTemplate = () => {
    return `module ${projectName}::${projectName} {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    /// A basic Sui Move object
    struct Example has key, store {
        id: UID,
        value: u64,
    }
    
    /// Create a new Example object and transfer it to the sender
    public entry fun create_example(value: u64, ctx: &mut TxContext) {
        let example = Example {
            id: object::new(ctx),
            value,
        };
        transfer::transfer(example, tx_context::sender(ctx));
    }
    
    /// Update the value of an Example object
    public entry fun update_value(example: &mut Example, new_value: u64) {
        example.value = new_value;
    }
}`;
  };

  const getMoveToml = () => {
    return `[package]
name = "${projectName}"
version = "0.1.0"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

[addresses]
${projectName} = "0x0"
`;
  };

  const copyToClipboard = (text: string, tab: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <section id="scaffolder" className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Project Scaffolder</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate the structure for your Sui Move project with recommended best practices.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-5">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Project Configuration</CardTitle>
              <CardDescription>Configure your new Sui project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                  placeholder="my_sui_project"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Project Type</Label>
                <RadioGroup value={projectType} onValueChange={setProjectType} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="contract" id="contract" />
                    <Label htmlFor="contract">Smart Contract (default)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="package" id="package" />
                    <Label htmlFor="package">Package (library)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>Project Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-tests" 
                      checked={includeTests} 
                      onCheckedChange={(checked) => setIncludeTests(checked as boolean)}
                    />
                    <Label htmlFor="include-tests">Include test directory</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-examples" 
                      checked={includeExamples} 
                      onCheckedChange={(checked) => setIncludeExamples(checked as boolean)}
                    />
                    <Label htmlFor="include-examples">Include examples directory</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Project Template</CardTitle>
              <CardDescription>Copy these templates to your local environment</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="cli">
                <TabsList className="mb-4">
                  <TabsTrigger value="cli">CLI Command</TabsTrigger>
                  <TabsTrigger value="structure">Folder Structure</TabsTrigger>
                  <TabsTrigger value="module">Module Template</TabsTrigger>
                  <TabsTrigger value="toml">Move.toml</TabsTrigger>
                </TabsList>
                
                <TabsContent value="cli" className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(generateCommand(), 'cli')}
                  >
                    {copiedTab === 'cli' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <pre className="bg-muted p-4 rounded-md overflow-auto">{generateCommand()}</pre>
                </TabsContent>
                
                <TabsContent value="structure" className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(getFolderStructure(), 'structure')}
                  >
                    {copiedTab === 'structure' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <div className="p-4 bg-muted rounded-md">
                    <div className="flex items-start space-x-2">
                      <FolderTree className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <pre className="whitespace-pre">{getFolderStructure()}</pre>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="module" className="relative code-block">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2 z-10"
                    onClick={() => copyToClipboard(getBasicTemplate(), 'module')}
                  >
                    {copiedTab === 'module' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <pre className="bg-muted p-4 rounded-md overflow-auto">{getBasicTemplate()}</pre>
                </TabsContent>
                
                <TabsContent value="toml" className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(getMoveToml(), 'toml')}
                  >
                    {copiedTab === 'toml' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <pre className="bg-muted p-4 rounded-md overflow-auto">{getMoveToml()}</pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProjectScaffolder;
