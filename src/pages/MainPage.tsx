import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { HeroBanner } from "@/components/HeroBanner";
import { LiveToggle } from "@/components/LiveToggle";
import { CategoryTabs, FilterBar } from "@/components/CategoryTabs";
import { EventCard } from "@/components/EventCard";
import { LoginModal, NudgeModal } from "@/components/Modals";
import { ServerTimeModal } from "@/components/ServerTimeModal";
import { PersonalDashboard } from "@/components/PersonalDashboard";
import { events, EventCategory } from "@/data/events";
import { useApp } from "@/context/AppContext";

export default function MainPage() {
  const { bookmarks } = useApp();
  const [liveOnly, setLiveOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState<EventCategory>("마라톤/액티비티");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[key] || [];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const handleCategoryChange = (cat: EventCategory) => {
    setActiveCategory(cat);
    setSelectedFilters({});
    setPetFriendlyOnly(false);
  };

  const filteredEvents = useMemo(() => {
    let result = events.filter((e) => e.category === activeCategory);

    // Live-only filter
    if (liveOnly) {
      result = result.filter((e) => e.status === "접수중");
    }

    // Pet filter
    if (petFriendlyOnly) {
      result = result.filter((e) => e.isPetFriendly);
    }

    // Dynamic filters
    const filterKeys = Object.keys(selectedFilters).filter((k) => selectedFilters[k].length > 0);
    filterKeys.forEach((key) => {
      const values = selectedFilters[key];
      result = result.filter((e) => {
        const eventValue = (e as unknown as Record<string, unknown>)[key] as string | undefined;
        if (!eventValue) return false;
        return values.some((v) => eventValue.toLowerCase().includes(v.toLowerCase()));
      });
    });

    return result;
  }, [activeCategory, liveOnly, petFriendlyOnly, selectedFilters]);

  return (
    <div
      className="min-h-screen"
      style={{ background: "#121212" }}
    >
      <NavBar
        bookmarkCount={bookmarks.length}
        onDashboardOpen={() => setDashboardOpen(true)}
      />

      <HeroBanner />

      <LiveToggle isActive={liveOnly} onToggle={setLiveOnly} />

      <CategoryTabs active={activeCategory} onChange={handleCategoryChange} />

      <FilterBar
        category={activeCategory}
        selectedFilters={selectedFilters}
        petFriendlyOnly={petFriendlyOnly}
        onFilterChange={handleFilterChange}
        onPetToggle={() => setPetFriendlyOnly((v) => !v)}
      />

      {/* Event card list */}
      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-[#8A8A8E] font-noto text-base">
                조건에 맞는 이벤트가 없습니다
              </p>
              <p className="text-[#8A8A8E] font-noto text-sm mt-1">
                필터를 조정해보세요
              </p>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto px-4 py-8 text-center border-t border-[#2C2C2E] mt-8">
        <p className="text-[#8A8A8E] font-noto text-xs">
          피켓팅LIVE · 티켓팅 생존 가이드<br />
          <span className="text-[#FF4500]">오늘도 무사히 살아남으세요 🔥</span>
        </p>
      </footer>

      {/* Modals & overlays */}
      <LoginModal />
      <NudgeModal />
      <ServerTimeModal />
      <PersonalDashboard isOpen={dashboardOpen} onClose={() => setDashboardOpen(false)} />
    </div>
  );
}
