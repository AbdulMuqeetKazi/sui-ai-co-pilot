
export type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  codeSnippets?: string[];
  references?: {
    title: string;
    url: string;
  }[];
};
