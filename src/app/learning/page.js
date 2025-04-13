"use client";
import React, { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    localStorage.setItem("myname", "Arushi Singhal");
  }, []);
  return <div>Learning</div>;
}
