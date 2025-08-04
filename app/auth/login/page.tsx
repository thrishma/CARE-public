"use client";

import { createClient } from "@/utils/supabase/client";
import { getAuthCallbackUrl } from "@/utils/url";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getAuthCallbackUrl(),
        },
      });

      if (error) {
        console.error("Error signing in:", error.message);
        alert("Error signing in: " + error.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="md" py={12}>
      <VStack spacing={8}>
        <Box textAlign="center">
          <Heading size="lg" mb={4}>
            Welcome to CARE
          </Heading>
          <Text color="gray.600">Sign in to your account to continue</Text>
        </Box>

        <Box
          w="full"
          bg="white"
          p={8}
          borderRadius="lg"
          boxShadow="md"
          border="1px"
          borderColor="gray.200"
        >
          <VStack spacing={4}>
            <Button
              leftIcon={<Icon as={FaGoogle} />}
              onClick={handleGoogleSignIn}
              isLoading={loading}
              loadingText="Signing in..."
              colorScheme="blue"
              variant="outline"
              w="full"
              size="lg"
            >
              Sign in with Google
            </Button>

            <Text fontSize="sm" color="gray.500" textAlign="center">
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
