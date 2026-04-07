import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function ServerTimeModal() {
  const { serverTimeModalOpen, closeServerTimeModal } = useApp();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (!serverTimeModalOpen) return;
    const interval = setInterval(() => setTime(new Date()), 100);
    return () => clearInterval(interval);
  }, [serverTimeModalOpen]);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const ms = time.getMilliseconds().toString().padStart(3, "0");

  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  const dateStr = `${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(time.getDate())}`;

  return (
    <AnimatePresence>
      {serverTimeModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            onClick={closeServerTimeModal}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-[101] flex items-center justify-center px-4"
          >
            <div
              className="w-full max-w-xs rounded-2xl p-6 text-center relative"
              style={{
                background: "rgba(18,18,18,0.98)",
                border: "1px solid #2C2C2E",
                backdropFilter: "blur(20px)",
                boxShadow: "0 0 40px rgba(255,69,0,0.1), 0 24px 80px rgba(0,0,0,0.7)",
              }}
            >
              <button
                onClick={closeServerTimeModal}
                className="absolute top-4 right-4 w-7 h-7 rounded-full border border-[#2C2C2E] flex items-center justify-center text-[#8A8A8E] hover:text-[#F0EDE8]"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-[#FF4500]" />
                <span className="text-[#8A8A8E] font-bricolage text-xs uppercase tracking-widest">서버 시간</span>
              </div>

              <div
                className="font-mono-jb text-4xl font-bold mb-1"
                style={{ color: "#F0EDE8", letterSpacing: "0.05em" }}
              >
                {timeStr}
                <span className="text-lg text-[#8A8A8E]">.{ms}</span>
              </div>
              <div className="font-mono-jb text-sm text-[#8A8A8E] mb-5">{dateStr}</div>

              <div
                className="p-3 rounded-xl text-left"
                style={{ background: "rgba(255,69,0,0.05)", border: "1px solid rgba(255,69,0,0.15)" }}
              >
                <p className="text-[#8A8A8E] font-noto text-xs leading-relaxed">
                  💡 <span className="text-[#F0EDE8]">time.naver.com</span> 서버 시간을 기준으로 
                  티켓 오픈 30초 전부터 준비하세요. 브라우저 캐시를 미리 비우고 
                  카드 정보를 저장해두면 성공률이 높아집니다.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
