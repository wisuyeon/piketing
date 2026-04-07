import axios from 'axios';
import * as cheerio from 'cheerio';
import { supabase } from '../lib/supabase';
import type { EventCategory } from '../data/events';

interface ScrapedEvent {
  title: string;
  subtitle: string;
  category: EventCategory;
  status: '접수중' | '예정' | '마감';
  date: string;
  ticketOpenDate: string;
  venue: string;
  region: string;
  thumbnail: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  isPetFriendly: boolean;
  survivalTip: string;
  officialUrl: string;
  tags: string[];
}

// 예시 크롤링 함수 (실제로는 사이트별로 수정 필요)
async function scrapeEvents(): Promise<ScrapedEvent[]> {
  const events: ScrapedEvent[] = [];

  try {
    // 실제 크롤링 대신 예시 데이터 생성 (실제 크롤링으로 교체 가능)
    console.log('Generating sample event data...');

    const sampleEvents = [
      {
        title: "BTS 콘서트 2025",
        subtitle: "BTS 월드 투어 서울 공연",
        category: "스포츠" as const,
        status: "접수중" as const,
        date: "2025-06-15",
        ticketOpenDate: "2025-03-01",
        venue: "올림픽 체조경기장",
        region: "서울",
        thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        difficulty: 5,
        isPetFriendly: false,
        survivalTip: "🎫 티켓팅 시작 30분 전부터 준비! 서버시간 기준으로 동기화하세요.",
        officialUrl: "https://ticket.interpark.com/bts",
        tags: ["BTS", "콘서트", "K-pop"],
      },
      {
        title: "서울 마라톤 2025",
        subtitle: "국제 마라톤 대회",
        category: "마라톤/액티비티" as const,
        status: "예정" as const,
        date: "2025-04-20",
        ticketOpenDate: "2025-02-15",
        venue: "여의도",
        region: "서울",
        thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        difficulty: 4,
        isPetFriendly: true,
        survivalTip: "🏃‍♂️ 체력 단련 필수! 날씨 확인하고 충분한 수분 섭취하세요.",
        officialUrl: "https://seoulmarathon.com",
        tags: ["마라톤", "스포츠", "건강"],
      },
      {
        title: "고양이 박람회",
        subtitle: "캣 쇼 & 애완용품 전시회",
        category: "뷰티/팝업" as const,
        status: "접수중" as const,
        date: "2025-05-10",
        ticketOpenDate: "2025-04-01",
        venue: "코엑스",
        region: "서울",
        thumbnail: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
        difficulty: 2,
        isPetFriendly: true,
        survivalTip: "🐱 반려묘 동반 가능! 사전 건강검진 확인하세요.",
        officialUrl: "https://catshow.co.kr",
        tags: ["고양이", "반려동물", "전시회"],
      }
    ];

    events.push(...sampleEvents);
    console.log(`Generated ${events.length} sample events`);

    // 실제 크롤링 코드 (주석 처리 - 법적 문제로 실제 사용 권장하지 않음)
    /*
    const { data } = await axios.get('https://ticket.interpark.com/');
    const $ = cheerio.load(data);

    $('.event-card, .ticket-item, [class*="event"]').each((index, element) => {
      const title = $(element).find('h3, .title, [class*="title"]').first().text().trim();
      const venue = $(element).find('.venue, .place, [class*="venue"]').first().text().trim();
      const date = $(element).find('.date, .time, [class*="date"]').first().text().trim();

      if (title && venue) {
        events.push({
          title,
          subtitle: `${venue} 이벤트`,
          category: "스포츠",
          status: "접수중",
          date: date || "2025-01-01",
          ticketOpenDate: new Date().toISOString().split('T')[0],
          venue,
          region: "서울",
          thumbnail: "https://via.placeholder.com/400x200",
          difficulty: 3,
          isPetFriendly: false,
          survivalTip: "빠른 예매가 중요합니다.",
          officialUrl: $(element).find('a').attr('href') || '',
          tags: ["크롤링"],
        });
      }
    });
    */

  } catch (error) {
    console.error('Scraping error:', error);
  }

  return events;
}

async function saveToSupabase(events: ScrapedEvent[]) {
  try {
    // 기존 데이터 삭제
    console.log('Deleting existing events...');
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .neq('id', ''); // 모든 데이터 삭제

    if (deleteError) {
      console.error('Error deleting existing data:', deleteError);
    } else {
      console.log('Existing data deleted');
    }

    // 새 데이터 삽입
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
      })))
      .select();

    if (error) {
      console.error('Error saving to Supabase:', error);
    } else {
      console.log(`Successfully saved ${data?.length} events to Supabase`);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

async function main() {
  console.log('Starting event scraping...');

  const scrapedEvents = await scrapeEvents();

  if (scrapedEvents.length > 0) {
    await saveToSupabase(scrapedEvents);
  } else {
    console.log('No events scraped');
  }
}

main();