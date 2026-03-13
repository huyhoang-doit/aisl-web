import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { KioskScreenLayout } from "../components/KioskScreenLayout";

/** Placeholder: Mở tủ - UI trước, logic sau. */
const KioskOpenPage = () => (
  <KioskScreenLayout>
    <Button asChild variant="ghost" className="self-start min-h-[56px] text-lg">
      <Link to="/kiosk/home" className="flex items-center gap-2">
        <ArrowLeft className="size-6" /> Quay lại
      </Link>
    </Button>
    <div className="flex-1 flex items-center justify-center">
      <p className="text-2xl font-semibold text-muted-foreground">Mở tủ — Trang đang phát triển</p>
    </div>
  </KioskScreenLayout>
);

export default KioskOpenPage;
