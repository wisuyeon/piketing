import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Flame, ChevronDown, ExternalLink, Clock, MapPin } from "lucide-react";
import { Event } from "@/data/events";
import { useApp } from "@/context/AppContext";

interface EventCardProps {
  event: Event;
  index: number;
}

const statusConfig = {
  "접수중": {
    label: "접수중",
    color: "#FF4500",
    bg: "rgba(255,69,0,0.1)",
    border: "rgba(255,69,0,0.3)",
    pulse: true,
  },
  "예정": {
    label: "예정",
    color: "#FFD700",
    bg: "rgba(255,215,0,0.08)",
    border: "rgba(255,215,0,0.3)",
    pulse: false,
  },
  "마감": {
    label: "마감",
    color: "#8A8A8E",
    bg: "rgba(138,138,142,0.08)",
    border: "rgba(138,138,142,0.2)",
    pulse: false,
  },
};

export const EventCard = forwardRef<HTMLDivElement, EventCardProps>(({ event, index }, ref) => {
  const { user, bookmarks, toggleBookmark, openNudgeModal, openServerTimeModal } = useApp();
  const [tipOpen, setTipOpen] = useState(false);
  const [heartBounce, setHeartBounce] = useState(false);

  const isBookmarked = bookmarks.includes(event.id);
  const status = statusConfig[event.status];

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      openNudgeModal();
      return;
    }
    toggleBookmark(event.id);
    setHeartBounce(true);
    setTimeout(() => setHeartBounce(false), 400);
  };

  const handleCardClick = () => {
    setTipOpen((prev) => !prev);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.2) }}
      className={`card-glass rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 ${event.status === "마감" ? "opacity-60" : ""}`}
      onClick={handleCardClick}
    >
      {/* Card header with image */}
      <div className="relative">
        <div className="relative h-40 overflow-hidden">
          <img
            src={event.thumbnail}
            alt={event.title}
            className="w-full h-full object-cover"
            style={{ filter: event.status === "마감" ? "grayscale(80%)" : "none" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(28,28,30,0.95) 100%)" }} />
        </div>

        {/* Overlaid content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
          {/* Status badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bricolage font-bold"
            style={{
              background: status.bg,
              border: `1px solid ${status.border}`,
              color: status.color,
            }}
          >
            {status.pulse && (
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
                style={{ background: status.color }}
              />
            )}
            {status.label}
          </div>

          {/* Badges row */}
          <div className="flex items-center gap-2">
            {event.isPetFriendly && (
              <span className="text-sm" title="반려동물 동반 가능">🐾</span>
            )}
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-[#F0EDE8] font-noto font-bold text-base leading-snug mb-1 truncate">
              {event.title}
            </h3>
            <p className="text-[#8A8A8E] font-noto text-xs leading-snug mb-3 line-clamp-1">
              {event.subtitle}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#8A8A8E]" />
                <span className="text-[#8A8A8E] text-xs font-mono-jb">{event.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#8A8A8E]" />
                <span className="text-[#8A8A8E] text-xs font-noto truncate max-w-[120px]">{event.venue}</span>
              </div>
            </div>
          </div>

          {/* Right side: flames + heart */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {/* Heart/bookmark */}
            <motion.button
              onClick={handleBookmark}
              className="w-8 h-8 rounded-full border border-[#2C2C2E] bg-[#121212] flex items-center justify-center transition-colors hover:border-[#FF4500]/50"
              animate={heartBounce ? { scale: [1, 1.4, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className="w-4 h-4 transition-colors"
                style={{
                  color: isBookmarked ? "#FF4500" : "#8A8A8E",
                  fill: isBookmarked ? "#FF4500" : "none",
                }}
              />
            </motion.button>

            {/* Difficulty flames */}
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Flame
                  key={i}
                  className="w-3.5 h-3.5 transition-colors"
                  style={{
                    color: i < event.difficulty ? "#FFD700" : "#2C2C2E",
                    filter: i < event.difficulty ? "drop-shadow(0 0 3px rgba(255,215,0,0.5))" : "none",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Ticket open date */}
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-[10px] font-bricolage text-[#8A8A8E] uppercase tracking-wider">티켓 오픈</span>
          <span
            className="text-[11px] font-mono-jb px-2 py-0.5 rounded"
            style={{
              color: event.status === "접수중" ? "#FF4500" : "#FFD700",
              background: event.status === "접수중" ? "rgba(255,69,0,0.1)" : "rgba(255,215,0,0.08)",
            }}
          >
            {event.ticketOpenDate}
          </span>
        </div>

        {/* Survival tip expand indicator */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2C2C2E]">
          <span className="text-[11px] font-bricolage text-[#8A8A8E] uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3 h-3 text-[#FFD700]" />
            생존 팁
          </span>
          <ChevronDown
            className="w-4 h-4 text-[#8A8A8E] transition-transform duration-200"
            style={{ transform: tipOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </div>

        {/* Survival tip drawer */}
        <AnimatePresence>
          {tipOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div
                className="mt-2 p-3 rounded-xl text-sm font-noto leading-relaxed"
                style={{
                  background: "rgba(255,215,0,0.05)",
                  border: "1px solid rgba(255,215,0,0.2)",
                  color: "#FFD700",
                }}
              >
                {event.survivalTip}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Buttons */}
        <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
          <a
            href={event.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bricolage font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{
              background: event.status === "마감" ? "#2C2C2E" : "linear-gradient(135deg, #FF4500, #FF6030)",
              boxShadow: event.status === "마감" ? "none" : "0 0 16px rgba(255,69,0,0.3)",
              cursor: event.status === "마감" ? "not-allowed" : "pointer",
              color: event.status === "마감" ? "#8A8A8E" : "white",
            }}
            onClick={(e) => event.status === "마감" && e.preventDefault()}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            공식 예매하기
          </a>
          <button
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-mono-jb font-medium transition-all hover:border-[#F0EDE8]/30 active:scale-95"
            style={{
              border: "1px solid #2C2C2E",
              color: "#8A8A8E",
              background: "transparent",
            }}
            onClick={openServerTimeModal}
          >
            <Clock className="w-3.5 h-3.5" />
            서버시간
          </button>
        </div>
      </div>
    </motion.div>
  );
});
