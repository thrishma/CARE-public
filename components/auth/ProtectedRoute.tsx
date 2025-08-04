"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Box, Spinner, VStack } from "@chakra-ui/react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  fallback,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      fallback || (
        <VStack spacing={4} justify="center" align="center" minH="50vh">
          <Spinner size="xl" />
        </VStack>
      )
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
