import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EventCategory, categoryEmoji } from "@/data/events";

const categories: EventCategory[] = ["마라톤/액티비티", "스포츠", "뷰티/팝업", "전시/박람회"];

interface CategoryTabsProps {
  active: EventCategory;
  onChange: (cat: EventCategory) => void;
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="sticky top-14 z-40 w-full bg-[#121212] border-b border-[#2C2C2E]">
      <div
        ref={scrollRef}
        className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide max-w-2xl mx-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((cat) => {
          const isActive = cat === active;
          return (
            <motion.button
              key={cat}
              onClick={() => onChange(cat)}
              className="relative flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bricolage font-semibold transition-colors"
              style={{
                background: isActive ? "rgba(255, 69, 0, 0.12)" : "#1C1C1E",
                color: isActive ? "#FF4500" : "#8A8A8E",
                border: isActive ? "1px solid rgba(255,69,0,0.4)" : "1px solid #2C2C2E",
                boxShadow: isActive ? "0 0 12px rgba(255,69,0,0.2)" : "none",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{categoryEmoji[cat]}</span>
              <span className="font-noto">{cat}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full"
                  style={{ background: "rgba(255,69,0,0.06)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

interface FilterBarProps {
  category: EventCategory;
  selectedFilters: Record<string, string[]>;
  petFriendlyOnly: boolean;
  onFilterChange: (key: string, value: string) => void;
  onPetToggle: () => void;
}

export function FilterBar({ category, selectedFilters, petFriendlyOnly, onFilterChange, onPetToggle }: FilterBarProps) {
  const filterDefs = {
    "마라톤/액티비티": [
      { label: "거리", key: "distance", options: ["5km", "10km", "하프", "풀코스"] },
      { label: "지역", key: "region", options: ["서울", "경기", "인천", "강원", "부산"] },
      { label: "참가방식", key: "entryMethod", options: ["선착순", "추첨"] },
    ],
    "스포츠": [
      { label: "팀", key: "team", options: ["LG 트윈스", "두산 베어스", "SSG 랜더스", "기아 타이거즈", "서울 FC"] },
      { label: "지역", key: "region", options: ["서울", "인천", "수원", "부산", "광주"] },
    ],
    "뷰티/팝업": [
      { label: "지역", key: "region", options: ["서울", "경기", "부산"] },
      { label: "브랜드", key: "brand", options: ["HERA", "라네즈", "딥티크", "아모레퍼시픽"] },
    ],
    "전시/박람회": [
      { label: "지역", key: "region", options: ["서울", "경기", "부산"] },
      { label: "장르", key: "genre", options: ["현대미술", "사진", "건축", "디지털/기술"] },
      { label: "입장방식", key: "admissionMethod", options: ["사전예약", "사전등록", "자유관람"] },
    ],
  };

  const filters = filterDefs[category];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={category}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="w-full bg-[#121212] border-b border-[#2C2C2E] px-4 py-3"
      >
        <div className="max-w-2xl mx-auto space-y-2">
          {filters.map((row, idx) => (
            <motion.div
              key={row.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex gap-2 overflow-x-auto"
              style={{ scrollbarWidth: "none" }}
            >
              <span className="flex-shrink-0 text-[#8A8A8E] text-xs font-noto py-1.5 self-center min-w-[40px]">
                {row.label}
              </span>
              <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {row.options.map((opt) => {
                  const isSelected = (selectedFilters[row.key] || []).includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => onFilterChange(row.key, opt)}
                      className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-noto font-medium transition-all"
                      style={{
                        background: isSelected ? "rgba(255,215,0,0.08)" : "#1C1C1E",
                        color: isSelected ? "#FFD700" : "#8A8A8E",
                        border: isSelected ? "1px solid rgba(255,215,0,0.5)" : "1px solid #2C2C2E",
                        boxShadow: isSelected ? "0 0 8px rgba(255,215,0,0.15)" : "none",
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {/* Pet friendly toggle for 뷰티/팝업 */}
          {category === "뷰티/팝업" && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: filters.length * 0.05 }}
              className="flex items-center gap-2"
            >
              <span className="text-[#8A8A8E] text-xs font-noto min-w-[40px]">반려동물</span>
              <button
                onClick={onPetToggle}
                className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-noto font-medium transition-all"
                style={{
                  background: petFriendlyOnly ? "rgba(255,215,0,0.08)" : "#1C1C1E",
                  color: petFriendlyOnly ? "#FFD700" : "#8A8A8E",
                  border: petFriendlyOnly ? "1px solid rgba(255,215,0,0.5)" : "1px solid #2C2C2E",
                }}
              >
                🐾 반려동물 동반 가능만 보기
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
