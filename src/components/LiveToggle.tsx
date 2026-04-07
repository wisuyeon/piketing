import { motion } from "framer-motion";

interface LiveToggleProps {
  isActive: boolean;
  onToggle: (value: boolean) => void;
}

export function LiveToggle({ isActive, onToggle }: LiveToggleProps) {
  return (
    <div className="w-full border-b border-[#2C2C2E] bg-[#121212] px-4 py-3">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => onToggle(!isActive)}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2.5">
            <motion.div
              className="flex items-center gap-1.5"
              animate={isActive ? { opacity: 1 } : { opacity: 0.6 }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: isActive ? "#FF4500" : "#8A8A8E",
                  boxShadow: isActive ? "0 0 8px #FF4500" : "none",
                  animation: isActive ? "pulse-dot 1.5s ease-in-out infinite" : "none",
                }}
              />
              <span className="text-[#F0EDE8] font-noto font-semibold text-sm">
                현재 접수 중만 보기
              </span>
            </motion.div>
          </div>

          {/* Toggle pill */}
          <motion.div
            className="relative w-12 h-6 rounded-full cursor-pointer flex-shrink-0"
            style={{
              background: isActive
                ? "linear-gradient(90deg, #FF4500, #FF6030)"
                : "#2C2C2E",
              boxShadow: isActive ? "0 0 12px rgba(255,69,0,0.5)" : "none",
            }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
              animate={{ x: isActive ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.div>
        </button>
      </div>
    </div>
  );
}
