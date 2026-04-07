import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, List, Flame, Heart } from "lucide-react";
import { events } from "@/data/events";
import { useApp } from "@/context/AppContext";

interface PersonalDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PersonalDashboard({ isOpen, onClose }: PersonalDashboardProps) {
  const { bookmarks } = useApp();
  const [view, setView] = useState<"calendar" | "list">("list");

  const bookmarkedEvents = events.filter((e) => bookmarks.includes(e.id));

  // Build calendar data
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // Map event dates
  const redDots: Record<number, boolean> = {};
  const goldDots: Record<number, boolean> = {};
  bookmarkedEvents.forEach((e) => {
    const openDate = new Date(e.ticketOpenDate);
    const eventDate = new Date(e.date);
    if (openDate.getFullYear() === year && openDate.getMonth() === month) {
      redDots[openDate.getDate()] = true;
    }
    if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
      goldDots[eventDate.getDate()] = true;
    }
  });

  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-[91] w-full max-w-sm flex flex-col"
            style={{
              background: "#121212",
              borderLeft: "1px solid #2C2C2E",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#2C2C2E]">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#FF4500]" />
                <h2 className="text-[#F0EDE8] font-syne font-black text-base">나의 생존 리스트</h2>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-mono-jb"
                  style={{ background: "rgba(255,69,0,0.12)", color: "#FF4500" }}
                >
                  {bookmarkedEvents.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-[#2C2C2E] flex items-center justify-center text-[#8A8A8E] hover:text-[#F0EDE8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 p-4">
              <button
                onClick={() => setView("list")}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bricolage font-semibold transition-all"
                style={{
                  background: view === "list" ? "rgba(255,69,0,0.1)" : "#1C1C1E",
                  color: view === "list" ? "#FF4500" : "#8A8A8E",
                  border: view === "list" ? "1px solid rgba(255,69,0,0.3)" : "1px solid #2C2C2E",
                }}
              >
                <List className="w-3.5 h-3.5" /> 리스트
              </button>
              <button
                onClick={() => setView("calendar")}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bricolage font-semibold transition-all"
                style={{
                  background: view === "calendar" ? "rgba(255,69,0,0.1)" : "#1C1C1E",
                  color: view === "calendar" ? "#FF4500" : "#8A8A8E",
                  border: view === "calendar" ? "1px solid rgba(255,69,0,0.3)" : "1px solid #2C2C2E",
                }}
              >
                <Calendar className="w-3.5 h-3.5" /> 캘린더
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-8">
              {bookmarkedEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <div className="text-4xl mb-3">🎫</div>
                  <p className="text-[#8A8A8E] font-noto text-sm">
                    아직 저장된 이벤트가 없어요.<br />❤️ 버튼을 눌러 이벤트를 저장하세요!
                  </p>
                </div>
              ) : view === "list" ? (
                <div className="space-y-3">
                  {bookmarkedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-xl flex items-center gap-3"
                      style={{ background: "#1C1C1E", border: "1px solid #2C2C2E" }}
                    >
                      <img
                        src={event.thumbnail}
                        alt={event.title}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[#F0EDE8] font-noto font-semibold text-sm truncate">{event.title}</p>
                        <p className="text-[#8A8A8E] font-mono-jb text-xs mt-0.5">{event.date}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: event.difficulty }).map((_, i) => (
                            <Flame key={i} className="w-3 h-3 text-[#FFD700]" />
                          ))}
                        </div>
                      </div>
                      <div
                        className="px-2 py-1 rounded-full text-[10px] font-bricolage font-bold flex-shrink-0"
                        style={{
                          background: event.status === "접수중" ? "rgba(255,69,0,0.1)" : event.status === "예정" ? "rgba(255,215,0,0.08)" : "rgba(138,138,142,0.08)",
                          color: event.status === "접수중" ? "#FF4500" : event.status === "예정" ? "#FFD700" : "#8A8A8E",
                          border: `1px solid ${event.status === "접수중" ? "rgba(255,69,0,0.3)" : event.status === "예정" ? "rgba(255,215,0,0.3)" : "rgba(138,138,142,0.2)"}`,
                        }}
                      >
                        {event.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {/* Calendar header */}
                  <div className="text-center mb-4">
                    <p className="text-[#F0EDE8] font-bricolage font-bold text-base">
                      {year}년 {monthNames[month]}
                    </p>
                  </div>

                  {/* Day names */}
                  <div className="grid grid-cols-7 mb-2">
                    {dayNames.map((d) => (
                      <div key={d} className="text-center text-[#8A8A8E] text-xs font-bricolage py-1">{d}</div>
                    ))}
                  </div>

                  {/* Day cells */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const hasRed = redDots[day];
                      const hasGold = goldDots[day];
                      const isToday = today.getDate() === day && today.getMonth() === month;
                      return (
                        <div
                          key={day}
                          className="aspect-square flex flex-col items-center justify-center rounded-lg relative"
                          style={{
                            background: isToday ? "rgba(255,69,0,0.1)" : "transparent",
                            border: isToday ? "1px solid rgba(255,69,0,0.3)" : "1px solid transparent",
                          }}
                        >
                          <span
                            className="text-xs font-mono-jb"
                            style={{ color: isToday ? "#FF4500" : "#F0EDE8" }}
                          >
                            {day}
                          </span>
                          <div className="flex gap-0.5 mt-0.5">
                            {hasRed && (
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#FF4500" }} />
                            )}
                            {hasGold && (
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#FFD700" }} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 mt-4 justify-center">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#FF4500]" />
                      <span className="text-[#8A8A8E] text-xs font-noto">티켓 오픈일</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
                      <span className="text-[#8A8A8E] text-xs font-noto">이벤트 날짜</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
