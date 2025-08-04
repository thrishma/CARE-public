import { Box, Text, Avatar, HStack, VStack } from '@chakra-ui/react'
import { Message } from '@/types/conversation'

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  
  return (
    <HStack
      align="start"
      justify={isUser ? 'flex-end' : 'flex-start'}
      mb={4}
      w="full"
    >
      {!isUser && (
        <Avatar
          size="sm"
          name="CARE"
          bg="blue.500"
          color="white"
          mr={2}
        />
      )}
      
      <VStack
        align={isUser ? 'flex-end' : 'flex-start'}
        spacing={1}
        maxW="70%"
      >
        <Box
          bg={isUser ? 'blue.500' : 'gray.100'}
          color={isUser ? 'white' : 'gray.800'}
          px={4}
          py={2}
          rounded="lg"
          roundedTopLeft={isUser ? 'lg' : 'sm'}
          roundedTopRight={isUser ? 'sm' : 'lg'}
        >
          <Text fontSize="sm" whiteSpace="pre-wrap">
            {message.content}
          </Text>
        </Box>
        
        <Text fontSize="xs" color="gray.500">
          {message.timestamp.toLocaleTimeString()}
        </Text>
      </VStack>
      
      {isUser && (
        <Avatar
          size="sm"
          name="User"
          bg="gray.500"
          color="white"
          ml={2}
        />
      )}
    </HStack>
  )
}