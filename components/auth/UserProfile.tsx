"use client";

import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    // Force page reload to ensure all state is cleared
    window.location.href = "/";
  };

  if (loading) {
    return <Spinner size="sm" />;
  }

  if (!user) {
    return (
      <Button
        onClick={() => router.push("/auth/login")}
        colorScheme="blue"
        variant="outline"
        size="sm"
      >
        Sign In
      </Button>
    );
  }

  return (
    <Menu>
      <MenuButton as={Button} variant="ghost" p={2}>
        <HStack spacing={2}>
          <Avatar
            size="sm"
            src={user.user_metadata?.avatar_url}
            name={user.user_metadata?.full_name || user.email}
          />
          <Text fontSize="sm" fontWeight="medium">
            {user.user_metadata?.full_name || user.email}
          </Text>
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
      </MenuList>
    </Menu>
  );
}
