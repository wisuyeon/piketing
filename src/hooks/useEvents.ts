import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { Event, EventCategory } from "@/data/events";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return; // 이미 fetch했으면 중단
    hasFetched.current = true;

    async function fetchEvents() {
      try {
        console.log("Fetching events from Supabase...");
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        console.log("Fetched data:", data);

        // Supabase snake_case → camelCase 변환
        const mapped: Event[] = (data || []).map((row: any) => ({
          id: row.id,
          title: row.title,
          subtitle: row.subtitle,
          category: row.category as EventCategory,
          status: row.status,
          date: row.date,
          ticketOpenDate: row.ticket_open_date,
          venue: row.venue,
          region: row.region,
          thumbnail: row.thumbnail,
          difficulty: row.difficulty,
          isPetFriendly: row.is_pet_friendly,
          survivalTip: row.survival_tip,
          officialUrl: row.official_url,
          tags: row.tags || [],
          distance: row.distance,
          entryMethod: row.entry_method,
          team: row.team,
          stadium: row.stadium,
          brand: row.brand,
          genre: row.genre,
          admissionMethod: row.admission_method,
        }));

        console.log("Mapped events:", mapped);
        setEvents(mapped);
      } catch (err: any) {
        console.error("Failed to fetch events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return { events, loading, error };
}