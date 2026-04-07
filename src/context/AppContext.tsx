import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AppContextType {
  user: User | null;
  loading: boolean;
  bookmarks: string[];
  isLoginModalOpen: boolean;
  isNudgeModalOpen: boolean;
  serverTimeModalOpen: boolean;
  loginWithOAuth: (provider: "kakao" | "naver") => Promise<void>;
  logout: () => Promise<void>;
  toggleBookmark: (eventId: string) => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openNudgeModal: () => void;
  closeNudgeModal: () => void;
  openServerTimeModal: () => void;
  closeServerTimeModal: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isNudgeModalOpen, setIsNudgeModalOpen] = useState(false);
  const [serverTimeModalOpen, setServerTimeModalOpen] = useState(false);

  // Supabase Auth 상태 초기화
  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
          avatar: session.user.user_metadata?.avatar_url,
        });
      }
      setLoading(false);
    };

    getInitialSession();

    // Auth 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name,
            avatar: session.user.user_metadata?.avatar_url,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loginWithOAuth = useCallback(async (provider: "kakao" | "naver") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      throw error;
    }

    setIsLoginModalOpen(false);
    setIsNudgeModalOpen(false);
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setBookmarks([]);
  }, []);

  const toggleBookmark = useCallback((eventId: string) => {
    if (!user) {
      openNudgeModal();
      return;
    }
    setBookmarks((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  }, [user]);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);
  const openNudgeModal = useCallback(() => setIsNudgeModalOpen(true), []);
  const closeNudgeModal = useCallback(() => setIsNudgeModalOpen(false), []);
  const openServerTimeModal = useCallback(() => setServerTimeModalOpen(true), []);
  const closeServerTimeModal = useCallback(() => setServerTimeModalOpen(false), []);

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        bookmarks,
        isLoginModalOpen,
        isNudgeModalOpen,
        serverTimeModalOpen,
        loginWithOAuth,
        logout,
        toggleBookmark,
        openLoginModal,
        closeLoginModal,
        openNudgeModal,
        closeNudgeModal,
        openServerTimeModal,
        closeServerTimeModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
