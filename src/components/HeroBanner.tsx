import { motion } from "framer-motion";
import { events } from "@/data/events";
import { Flame, Clock } from "lucide-react";

export function HeroBanner() {
  const hotEvent = events.find((e) => e.status === "접수중" && e.difficulty === 5) || events[0];

  return (
    <div className="relative w-full overflow-hidden noise-overlay" style={{ background: "#0E0E0F" }}>
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={hotEvent.thumbnail}
          alt="hero"
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0E0E0F 0%, transparent 40%, #121212 100%)" }} />
        {/* Neon red accent line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, #FF4500, transparent)" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10 pb-8">
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-4"
        >
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#FF4500]/40 bg-[#FF4500]/10">
            <span className="w-2 h-2 rounded-full bg-[#FF4500] animate-pulse-dot" />
            <span className="text-[#FF4500] text-xs font-bricolage font-semibold tracking-wider uppercase">
              오늘의 핫 티켓
            </span>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-syne font-black text-[#F0EDE8] leading-none mb-2"
          style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)", letterSpacing: "-0.03em" }}
        >
          피켓팅에서<br />
          <span style={{ color: "#FF4500", textShadow: "0 0 30px rgba(255,69,0,0.5)" }}>살아남기</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[#8A8A8E] font-noto font-light text-sm mb-6 leading-relaxed"
        >
          오늘도 무사히 살아남으셨나요?<br />내일의 피켓팅을 미리 준비하세요.
        </motion.p>

        {/* Hot event preview */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-3 p-3 rounded-xl border border-[#2C2C2E] bg-[#1C1C1E]/80 backdrop-blur-sm"
        >
          <img
            src={hotEvent.thumbnail}
            alt={hotEvent.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[#FF4500] text-[10px] font-bricolage font-bold uppercase tracking-wider">
                🔥 지금 접수중
              </span>
            </div>
            <p className="text-[#F0EDE8] font-noto font-semibold text-sm truncate">{hotEvent.title}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-[#8A8A8E]" />
              <span className="text-[#8A8A8E] text-[11px] font-mono-jb">{hotEvent.date}</span>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: hotEvent.difficulty }).map((_, i) => (
              <Flame key={i} className="w-3.5 h-3.5 text-[#FFD700]" />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
