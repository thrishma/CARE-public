import ChatWindow from "@/components/chat/ChatWindow";
import WelcomeBanner from "@/components/auth/WelcomeBanner";
import { Box } from "@chakra-ui/react";

export default async function Home() {
  return (
    <Box>
      <WelcomeBanner />
      <ChatWindow />
    </Box>
  );
}
