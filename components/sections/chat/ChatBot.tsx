"use client";

import {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useOutsideClick from "@/hooks/useOutsideClick";
import { useLoading } from "@/app/context/LoadingContext";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "d9-toast";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import QuickQuestions from "./QuickQuestions";
import ChatInput from "./ChatInput";
import FloatingButton from "./FloatingButton";
import { chatContainerVariants } from "./animations";

type messagesType = {
  sender: string;
  text: string;
}[];

type ChatBotPropType = {
  setOpenChatBox: Dispatch<SetStateAction<boolean>>;
};

function ChatBot({ setOpenChatBox }: ChatBotPropType) {
  const { isMobile } = useLoading();
  const [messages, setMessages] = useState<messagesType>([
    {
      sender: "bot",
      text: "Hello! I'm here to help visitors learn about his work. Feel free to ask about his projects, skills, or how to get in touch.",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  // Memoized health check.
  const checkHealth: () => Promise<void> =
    useCallback(async (): Promise<void> => {
      // if (!isOnline) {
      //     toast.info("Checking assistant status.", {
      //         title: false,
      //         theme: 'dark',
      //     });
      // }

      // Clean up any previous requests.
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }

      // Create new controller and timeout
      abortControllerRef.current = new AbortController();
      timeoutIdRef.current = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, 5000);

      try {
        const res: Response = await fetch(
          "https://portfolio-assistant-csi7.onrender.com/",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal: abortControllerRef.current.signal,
          },
        );

        clearTimeout(timeoutIdRef.current);

        if (!res.ok) throw new Error("API response error");

        const data: string = await res.text();

        if (data) {
          toast.success("Assistant is online now, Ready to help...", {
            theme: "dark",
          });

          setIsOnline(true);
        }
        // console.log("API Response:", data);
      } catch (error: unknown) {
        clearTimeout(timeoutIdRef.current);
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Fetch Error:", error);
          toast.error("Assistant is offline now, Not Ready to help !", {
            theme: "dark",
          });
          setIsOnline(false);
        }
        // Silently handle abort errors...
      }
    }, []);

  useEffect(() => {
    checkHealth();
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [checkHealth]);

  // Auto-scroll to bottom when new messages arrive.
  const scrollToBottom: () => void = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto scroll when new message arrived.
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle outside click.
  useOutsideClick(chatBoxRef, () => setOpenChatBox(false));

  // Memoized message send function.
  const sendMessage: () => Promise<void> = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    if (!isOnline) {
      toast.warning("Assistant is offline. Try again later.", {
        theme: "dark",
      });
      return;
    }
    const userQuestion = input.trim();
    setMessages((preMsg) => [
      ...preMsg,
      { sender: "user", text: userQuestion },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const res: Response = await fetch(
        "https://portfolio-assistant-csi7.onrender.com/api/ask",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: userQuestion }),
        },
      );

      const data: { answer: string } = await res.json();
      setMessages((prevMsg) => [
        ...prevMsg,
        {
          sender: "bot",
          text:
            data.answer ||
            "I apologize, but I'm having trouble processing your question right now.",
        },
      ]);
    } catch (error) {
      console.error("chat error", error);
      setMessages((prevMsg) => [
        ...prevMsg,
        {
          sender: "bot",
          text: "I'm currently experiencing connection issues. Please try again in a moment or check out my portfolio directly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isOnline]);

  if (isMinimized && isMobile) {
    return <FloatingButton onClick={() => setIsMinimized(false)} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={` chat-container fixed max-h-[600px] ${
          isMobile ? "bottom-0 right-0" : "bottom-4 right-4"
        } z-50 rounded-2xl border border-white/10 shadow-2xl m-1.5 flex flex-col overflow-hidden`}
        ref={chatBoxRef}
        variants={!isMobile ? chatContainerVariants : undefined}
        initial={!isMobile ? "minimized" : false}
        animate={!isMobile ? (isMinimized ? "minimized" : "expanded") : false}
        layout={false}
      >
        <ChatHeader
          isOnline={isOnline}
          isMobile={isMobile}
          isMinimized={isMinimized}
          setIsMinimized={setIsMinimized}
        />

        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />

        <QuickQuestions messages={messages} setInput={setInput} />

        <ChatInput
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          isLoading={isLoading}
        />
      </motion.div>
    </AnimatePresence>
  );
}

export default memo(ChatBot);
