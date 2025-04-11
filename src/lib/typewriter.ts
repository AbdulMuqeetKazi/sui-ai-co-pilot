
export function typeWriter(
  text: string, 
  callback: (text: string) => void, 
  speed: number = 50
): () => void {
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      callback(text.substring(0, i + 1));
      i++;
    } else {
      clearInterval(interval);
    }
  }, speed);
  
  // Return function to cancel typing if needed
  return () => clearInterval(interval);
}
