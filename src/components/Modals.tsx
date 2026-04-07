import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/context/AppContext";

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, loginWithOAuth } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOAuthLogin = async (provider: "kakao" | "naver") => {
    setLoading(true);
    setError("");

    try {
      await loginWithOAuth(provider);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            onClick={() => {
              closeLoginModal();
              resetForm();
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-[101] flex items-center justify-center px-4"
          >
            <div
              className="w-full max-w-sm rounded-2xl p-6 relative"
              style={{
                background: "rgba(28,28,30,0.95)",
                border: "1px solid #2C2C2E",
                backdropFilter: "blur(20px)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
              }}
            >
              {/* Close button */}
              <button
                onClick={closeLoginModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[#2C2C2E] flex items-center justify-center text-[#8A8A8E] hover:text-[#F0EDE8] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="text-3xl mb-3">🔥</div>
                <h2 className="text-[#F0EDE8] font-syne font-black text-xl mb-2">
                  피켓팅 생존 전략가
                </h2>
                <p className="text-[#8A8A8E] font-noto text-sm leading-relaxed">
                  소셜 로그인을 통해<br />나만의 생존 리스트를 관리하세요
                </p>
              </div>

              {/* OAuth Buttons */}
              <div className="space-y-4">
                {error && (
                  <div className="text-[#FF4500] text-sm text-center">
                    {error}
                  </div>
                )}

                <button
                  onClick={() => handleOAuthLogin('kakao')}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#FEE500] text-black font-noto font-semibold text-sm transition-all hover:opacity-90 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 5.52 2 9.32c0 2.48 1.68 4.68 4.32 6.04-.08.32-.24.88-.52 1.52-.4.88-.92 1.6-.92 1.6s.32.08.8.04c.48-.04.88-.12 1.2-.2.48-.12 1.04-.28 1.68-.52.88-.32 1.84-.76 2.72-1.24C15.6 16.8 18.4 15.6 20 13.6c1.6-2 2.4-4.32 2.4-6.28C22 5.52 17.52 2 12 2z"/>
                  </svg>
                  카카오로 로그인
                </button>

                <button
                  onClick={() => handleOAuthLogin('naver')}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#03C75A] text-white font-noto font-semibold text-sm transition-all hover:opacity-90 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.273 12.845L7.376 0H0v24h7.726V11.155L16.624 24H24V12.845z"/>
                  </svg>
                  네이버로 로그인
                </button>
              </div>

              <p className="text-center text-[#8A8A8E] text-[11px] font-noto mt-6">
                로그인 시 서비스 이용약관에 동의하게 됩니다
              </p>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function NudgeModal() {
  const { isNudgeModalOpen, closeNudgeModal, openLoginModal } = useApp();

  return (
    <AnimatePresence>
      {isNudgeModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={closeNudgeModal}
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[101] flex justify-center"
          >
            <div
              className="w-full max-w-2xl rounded-t-2xl p-6 pb-8"
              style={{
                background: "rgba(28,28,30,0.98)",
                border: "1px solid #2C2C2E",
                borderBottom: "none",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="w-12 h-1 rounded-full bg-[#2C2C2E] mx-auto mb-4" />
              <div className="text-center">
                <div className="text-3xl mb-2">❤️</div>
                <h3 className="text-[#F0EDE8] font-syne font-black text-lg mb-1">
                  생존 리스트에 추가하려면?
                </h3>
                <p className="text-[#8A8A8E] font-noto text-sm mb-5">
                  로그인하고 놓치기 아까운 이벤트를<br />저장하세요
                </p>
                <button
                  onClick={() => { closeNudgeModal(); openLoginModal(); }}
                  className="w-full py-3.5 rounded-xl font-noto font-semibold text-white text-sm"
                  style={{
                    background: "linear-gradient(135deg, #FF4500, #FF6030)",
                    boxShadow: "0 0 20px rgba(255,69,0,0.4)",
                  }}
                >
                  지금 로그인하기
                </button>
                <button
                  onClick={closeNudgeModal}
                  className="w-full py-3 text-[#8A8A8E] font-noto text-sm mt-2"
                >
                  나중에 할게요
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
