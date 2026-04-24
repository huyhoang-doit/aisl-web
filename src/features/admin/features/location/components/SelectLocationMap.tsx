import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";

// Fix icon default (Leaflet không load icon mặc định nếu không config)
import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});

interface SelectLocationMapProps {
  latitude?: number;
  longitude?: number;
  onChange: (lat: number, lng: number) => void;
}

function LocationSelector({
  onChange,
}: {
  onChange: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      onChange(lat, lng);
    },
  });

  return position ? <Marker position={position} icon={defaultIcon} /> : null;
}

const SelectLocationMap = ({
  latitude = 10.762622,
  longitude = 106.660172,
  onChange,
}: SelectLocationMapProps) => {
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: latitude,
    lng: longitude,
  });

  useEffect(() => {
    setPosition({ lat: latitude, lng: longitude });
  }, [latitude, longitude]);

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-2">
        Chọn vị trí trên bản đồ để lấy kinh độ và vĩ độ
      </p>
      <MapContainer
        center={[10.776, 106.7]} // trung tâm HCM
        zoom={12}
        maxBounds={[
          [10.34, 106.34], // góc Tây Nam
          [11.22, 107.1], // góc Đông Bắc
        ]}
        maxBoundsViscosity={1.0} // giữ map trong bounds
        scrollWheelZoom
        style={{ height: "300px", width: "100%", borderRadius: "8px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />
        <LocationSelector
          onChange={(lat, lng) => {
            setPosition({ lat, lng });
            onChange(lat, lng);
          }}
        />
        <Marker position={position} icon={defaultIcon} />
      </MapContainer>

      <div className="mt-2 text-xs text-muted-foreground">
        <span>
          Vĩ độ: {position.lat.toFixed(6)} | Kinh độ: {position.lng.toFixed(6)}
        </span>
      </div>
    </div>
  );
};

export default SelectLocationMap;
