"use client";

import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SendHorizonal, Minimize2, Maximize2, Bot } from "lucide-react";
import useOutsideClick from "@/hooks/useOutsideClick";
import { useLoading } from "@/app/context/LoadingContext";
import { AnimatePresence, motion, Variants } from "motion/react";

type messagesType = {
    sender: string;
    text: string;
}[];

type ChatBotPropType = {
    setOpenChatBox: Dispatch<SetStateAction<boolean>>
};

// Animation variants.
const chatContainerVariants: Variants = {
    minimized: {
        width: 384, // w-96
        height: "auto",
        transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 30 }
    },
    expanded: {
        width: 672, // w-2xl (approx)
        height: "auto",
        transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 30 }
    }
};

const messageVariants: Variants = {
    initial: { opacity: 0, y: 20, scale: 0.8 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.3, type: "spring", stiffness: 400, damping: 25 }
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
};

const quickQuestionVariants: Variants = {
    initial: { opacity: 0, x: -20 },
    animate: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.1, duration: 0.3 }
    })
};

const floatingButtonVariants: Variants = {
    initial: { scale: 0, },
    animate: {
        scale: 1,
        transition: { type: "spring", stiffness: 400, damping: 25 }
    },
    hover: {
        scale: 1.1,
        transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
};


export default function ChatBot({ setOpenChatBox }: ChatBotPropType) {

    const { isMobile } = useLoading();
    const [messages, setMessages] = useState<messagesType>([
        {
            sender: "bot",
            text: "Hello! I'm here to help visitors learn about his work. Feel free to ask about his projects, skills, or how to get in touch."
        }
    ]);
    const [input, setInput] = useState<string>("");
    const [isMinimized, setIsMinimized] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOnline, setIsOnline] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
    const chatBoxRef = useRef<HTMLDivElement>(null);

    // Memoized health check.
    const checkHealth = useCallback(async () => {

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
            const res = await fetch("https://portfolio-assistant-csi7.onrender.com/", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                signal: abortControllerRef.current.signal
            });

            clearTimeout(timeoutIdRef.current);

            if (!res.ok) throw new Error('API response error');

            const data = await res.text();
            if (data) setIsOnline(true);
            console.log("API Response:", data);

        } catch (error: unknown) {
            clearTimeout(timeoutIdRef.current);
            if (error instanceof Error && error.name !== 'AbortError') {
                console.error("Fetch Error:", error);
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
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Auto scroll when new message arrived.
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    console.log("Chat box component rendering");

    // Chat box resize function
    const handleResizing = useCallback(() => {
        setIsMinimized(prev => !prev);
    }, []);


    // Handle outside click.
    useOutsideClick(chatBoxRef, () => setOpenChatBox(false));

    // Memoized message send function.
    const sendMessage = useCallback(async () => {
        if (!isOnline || !input.trim() || isLoading) return;
        const userQuestion = input.trim();
        setMessages(preMsg => [...preMsg, { sender: 'user', text: userQuestion }]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("https://portfolio-assistant-csi7.onrender.com/api/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: userQuestion })
            });

            const data = await res.json();
            setMessages(prevMsg => [...prevMsg, { sender: "bot", text: data.answer || "I apologize, but I'm having trouble processing your question right now." }]);
        } catch (error) {
            console.error("chat error", error);
            setMessages(prevMsg => [...prevMsg, {
                sender: "bot",
                text: "I'm currently experiencing connection issues. Please try again in a moment or check out my portfolio directly."
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, isOnline]);


    // Memoized quick questions suggestions.
    const quickQuestions = useMemo(() => [
        "What technologies does he use?",
        "Tell me about his projects?",
        "What services does he provide?",
        "How can I contact him?",
    ], []);

    // Handle quick question click.
    const handleQuickQuestionClick = useCallback((question: string) => {
        setInput(question);
    }, []);

    // Handle input keydown.
    const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }, [sendMessage]);


    if (isMinimized && isMobile) {
        return (
            <motion.div
                className="fixed bottom-4 right-4 z-50"
                variants={floatingButtonVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
            >
                <button
                    onClick={() => setIsMinimized(false)}
                    aria-label="Assistant button"
                    className="bg-linear-to-r from-orange-500 to-orange-400 text-white p-4 rounded-full shadow-lg hover:shadow-xl cursor-pointer"
                >
                    <Bot size={24} />
                </button>
            </motion.div>
        );
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className={`fixed ${isMobile ? 'bottom-0 right-0' : 'bottom-4 right-4'
                    } z-50 rounded-2xl shadow-3xl border-4 border-gray-900 flex flex-col overflow-hidden`}
                ref={chatBoxRef}
                variants={!isMobile ? chatContainerVariants : undefined}
                initial={!isMobile ? "minimized" : false}
                animate={!isMobile ? (isMinimized ? "minimized" : "expanded") : false}
                layout={false}
            >
                {/* Header */}
                <motion.div className="bg-linear-to-r from-orange-500 to-orange-400 text-white p-4 rounded-t-2xl"
                    layout
                >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <Bot />
                            </div>
                            <div>
                                <h3 className="font-semibold">Portfolio Assistant</h3>
                                <p className="text-xs text-blue-100">{isOnline ? "Online • Ready to help" : "Offline • Not ready to help"}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            {isMobile ? (
                                <motion.button
                                    onClick={() => setIsMinimized(true)}
                                    className="text-white/80 hover:text-white transition-colors cursor-pointer"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Minimize2 size={18} />
                                </motion.button>
                            ) : (
                                <motion.button
                                    className="text-white/80 hover:text-white transition-colors cursor-pointer"
                                    onClick={handleResizing}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                                </motion.button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Messages Container */}
                <div className=" relative flex-1 p-4 bg-white/0 backdrop-blur-md max-h-[480px] overflow-y-auto">

                    <div className=" relative space-y-4">
                        <AnimatePresence mode="popLayout">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={`${message.sender}-${index}-${message.text.slice(0, 10)}`}
                                    variants={messageVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl p-3 ${message.sender === "user"
                                            ? "bg-orange-400 text-gray-950 rounded-br-none"
                                            : "bg-orange-50 text-gray-800 border border-orange-200 rounded-bl-none shadow-sm shadow-orange-900"
                                            }`}
                                    >
                                        <p className="text-sm">{message.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>


                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-3 shadow-sm">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                </div>

                {/* Quick Questions */}
                <AnimatePresence>
                    {messages.length <= 2 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-4 py-2 bg-orange-50">
                            <p className="text-xs text-gray-900 mb-2">Quick questions:</p>
                            <div className="flex flex-wrap gap-2">
                                {quickQuestions.map((question, index) => (
                                    <motion.button
                                        key={`${question}-${index}`}
                                        onClick={() => handleQuickQuestionClick(question)}
                                        className="text-xs bg-orange-200 hover:bg-orange-300 hover:text-gray-950 text-gray-700 px-3 py-1 rounded-full cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-orange-400 focus:ring-offset-1"
                                        variants={quickQuestionVariants}
                                        initial="initial"
                                        animate="animate"
                                        custom={index}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {question}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-400/20 rounded-b-2xl bg-orange-50">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            name="question"
                            id="question"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleInputKeyDown}
                            placeholder="Type your message..."
                            disabled={isLoading}
                            className="flex-1 border border-gray-400 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                        />
                        <button
                            aria-label="send button"
                            onClick={sendMessage}
                            disabled={isLoading || !input.trim() || !isOnline}
                            className="bg-orange-400 hover:bg-orange-500 disabled:bg-gray-400 text-white p-2 rounded-full cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
                        >
                            <SendHorizonal />
                        </button>
                    </div>
                    <motion.p
                        className="text-xs text-gray-900 text-center mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        AI-powered assistant • Connected to my backend
                    </motion.p>
                </div>

            </motion.div>
        </AnimatePresence>
    )
}
