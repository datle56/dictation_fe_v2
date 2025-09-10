/**
 * Utility function to calculate error position for cursor placement
 * Based on comparison between solution array and user input
 */

export interface ErrorPositionResult {
  errorPosition: number | undefined;
  errorWordIndex: number | undefined;
  errorCharIndex: number | undefined;
}

/**
 * Calculate the error position in user input to place cursor at first mistake
 * @param solution - 2D array of correct word variants
 * @param userInput - Full user input string
 * @returns ErrorPositionResult with position details
 */
export function calculateErrorPosition(
  solution: string[][],
  userInput: string
): ErrorPositionResult {
  const userWords = userInput.trim().split(/\s+/);
  
  console.log('calculateErrorPosition - solution:', solution);
  console.log('calculateErrorPosition - userWords:', userWords);
  
  // Empty input
  if (userWords.length === 0) {
    return { errorPosition: 0, errorWordIndex: 0, errorCharIndex: 0 };
  }
  
  // Too many words - point to start of extra words
  if (userWords.length > solution.length) {
    let pos = 0;
    for (let i = 0; i < solution.length; i++) {
      pos += userWords[i].length + 1; // +1 for space
    }
    return { errorPosition: pos, errorWordIndex: solution.length, errorCharIndex: 0 };
  }
  
  // Check each word position
  let currentPos = 0;
  
  for (let i = 0; i < solution.length; i++) {
    const correctVariants = solution[i];
    const userWord = userWords[i] || '';
    
    console.log(`Checking position ${i}: solution=${correctVariants}, userWord="${userWord}"`);
    
    // Check if current word is correct
    const isCorrect = correctVariants.some(variant => 
      variant.toLowerCase() === userWord.toLowerCase()
    );
    
    console.log(`Position ${i} isCorrect: ${isCorrect}`);
    
    if (isCorrect) {
      // Word is correct, move to next position
      currentPos += userWord.length + (i < solution.length - 1 ? 1 : 0);
      console.log(`Position ${i} correct, currentPos: ${currentPos}`);
      continue;
    }
    
    // Found incorrect word
    if (userWord === '') {
      // Missing word - point to current position
      console.log(`Position ${i} missing word, returning currentPos: ${currentPos}`);
      return { errorPosition: currentPos, errorWordIndex: i, errorCharIndex: 0 };
    }
    
    // Check if this word appears later in solution (indicating missing words)
    const appearsLater = solution.slice(i + 1).some(laterVariants => 
      laterVariants.some(variant => variant.toLowerCase() === userWord.toLowerCase())
    );
    
    console.log(`Position ${i} appearsLater: ${appearsLater}`);
    
    if (appearsLater) {
      // Missing words - point to current position to insert missing words
      console.log(`Position ${i} missing words, returning currentPos: ${currentPos}`);
      return { errorPosition: currentPos, errorWordIndex: i, errorCharIndex: 0 };
    }
    
    // Wrong word - point to end of wrong word
    console.log(`Position ${i} wrong word, returning end of word`);
    return { 
      errorPosition: currentPos + userWord.length, 
      errorWordIndex: i, 
      errorCharIndex: userWord.length 
    };
  }
  
  // All existing words are correct, check if missing words at end
  if (userWords.length < solution.length) {
    return { 
      errorPosition: userInput.length, 
      errorWordIndex: userWords.length, 
      errorCharIndex: 0 
    };
  }
  
  // All correct
  return { 
    errorPosition: undefined, 
    errorWordIndex: undefined, 
    errorCharIndex: undefined 
  };
}

/**
 * Set cursor position in input element
 * @param inputRef - Reference to input element
 * @param position - Position to set cursor (0-based index)
 */
export function setCursorPosition(inputRef: React.RefObject<HTMLInputElement>, position: number) {
  if (inputRef.current) {
    const maxPos = inputRef.current.value.length;
    const cursorPos = Math.min(Math.max(0, position), maxPos);
    
    inputRef.current.setSelectionRange(cursorPos, cursorPos);
    inputRef.current.focus();
    inputRef.current.scrollLeft = 0;
  }
}