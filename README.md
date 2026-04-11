# AI Interview Prep App

An AI-powered interview practice application with support for both text and voice input modes.

## Features

- Technical, Behavioral, or Mixed interview questions
- Text-based interview mode
- Voice-based interview mode (powered by Vapi.ai)
- Detailed scoring and feedback
- Progress tracking and results analysis

## Final Product

<div>
<img src="https://github.com/CarlSmoky/interview-prep-client/blob/main/docs/ace-the-interview-ai-desktop.png" alt="desktop image" width="500px">
<img src="https://github.com/CarlSmoky/interview-prep-client/blob/main/docs/info.png" alt="Detail page" width="500px">
<img src="https://github.com/CarlSmoky/interview-prep-client/blob/main/docs/sample-questions.png" alt="Detail page" width="500px">
<img src="https://github.com/CarlSmoky/interview-prep-client/blob/main/docs/select-mode.png" alt="Detail page" width="500px">
<img src="https://github.com/CarlSmoky/interview-prep-client/blob/main/docs/answer-voice.png" alt="Detail page" width="500px">
<img src="https://github.com/CarlSmoky/interview-prep-client/blob/main/docs/answer-voice.png" alt="Detail page" width="500px">
<img src="https://github.com/CarlSmoky/interview-prep-client/blob/main/docs/result.png" alt="Detail page" width="500px">
</div>
<div>
<img src="https://github.com/CarlSmoky/interview-prep-client/blob/main/docs/ace-the-interview-ai-mobile.png" alt="Map page For Mobile" height="400px">
</div>

## Setup

### 1. Install Dependencies

```bash
bun install
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

_Note: If you don't set the API key in `.env`, you can enter it in the UI when using voice mode._

### 3. Backend Setup

Make sure your backend server is running on `http://localhost:3000`

See backend repository for setup instructions.

### 4. Run Development Server

```bash
bun dev
```

## Usage

1. **Start Interview**: Fill in your resume, job description, select level and interview type
2. **Choose Mode**: Select either Text or Voice input mode
3. **Answer Questions**:
   - **Text Mode**: Type your answers in the textarea
   - **Voice Mode**: Click the microphone button and speak your answer
4. **View Results**: Get detailed feedback, scores, and improvement suggestions

## Voice Mode

### Vapi.ai

- Requires API key from [vapi.ai](https://vapi.ai)
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

- **Voice Service**: Converts speech to text
- **Backend**: Generates questions, evaluates answers, provides feedback
- **No LLM runs in voice service** - all intelligence is in your backend

```
For running this app's server, go to [Ace the Intereview + AI Server](https://github.com/CarlSmoky/interview-prep-server)

```
