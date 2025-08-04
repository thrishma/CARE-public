import { useState } from "react";
import {
  HStack,
  Input,
  Button,
  IconButton,
  Box,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function ChatInput({
  onSendMessage,
  isLoading,
  disabled,
}: ChatInputProps): JSX.Element {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !isLoading && !disabled) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box p={4}>
      <HStack spacing={2}>
        <InputGroup>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your e-commerce needs..."
            disabled={isLoading || disabled}
            bg="white"
            border="1px"
            borderColor="gray.300"
            _focus={{
              borderColor: "blue.500",
              boxShadow: "0 0 0 1px blue.500",
            }}
          />
          <InputRightElement>
            <IconButton
              aria-label="Send message"
              icon={<FiSend />}
              onClick={handleSend}
              disabled={!input.trim() || isLoading || disabled}
              variant="ghost"
              size="sm"
              color="blue.500"
              _hover={{ bg: "blue.50" }}
            />
          </InputRightElement>
        </InputGroup>
      </HStack>
    </Box>
  );
}
