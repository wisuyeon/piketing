import { useState } from "react";
import { NavBar } from "@/components/NavBar";

export default function AdminPage() {
  const [seedStatus, setSeedStatus] = useState<string>("");
  const [scrapeStatus, setScrapeStatus] = useState<string>("");

  const runSeed = async () => {
    setSeedStatus("시딩 중...");
    // 실제로는 서버 API를 호출해야 하지만, 여기서는 터미널 명령어 실행을 안내
    alert("터미널에서 'npm run seed'를 실행하세요.");
    setSeedStatus("터미널에서 'npm run seed'를 실행하세요.");
  };

  const runScrape = async () => {
    setScrapeStatus("크롤링 중...");
    // 실제로는 서버 API를 호출해야 하지만, 여기서는 터미널 명령어 실행을 안내
    alert("터미널에서 'npm run scrape'를 실행하세요.");
    setScrapeStatus("터미널에서 'npm run scrape'를 실행하세요.");
  };

  return (
    <div className="min-h-screen" style={{ background: "#121212" }}>
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">관리자 페이지</h1>

        <div className="space-y-6">
          {/* 데이터베이스 시딩 */}
          <div className="card-glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">데이터베이스 시딩</h2>
            <p className="text-[#8A8A8E] mb-4">
              Mock 데이터를 Supabase에 삽입합니다.
            </p>
            <button
              onClick={runSeed}
              className="px-4 py-2 bg-[#FF4500] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              시딩 실행
            </button>
            {seedStatus && (
              <p className="mt-2 text-sm text-[#FFD700]">{seedStatus}</p>
            )}
          </div>

          {/* 데이터 크롤링 */}
          <div className="card-glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">데이터 크롤링</h2>
            <p className="text-[#8A8A8E] mb-4">
              외부 사이트에서 이벤트 데이터를 크롤링합니다.
            </p>
            <button
              onClick={runScrape}
              className="px-4 py-2 bg-[#FF4500] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              크롤링 실행
            </button>
            {scrapeStatus && (
              <p className="mt-2 text-sm text-[#FFD700]">{scrapeStatus}</p>
            )}
          </div>

          {/* Supabase 상태 */}
          <div className="card-glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Supabase 연결 상태</h2>
            <p className="text-[#8A8A8E]">
              환경 변수가 올바르게 설정되었는지 확인하세요.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}