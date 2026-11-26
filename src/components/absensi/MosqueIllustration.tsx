"use client";

import * as React from "react";

/**
 * Logo Yayasan Al-Maghfirah
 * Uses the official uploaded logo image (logoooo-cutout.png).
 * Renders the image with object-contain so it keeps aspect ratio and fills
 * whatever container size the parent assigns via className.
 */
export function MosqueLogo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/logo-almaghfirah.png"
      alt="Logo Yayasan Al-Maghfirah"
      className={className}
      style={{ objectFit: "contain" }}
      draggable={false}
    />
  );
}

/**
 * Illustration used in sidebar footer and login branding panel.
 * Uses the official uploaded horizontal logo image (logo-almagfirah-samping.png).
 * The PNG has a proper alpha channel (transparent background), so it blends
 * naturally with the container's gradient background.
 */
export function MosqueIllustration({ className = "" }: { className?: string }) {
  return (
    <img
      src="/mosque-illustration.png"
      alt="Yayasan Al-Maghfirah"
      className={className}
      style={{ objectFit: "contain" }}
      draggable={false}
    />
  );
}
