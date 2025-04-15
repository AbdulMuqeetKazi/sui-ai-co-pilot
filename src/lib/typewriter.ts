
// This function adds a typewriter effect to a DOM element or updates a callback with the text
export function typeWriter(
  element: HTMLElement | string,
  phrases: string[] | ((text: string) => void),
  options: {
    startDelay?: number;
    typeSpeed?: number;
    backSpeed?: number;
    backDelay?: number;
    loop?: boolean;
    onComplete?: () => void;
  } = {}
): () => void {
  // Default options
  const defaults = {
    startDelay: 500,
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 2000,
    loop: false,
    onComplete: () => {}
  };
  
  // Merge defaults with provided options
  const settings = { ...defaults, ...options };
  
  // Handle different usage scenarios
  if (typeof element === 'string' && typeof phrases === 'function') {
    // Case: typeWriter(text, callback) - legacy mode
    const text = element;
    const callback = phrases as (text: string) => void;
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        callback(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        if (settings.onComplete) settings.onComplete();
      }
    }, settings.typeSpeed);
    
    // Return function to cancel typing if needed
    return () => clearInterval(interval);
  } else {
    // Case: typeWriter(element, phrases, options) - modern mode
    const targetElement = element as HTMLElement;
    const textPhrases = phrases as string[];
    
    let currentPhraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: number | undefined;
    
    const type = () => {
      // Clear any existing timeout
      if (timeoutId) clearTimeout(timeoutId);
      
      const currentPhrase = textPhrases[currentPhraseIndex];
      
      if (isDeleting) {
        // Deleting characters
        charIndex--;
        targetElement.textContent = currentPhrase.substring(0, charIndex);
        
        if (charIndex === 0) {
          isDeleting = false;
          currentPhraseIndex = (currentPhraseIndex + 1) % textPhrases.length;
          
          // If we've completed all phrases and loop is false, stop
          if (!settings.loop && currentPhraseIndex === 0) {
            if (settings.onComplete) settings.onComplete();
            return;
          }
          
          // Pause before typing next phrase
          timeoutId = setTimeout(type, settings.backDelay) as unknown as number;
          return;
        }
        
        timeoutId = setTimeout(type, settings.backSpeed) as unknown as number;
      } else {
        // Adding characters
        charIndex++;
        targetElement.textContent = currentPhrase.substring(0, charIndex);
        
        if (charIndex === currentPhrase.length) {
          // If we're not looping and this is the last phrase, call onComplete
          if (!settings.loop && currentPhraseIndex === textPhrases.length - 1) {
            if (settings.onComplete) settings.onComplete();
            return;
          }
          
          isDeleting = true;
          timeoutId = setTimeout(type, settings.backDelay) as unknown as number;
          return;
        }
        
        timeoutId = setTimeout(type, settings.typeSpeed) as unknown as number;
      }
    };
    
    // Start typing after the specified delay
    timeoutId = setTimeout(type, settings.startDelay) as unknown as number;
    
    // Return a cleanup function
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }
}
