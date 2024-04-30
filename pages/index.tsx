import { Chat } from "@/components/Chat/Chat";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { Message } from "@/types";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (message: Message) => {
    const updatedMessages = [...messages, message];

    setMessages(updatedMessages);
    setLoading(true);
    console.log(updatedMessages);
    const response = await fetch("https://lqkgzlnq-5000.asse.devtunnels.ms/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: message.content,
      }),
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    const data = await response.json();
    console.log(data);
    if (!data) {
      return;
    }

    setLoading(false);

    const answer = data[1].answer;
    console.log(answer);
    // Now you can use the 'answer' variable as needed

    // Example: Update UI with the answer
    setMessages((messages) => [
      ...messages,
      {
        role: "assistant",
        content: answer, // Assuming 'answer' is the response you want to show in the UI
      },
    ]);
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: `Welcome! I'm Chatbot UI, your HR Assistant. I'm here to assist you in finding the most suitable candidate for your company. How can I help you with your candidate search?`,
      },
    ]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Welcome! I'm Chatbot UI, your HR Assistant. I'm here to assist you in finding the most suitable candidate for your company. How can I help you with your candidate search?`,
      },
    ]);
  }, []);

  return (
    <>
      <Head>
        <title>Talent Acquisition Search Application</title>
        <meta
          name="description"
          content="A simple chatbot starter kit for OpenAI's chat model using Next.js, TypeScript, and Tailwind CSS."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar />

        <div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10 h-[calc(100vh-4rem)]">
          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
            <Chat
              messages={messages}
              loading={loading}
              onSend={handleSend}
              onReset={handleReset}
            />
            <div ref={messagesEndRef} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
