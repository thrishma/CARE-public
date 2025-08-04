"use client";

import { Container, Text, Button, Box } from "@chakra-ui/react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function WelcomeBanner() {
  const { user, loading } = useAuth();

  // Don't render anything while loading or if user is not authenticated
  if (loading || !user) {
    return null;
  }

  return (
    <Container maxW="7xl" py={4}>
      <Box
        bg="blue.50"
        p={4}
        borderRadius="lg"
        border="1px"
        borderColor="blue.200"
      >
        <Text color="blue.700" fontSize="sm">
          Welcome back, {user.user_metadata?.full_name || user.email}!{" "}
          <Button
            as={Link}
            href="/dashboard"
            size="sm"
            colorScheme="blue"
            variant="link"
          >
            Go to Dashboard
          </Button>
        </Text>
      </Box>
    </Container>
  );
}
