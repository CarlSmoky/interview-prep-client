# AI Interview Prep App

An AI-powered interview practice application with support for both text and voice input modes.

## Features

- 🎯 Technical, Behavioral, or Mixed interview questions
- 💬 Text-based interview mode
- 🎤 Voice-based interview mode (powered by Vapi.ai)
- 📊 Detailed scoring and feedback
- 📈 Progress tracking and results analysis

## Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**For Voice Mode (Optional):**
- Sign up at [vapi.ai](https://vapi.ai)
- Get your Public API Key from the dashboard
- Add it to `.env`:
```
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key_here
```

*Note: If you don't set the API key in `.env`, you can enter it in the UI when using voice mode.*

### 3. Backend Setup
Make sure your backend server is running on `http://localhost:3000`

See backend repository for setup instructions.

### 4. Run Development Server
```bash
pnpm dev
```

## Usage

1. **Start Interview**: Fill in your resume, job description, select level and interview type
2. **Choose Mode**: Select either Text or Voice input mode
3. **Answer Questions**: 
   - **Text Mode**: Type your answers in the textarea
   - **Voice Mode**: Click the microphone button and speak your answer
4. **View Results**: Get detailed feedback, scores, and improvement suggestions

## Voice Mode

The app supports **two voice input options**:

### 1. Browser Speech (Free - Recommended)
- ✅ **No API key needed**
- ✅ Works in Chrome, Edge, Safari
- ✅ Uses browser's built-in Web Speech API
- ✅ Perfect for simple transcription

### 2. Vapi.ai (Professional)
- Requires API key from [vapi.ai](https://vapi.ai)
- Professional-grade speech recognition
- Better accuracy in noisy environments
- Requires credits/billing

**How it works:**
1. Click the microphone button to start recording
2. Speak your answer clearly
3. Click again to stop and submit
4. Live transcription appears on screen

**Architecture:**
```
User speaks → Voice Service (Speech-to-Text) → Frontend → Backend (Question Generation & Answer Evaluation) → Results
```

- **Voice Service**: Converts speech to text (transcription only)
- **Backend**: Generates questions, evaluates answers, provides feedback
- **No LLM runs in voice service** - all intelligence is in your backend

### Troubleshooting Vapi Errors
If you see "daily-error" or "Meeting ended" errors with Vapi:
1. Check your Vapi account has credits/valid billing
2. Verify your API key is correct
3. Switch to **Browser Speech (Free)** option as alternative

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
