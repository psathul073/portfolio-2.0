import { Bot } from "lucide-react";

export default function FloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={onClick}
        className="bg-orange-500 text-white p-4 rounded-full hover:bg-orange-600 cursor-pointer"
      >
        <Bot size={24} />
      </button>
    </div>
  );
}
