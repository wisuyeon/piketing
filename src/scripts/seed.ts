import { supabase } from '../lib/supabase';
import { events } from '../data/events';

async function seedDatabase() {
  console.log('Seeding database with events...');

  try {
    // 기존 데이터 삭제 (선택사항)
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .neq('id', ''); // 모든 데이터 삭제

    if (deleteError) {
      console.error('Error deleting existing data:', deleteError);
    } else {
      console.log('Existing data deleted');
    }

    // 데이터 삽입
    const { data, error } = await supabase
      .from('events')
      .insert(events.map(event => ({
        title: event.title,
        subtitle: event.subtitle,
        category: event.category,
        status: event.status,
        date: event.date,
        ticket_open_date: event.ticketOpenDate,
        venue: event.venue,
        region: event.region,
        thumbnail: event.thumbnail,
        difficulty: event.difficulty,
        is_pet_friendly: event.isPetFriendly,
        survival_tip: event.survivalTip,
        official_url: event.officialUrl,
        tags: event.tags,
        distance: event.distance,
        entry_method: event.entryMethod,
        team: event.team,
        stadium: event.stadium,
        brand: event.brand,
        genre: event.genre,
        admission_method: event.admissionMethod,
      })))
      .select();

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log(`Successfully inserted ${data?.length} events`);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

seedDatabase();