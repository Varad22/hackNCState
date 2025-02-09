"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "@/lib/markerIcon"; // ✅ Import custom marker

export default function MapView({ destination }) {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }, []);

  return (
    <div className="w-full h-96">
      <MapContainer center={[destination.latitude, destination.longitude]} zoom={14} className="w-full h-full">
        {/* OpenStreetMap Tile Layer */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={markerIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        <Marker position={[destination.latitude, destination.longitude]} icon={markerIcon}>
          <Popup>Destination</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
