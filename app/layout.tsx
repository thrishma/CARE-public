import {
  ChakraProvider,
  Box,
  Flex,
  Container,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { AuthProvider } from "@/contexts/AuthContext";
import UserProfile from "@/components/auth/UserProfile";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CARE - Composable Architecture Recommendation Engine",
  description: "AI-powered MACH architecture recommendations for e-commerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <AuthProvider>
            <Box minH="100vh" bg="gray.50">
              <Box
                bg="white"
                boxShadow="sm"
                borderBottom="1px"
                borderColor="gray.200"
              >
                <Container maxW="7xl" py={4}>
                  <Flex justify="space-between" align="center">
                    <Link href="/" passHref>
                      <Heading
                        size="md"
                        color="blue.600"
                        cursor="pointer"
                        _hover={{ color: "blue.700" }}
                      >
                        CARE
                      </Heading>
                    </Link>
                    <UserProfile />
                  </Flex>
                </Container>
              </Box>
              <Box as="main">{children}</Box>
            </Box>
          </AuthProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
