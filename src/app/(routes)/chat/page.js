"use client";

import ChatClient from "../../components/chat/chatClient";
import { useStatus } from "@/lib/socket";

export default function Chat() {
  const userData = useStatus().userData;
  return (
    <ChatClient userData={userData} />
  );
}
