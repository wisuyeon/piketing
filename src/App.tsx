import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "@/pages/MainPage";
import AdminPage from "@/pages/AdminPage";
import { AppProvider } from "@/context/AppContext";

function App() {
  return (
    <AppProvider>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#121212" }}>
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#FF4500] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#8A8A8E] font-noto text-sm">로딩 중...</p>
          </div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Suspense>
    </AppProvider>
  );
}

export default App;
