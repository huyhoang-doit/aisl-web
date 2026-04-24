import { useState } from "react";
import { HeaderBlock } from "../components/HeaderBlock";
import { ActiveLockerCard } from "../components/ActiveLockerCard";
import { ActionGrid } from "../components/ActionGrid";
import { EmptyState } from "../components/EmptyState";

export default function HomePage() {
  const [hasActiveLocker] = useState(true);

  return (
    <div className="p-[24px]">
      <HeaderBlock />
      
      {hasActiveLocker ? (
        <ActiveLockerCard />
      ) : (
        <EmptyState />
      )}

      <ActionGrid />

      {/* Tạm ẩn Sheet đăng nhập theo yêu cầu 
      <LoginSheet 
        isOpen={!isAuthenticated} 
        onLoginSuccess={() => setIsAuthenticated(true)} 
      /> */}
    </div>
  );
}
