"use client";

import { useMemo } from "react";

interface GoogleStaticMapProps {
  latitude: number;
  longitude: number;
  width?: number;
  height?: number;
  zoom?: number;
  className?: string;
}

const GOOGLE_MAPS_API_KEY = "AIzaSyCdlSGLxIHphwSa8T2M_p4hZk5473_Luug";

// Debug log for API key
if (typeof window !== "undefined") {
  console.log(
    "[GoogleStaticMap] Maps API Key:",
    GOOGLE_MAPS_API_KEY
      ? `${GOOGLE_MAPS_API_KEY.substring(0, 10)}...`
      : "NOT SET"
  );
}

export function GoogleStaticMap({
  latitude,
  longitude,
  width = 600,
  height = 300,
  zoom = 15,
  className = "",
}: GoogleStaticMapProps) {
  const mapUrl = useMemo(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error("[GoogleStaticMap] Maps API Key is not configured");
      return "";
    }

    console.log("GOOGLE_MAPS_API_KEY:", GOOGLE_MAPS_API_KEY);

    const baseUrl = "https://maps.googleapis.com/maps/api/staticmap";
    const params = new URLSearchParams({
      center: `${latitude},${longitude}`,
      zoom: zoom.toString(),
      size: `${width}x${height}`,
      markers: `color:red|${latitude},${longitude}`,
      key: GOOGLE_MAPS_API_KEY,
      scale: "2", // Para mejor calidad en pantallas retina
    });

    return `${baseUrl}?${params.toString()}`;
  }, [latitude, longitude, width, height, zoom]);

  if (!mapUrl) {
    return (
      <div
        className={className}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg border text-sm text-muted-foreground">
          Error: Maps API Key no configurada
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mapUrl}
        alt="Mapa de ubicación"
        className="w-full h-full object-cover rounded-lg border"
        loading="lazy"
      />
    </div>
  );
}
