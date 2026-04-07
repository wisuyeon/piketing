import { Flame, Heart, LogOut } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function NavBar({ bookmarkCount, onDashboardOpen }: { bookmarkCount: number; onDashboardOpen: () => void }) {
  const { user, openLoginModal, logout } = useApp();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#2C2C2E] bg-[#121212]/90 backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Flame className="w-6 h-6 text-[#FF4500]" style={{ filter: "drop-shadow(0 0 6px #FF4500)" }} />
          </div>
          <span
            className="text-[#F0EDE8] font-syne font-black text-lg tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            피켓팅<span className="text-[#FF4500]">LIVE</span>
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Bookmark icon */}
              <button
                onClick={onDashboardOpen}
                className="relative flex items-center justify-center w-9 h-9 rounded-full border border-[#2C2C2E] bg-[#1C1C1E] hover:border-[#FF4500]/50 transition-colors"
              >
                <Heart className="w-4 h-4 text-[#F0EDE8]" />
                {bookmarkCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF4500] text-[#F0EDE8] text-[10px] font-bold flex items-center justify-center font-mono-jb">
                    {bookmarkCount}
                  </span>
                )}
              </button>
              {/* Avatar */}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2C2C2E] bg-[#1C1C1E] hover:border-[#8A8A8E] transition-colors group"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  style={{
                    background: user.provider === "kakao" ? "#FEE500" : "#03C75A",
                    color: user.provider === "kakao" ? "#000" : "#fff",
                    fontWeight: 700,
                    fontSize: 9,
                  }}
                >
                  {user.provider === "kakao" ? "K" : "N"}
                </div>
                <span className="text-[#8A8A8E] text-xs font-noto group-hover:text-[#F0EDE8] transition-colors hidden sm:block">
                  {user.name.slice(0, 4)}
                </span>
                <LogOut className="w-3 h-3 text-[#8A8A8E] group-hover:text-[#F0EDE8] transition-colors" />
              </button>
            </>
          ) : (
            <button
              onClick={openLoginModal}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF4500] hover:bg-[#FF5520] text-white text-sm font-bricolage font-semibold transition-colors"
              style={{ boxShadow: "0 0 12px rgba(255,69,0,0.4)" }}
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
