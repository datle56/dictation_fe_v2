# Lesson Page Component

This folder contains the refactored lesson page component with improved word-by-word answer checking functionality.

## Structure

```
lessonPage/
├── LessonPage.tsx              # Main lesson page component
├── components/                 # Reusable sub-components
│   ├── AudioPlayer.tsx         # Audio playback component
│   ├── AnswerInput.tsx         # Text input with speech-to-text
│   ├── AnswerResult.tsx        # Answer validation display
│   └── ProgressBar.tsx         # Progress indicator
├── utils/                      # Utility functions
│   ├── answerChecker.ts        # Word-by-word matching logic
│   ├── speechToText.ts         # Speech recognition service
│   └── __tests__/              # Unit tests
│       └── answerChecker.test.ts
├── index.ts                    # Export file
└── README.md                   # This file
```

## Features

### Word-by-Word Answer Checking

The new answer checking system implements the methodology from dailydictation.com:

1. **Text Normalization**: Converts input to lowercase, removes extra spaces and trailing punctuation
2. **Word Splitting**: Splits text into individual words for comparison
3. **Variant Matching**: Supports multiple acceptable variants for each word (e.g., "mom/mum", "26th./twenty-sixth.")
4. **Continuous Checking**: Allows users to check answers multiple times without "try again" button
5. **Detailed Feedback**: Shows word-by-word analysis with correct/incorrect indicators

### Speech-to-Text Integration

- Uses Web Speech API for voice input
- Supports English (en-US) language
- Provides real-time transcription with interim results
- Handles various error states (no microphone, permission denied, etc.)

### Component Architecture

- **Modular Design**: Each component has a single responsibility
- **Reusable Components**: AudioPlayer, AnswerInput, AnswerResult can be used elsewhere
- **Type Safety**: Full TypeScript support with proper interfaces
- **Error Handling**: Comprehensive error handling for audio and speech recognition

## Usage

```tsx
import { LessonPage } from './components/lessonPage';

<LessonPage 
  lesson={selectedLesson} 
  onBack={handleBack} 
/>
```

## Answer Checking Logic

The system checks answers using a 2D solution array where each inner array contains acceptable variants for each word:

```typescript
// Example solution for "My mom doesn't like the snow."
const solution = [
  ['My'],
  ['mom', 'mum'],           // Accepts both variants
  ['doesn\'t', 'does not'], // Accepts both variants
  ['like'],
  ['the'],
  ['snow.']
];
```

### Supported Variants

- **British/American English**: mom/mum, doesn't/does not
- **Number formats**: 26th./twenty-sixth.
- **Punctuation flexibility**: Handles trailing punctuation variations
- **Case insensitive**: Converts to lowercase for comparison

## Testing

Run the unit tests to verify the answer checking logic:

```bash
npm test answerChecker.test.ts
```

The tests cover:
- Text normalization
- Word splitting
- Variant matching
- Complete answer validation
- Error cases (wrong word count, incorrect words)
