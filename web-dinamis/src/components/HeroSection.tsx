"use client";

import { useEffect, useRef } from "react";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("hero--visible");
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="hero" className="hero" ref={sectionRef}>
      <div className="floating-accent" style={{ top: "20%", left: "10%" }} />
      <div className="floating-accent floating-accent--alt" style={{ bottom: "10%", right: "15%" }} />

      <span className="hero-tagline">Pelayanan Medis Profesional & Terpercaya</span>
      <h1 className="hero-title">
        RSU MORIN MEDIKA
        <br />
        <span className="hero-title--gradient">KESEMBUHAN ANDA PRIORITAS KAMI</span>
      </h1>
      <p className="hero-description">
        Kami siap melayani kebutuhan kesehatan Anda dan keluarga dengan didukung oleh dokter spesialis berpengalaman, peralatan medis modern, dan fasilitas prima 24 jam.
      </p>
      <a href="#booking" className="cta-button">
        BOOKING JANJI TEMU ONLINE
      </a>
    </section>
  );
}
