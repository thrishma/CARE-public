"use client";

import { Box, Text, Badge, VStack, HStack, Heading } from "@chakra-ui/react";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthStatus() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box p={4} borderRadius="md" bg="gray.50">
        <Text>Loading authentication status...</Text>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        p={4}
        borderRadius="md"
        bg="red.50"
        borderColor="red.200"
        border="1px"
      >
        <HStack>
          <Badge colorScheme="red">Not Authenticated</Badge>
          <Text fontSize="sm">Please sign in to continue</Text>
        </HStack>
      </Box>
    );
  }

  return (
    <Box
      p={4}
      borderRadius="md"
      bg="green.50"
      borderColor="green.200"
      border="1px"
    >
      <VStack align="start" spacing={2}>
        <HStack>
          <Badge colorScheme="green">Authenticated</Badge>
          <Text fontSize="sm" fontWeight="medium">
            {user.user_metadata?.full_name || user.email}
          </Text>
        </HStack>
        <Text fontSize="xs" color="gray.600">
          Provider: {user.app_metadata?.provider || "email"}
        </Text>
        <Text fontSize="xs" color="gray.600">
          User ID: {user.id}
        </Text>
      </VStack>
    </Box>
  );
}
