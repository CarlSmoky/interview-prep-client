import { useEffect, useState, useCallback, useRef } from "react";
import Vapi from "@vapi-ai/web";

export const useVapi = (apiKey: string) => {
  const vapiRef = useRef<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);

  useEffect(() => {
    console.log("useVapi useEffect - apiKey:", apiKey ? "present" : "missing");

    if (!apiKey) {
      console.error("No Vapi API key provided!");
      return;
    }

    console.log("Creating Vapi instance...");
    const vapi = new Vapi(apiKey);
    vapiRef.current = vapi;
    console.log("Vapi instance created:", vapi);

    vapi.on("call-start", () => {
      console.log("Vapi call started");
      setIsCallActive(true);
    });

    vapi.on("call-end", () => {
      console.log("Vapi call ended");
      setIsCallActive(false);
      setIsSpeaking(false);
    });

    vapi.on("speech-start", () => {
      setIsSpeaking(true);
    });

    vapi.on("speech-end", () => {
      setIsSpeaking(false);
    });

    vapi.on("message", (message) => {
      console.log("Vapi message:", message.type, message);

      if (message.type === "transcript" && message.role === "user") {
        console.log("User transcript:", message.transcript);
        setTranscript((prev) => {
          const newTranscript = prev
            ? `${prev} ${message.transcript}`
            : message.transcript;
          return newTranscript.trim();
        });
      }

      // Track when assistant is speaking
      if (message.type === "transcript" && message.role === "assistant") {
        console.log("Assistant speaking:", message.transcript);
        setAssistantSpeaking(true);
      }

      // When assistant finishes a message
      if (message.type === "assistant-end") {
        setAssistantSpeaking(false);
      }
    });

    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
    });

    return () => {
      vapi.stop();
    };
  }, [apiKey]);

  const start = useCallback((question: string) => {
    console.log("useVapi start called with question:", question);

    if (!vapiRef.current) {
      console.error("Vapi ref is null!");
      return;
    }

    try {
      console.log("Starting Vapi call...");
      vapiRef.current.start({
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en",
        },
        model: {
          provider: "openai",
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a text-to-speech question reader, NOT a conversational assistant. 

CRITICAL RULES:
1. Read the interview question out loud ONCE
2. After reading the question, you MUST remain completely silent
3. ONLY EXCEPTION: If the user explicitly asks you to "repeat the question" or "say that again", repeat the original question ONCE, then return to complete silence
4. Do NOT respond to their answer - stay silent
5. Do NOT ask follow-up questions - stay silent
6. Do NOT ask for clarification - stay silent
7. Do NOT encourage them - stay silent
8. Do NOT fill silence with conversation - stay silent
9. Even if they pause for 30 seconds - stay silent
10. Even if their answer is short - stay silent
11. Even if it seems like they're done - stay silent

The user will manually press "Stop" and "Submit" when finished. You have NO role after reading the question except to repeat it if explicitly asked. Treat yourself as a recording, not a person.`,
            },
          ],
        },
        voice: {
          provider: "11labs",
          voiceId: "paula",
        },
        firstMessage: question,
      });
      console.log("Vapi start command sent");
    } catch (error) {
      console.error("Error starting Vapi:", error);
    }
  }, []);

  const stop = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  return {
    start,
    stop,
    isCallActive,
    transcript,
    isSpeaking,
    assistantSpeaking,
    clearTranscript,
  };
};
