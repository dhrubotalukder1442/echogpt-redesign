import type { Metadata } from "next";
import ChatApp from "@/components/ChatApp";

export const metadata: Metadata = {
  title: "Chat · EchoGPT",
  description: "Chat with multiple AI models in one place.",
};

export default function ChatPage() {
  return <ChatApp />;
}