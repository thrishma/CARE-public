import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Hook que requiere autenticación y redirige al login si no está autenticado
 */
export const useRequireAuth = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  return { user, loading };
};

/**
 * Hook que proporciona el estado de autenticación sin redirigir
 */
export const useAuthState = () => {
  return useAuth();
};

/**
 * Hook que proporciona funciones de autenticación
 */
export const useAuthActions = () => {
  const { signOut, refreshUser } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return {
    signOut: handleSignOut,
    refreshUser,
  };
};
