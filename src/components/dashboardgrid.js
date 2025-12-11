"use client";

import React from "react";

export default function DashboardGrid({ 
  children, 
  columns = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  gap = "gap-8",
  fullWidth = false,
  className = ""
}) {
  return (
    <div className={`${fullWidth ? "col-span-full" : ""} ${className}`}>
      <div className={`grid ${columns} ${gap}`}>
        {children}
      </div>
    </div>
  );
}
