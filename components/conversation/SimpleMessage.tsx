"use client";

import { Message } from "@/types/conversation";
import { Box, HStack, VStack, Text, Avatar } from "@chakra-ui/react";

interface SimpleMessageProps {
  message: Message;
}

export default function SimpleMessage({ message }: SimpleMessageProps) {
  const isUser = message.role === "user";

  return (
    <HStack spacing={3} align="start" justify={isUser ? "end" : "start"} mb={4}>
      {!isUser && (
        <Avatar
          size="sm"
          name="CARE AI"
          bg="blue.500"
          color="white"
          fontSize="xs"
        />
      )}

      <Box maxW="3xl" order={isUser ? 2 : 1}>
        <Box
          bg={isUser ? "blue.600" : "gray.100"}
          color={isUser ? "white" : "gray.900"}
          border={isUser ? "none" : "1px"}
          borderColor={isUser ? "transparent" : "gray.200"}
          borderRadius="lg"
          px={4}
          py={2}
        >
          <Text fontSize="sm" lineHeight="relaxed" whiteSpace="pre-wrap">
            {message.content}
          </Text>
        </Box>

        <Text
          fontSize="xs"
          color="gray.500"
          mt={1}
          textAlign={isUser ? "right" : "left"}
        >
          {new Date(message.timestamp).toLocaleString()}
        </Text>
      </Box>

      {isUser && (
        <Avatar
          size="sm"
          name="You"
          bg="gray.500"
          color="white"
          fontSize="xs"
        />
      )}
    </HStack>
  );
}
