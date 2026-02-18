// src/components/TopBanner.jsx
import React from "react";
import banner from "../assets/StreamList1.png"; // <-- note: inside src/assets

export default function TopBanner() {
  return (
    <div className="top-banner" role="img" aria-label="StreamList Banner">
      <img
        src={banner}
        alt="StreamList"
        className="top-banner__img"
        draggable="false"
      />
    </div>
  );
}