import React, { createContext, useContext, useState, useCallback } from "react";

interface User {
  id: string;
  name: string;
  avatar: string;
  provider: "kakao" | "naver";
}

interface AppContextType {
  user: User | null;
  bookmarks: string[];
  isLoginModalOpen: boolean;
  isNudgeModalOpen: boolean;
  serverTimeModalOpen: boolean;
  login: (provider: "kakao" | "naver") => void;
  logout: () => void;
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
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isNudgeModalOpen, setIsNudgeModalOpen] = useState(false);
  const [serverTimeModalOpen, setServerTimeModalOpen] = useState(false);

  const login = useCallback((provider: "kakao" | "naver") => {
    const mockUser: User = {
      id: "user_001",
      name: provider === "kakao" ? "카카오 사용자" : "네이버 사용자",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
      provider,
    };
    setUser(mockUser);
    setIsLoginModalOpen(false);
    setIsNudgeModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setBookmarks([]);
  }, []);

  const toggleBookmark = useCallback((eventId: string) => {
    setBookmarks((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        bookmarks,
        isLoginModalOpen,
        isNudgeModalOpen,
        serverTimeModalOpen,
        login,
        logout,
        toggleBookmark,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        openNudgeModal: () => setIsNudgeModalOpen(true),
        closeNudgeModal: () => setIsNudgeModalOpen(false),
        openServerTimeModal: () => setServerTimeModalOpen(true),
        closeServerTimeModal: () => setServerTimeModalOpen(false),
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
