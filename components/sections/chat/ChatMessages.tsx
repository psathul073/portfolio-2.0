"use client";

import React from "react";
import FormatMessage from "./FormatMessage";

type messageType = {
  sender: string;
  text: string;
};

type ChatMessagesProps = {
  messages: messageType[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
};

export default function ChatMessages({
  messages,
  isLoading,
  messagesEndRef,
}: ChatMessagesProps) {
  return (
    <div className="relative flex-1 p-2 bg-black/90 overflow-y-auto">
      <div className="space-y-4">
        {messages.map((message: messageType, index: number) => (
          <div
            key={`${message.sender}-${index}-${message.text.slice(0, 10)}`}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-3 wrap-break-word ${
                message.sender === "user"
                  ? "bg-orange-400 text-gray-800 rounded-br-none"
                  : "bg-orange-50 text-gray-800 border border-orange-200 rounded-bl-none"
              }`}
            >
              <FormatMessage text={message.text} />
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-400"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
