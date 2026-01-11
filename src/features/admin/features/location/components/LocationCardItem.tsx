import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Location } from "../types/location.types";

interface LocationCardItemProps {
  location: Location;
  onClick?: () => void;
}

const LocationCardItem: React.FC<LocationCardItemProps> = ({ location, onClick }) => {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:border-primary/50",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">{location.name}</CardTitle>
          <Badge variant={location.status === "active" ? "default" : "secondary"}>
            {location.status === "active" ? "Hoạt động" : "Không hoạt động"}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2 mt-2">
          <MapPin className="h-4 w-4" />
          <span>{location.address}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {location.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {location.description}
          </p>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {location.createdAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Tạo: {new Date(location.createdAt).toLocaleDateString("vi-VN")}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCardItem;