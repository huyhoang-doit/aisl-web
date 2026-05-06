import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Loader2, RefreshCw } from "lucide-react";
import { dispatchApi } from "../features/dispatch/api/dispatch.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

// Fix Leaflet's default icon path issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const customCourierIcon = L.divIcon({
  className: "custom-courier-marker",
  html: `
    <div style="
      background-color: #10B981; 
      width: 32px; 
      height: 32px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 3px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    ">
      🛵
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const DispatchMapPage = () => {
  // Default center point: Ho Chi Minh City
  const adminLat = 10.762622;
  const adminLng = 106.660172;
  const maxDistanceKm = 50;

  const { data: rawData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["dispatch", "couriers", "nearest"],
    queryFn: () => dispatchApi.getNearestCouriers({ latitude: adminLat, longitude: adminLng, maxDistanceKm }),
    refetchInterval: 15000, // Auto-refresh every 15s
  });

  // Extract array of couriers safely
  const couriers = Array.isArray(rawData)
    ? rawData
    : (rawData as any)?.couriers && Array.isArray((rawData as any).couriers)
    ? (rawData as any).couriers
    : [];

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bản Đồ Giám Sát Tài Xế</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Hiển thị các tài xế (Couriers) đang trực tuyến trong bán kính {maxDistanceKm}km. Tự động cập nhật mỗi 15 giây.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => refetch()} 
          disabled={isLoading || isRefetching}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4 flex-1 min-h-[500px]">
        {/* Sidebar Status List */}
        <Card className="col-span-1 h-full overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Danh sách tài xế ({couriers.length})</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0 border-t">
            {isLoading ? (
               <div className="flex h-32 items-center justify-center">
                 <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
               </div>
            ) : couriers.length === 0 ? (
               <div className="p-4 text-center text-sm text-muted-foreground">
                 Không tìm thấy tài xế trực tuyến gần khu vực.
               </div>
            ) : (
               <ul className="divide-y">
                 {couriers.map((c: any) => (
                   <li key={c.courierId} className="p-4 hover:bg-slate-50 transition-colors">
                     <div className="font-medium text-sm">{c.name || c.courierId}</div>
                     <div className="text-xs text-muted-foreground mt-1">
                       Khoảng cách: {typeof c.distanceKm === "number" ? c.distanceKm.toFixed(2) : "0"} km
                     </div>
                     <div className="text-xs text-muted-foreground">
                       Trạng thái: <span className="text-green-600 font-medium">Sẵn sàng</span>
                     </div>
                   </li>
                 ))}
               </ul>
            )}
          </CardContent>
        </Card>

        {/* Map View */}
        <Card className="col-span-3 h-full min-h-[500px] overflow-hidden rounded-xl border relative z-0">
          <MapContainer 
            center={[adminLat, adminLng]} 
            zoom={13} 
            minZoom={5}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Center point marker (Admin / Hub) */}
            <Marker position={[adminLat, adminLng]}>
              <Popup>Vị trí hiện tại (Tâm điểm)</Popup>
            </Marker>

            {/* Couriers */}
            {couriers.map((c: any) => (
              <Marker 
                key={c.courierId} 
                position={[c.latitude, c.longitude]}
                icon={customCourierIcon}
              >
                <Popup>
                  <div className="font-semibold">{c.name || "Courier"}</div>
                  <div className="text-xs text-muted-foreground mt-1">ID: {c.courierId}</div>
                  <div className="text-xs mt-1">Khoảng cách: {typeof c.distanceKm === "number" ? c.distanceKm.toFixed(2) : "0"} km</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Card>
      </div>
    </div>
  );
};

export default DispatchMapPage;
