import {
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Box,
} from "@chakra-ui/react";
import Link from "next/link";

export default function AuthCodeError() {
  return (
    <Container maxW="md" py={12}>
      <VStack spacing={8}>
        <Box textAlign="center">
          <Heading size="lg" mb={4} color="red.500">
            Authentication Error
          </Heading>
          <Text color="gray.600" mb={6}>
            Sorry, we couldn&apos;t sign you in. There was an error with the
            authentication process.
          </Text>
          <Button as={Link} href="/auth/login" colorScheme="blue">
            Try Again
          </Button>
        </Box>
      </VStack>
    </Container>
  );
}
