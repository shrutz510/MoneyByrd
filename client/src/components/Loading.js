// components/Loading.js
import React from "react";

function Loading() {
  return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <div className="loading-text">Loading pets...</div>
    </div>
  );
}

export default Loading;