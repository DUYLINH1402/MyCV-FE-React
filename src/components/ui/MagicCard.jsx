import { useRef, useEffect, useCallback, useState } from "react";
import { gsap } from "gsap";

// ========================================
// MagicCard - Component tạo hiệu ứng hover đẹp mắt
// Lấy cảm hứng từ Magic Bento của reactbits
// Bao gồm: spotlight, particles, border glow, tilt effect
// ========================================

// Các giá trị mặc định
const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_GLOW_COLOR = "249, 115, 22"; // Màu orange-500 phù hợp với theme Backend
const MOBILE_BREAKPOINT = 768;

// Hook phát hiện thiết bị mobile
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

// Hàm tạo phần tử particle
const createParticleElement = (width, height, glowColor) => {
  const particle = document.createElement("div");
  const size = 4 + Math.random() * 4;
  const x = Math.random() * width;
  const y = Math.random() * height;

  particle.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    background: radial-gradient(circle, rgba(${glowColor}, 0.9) 0%, rgba(${glowColor}, 0.4) 50%, transparent 100%);
    border-radius: 50%;
    pointer-events: none;
    left: ${x}px;
    top: ${y}px;
    z-index: 10;
  `;

  return particle;
};

// Hàm cập nhật thuộc tính glow của card
const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

const MagicCard = ({
  children,
  className = "",
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  enableParticles = true,
  enableBorderGlow = true,
  clickEffect = true,
  enableMagnetism = true,
}) => {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef(null);

  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  // Khởi tạo particles
  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(width, height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  // Animation cho particles
  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current || !enableParticles) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true);
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        );

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "power1.out",
          onComplete: () => {
            gsap.to(clone, {
              opacity: 0,
              scale: 0,
              duration: 0.5,
              onComplete: () => clone.remove(),
            });
          },
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles, enableParticles]);

  // Xóa particles
  const cleanupParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    particlesRef.current.forEach((particle) => {
      gsap.killTweensOf(particle);
      particle.remove();
    });
    particlesRef.current = [];
  }, []);

  // Xử lý sự kiện mouse
  useEffect(() => {
    if (shouldDisableAnimations || !cardRef.current) return;

    const card = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      if (enableParticles) {
        animateParticles();
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      cleanupParticles();

      // Reset tilt effect
      if (enableTilt) {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      // Reset magnetism
      if (enableMagnetism && magnetismAnimationRef.current) {
        magnetismAnimationRef.current.kill();
        gsap.to(card, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      // Reset glow
      updateCardGlowProperties(card, 0, 0, 0, 200);
    };

    const handleMouseMove = (e) => {
      if (!isHoveredRef.current) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Tilt effect
      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        gsap.to(card, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: "power2.out",
        });
      }

      // Magnetism effect
      if (enableMagnetism) {
        const magnetX = ((x - centerX) / centerX) * 3;
        const magnetY = ((y - centerY) / centerY) * 3;

        if (magnetismAnimationRef.current) {
          magnetismAnimationRef.current.kill();
        }

        magnetismAnimationRef.current = gsap.to(card, {
          x: magnetX,
          y: magnetY,
          duration: 0.2,
          ease: "power2.out",
        });
      }

      // Border glow effect
      if (enableBorderGlow) {
        updateCardGlowProperties(card, e.clientX, e.clientY, 1, 200);
      }
    };

    const handleClick = (e) => {
      if (!clickEffect) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement("div");
      const maxDimension = Math.max(rect.width, rect.height);

      ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${maxDimension * 2}px;
        height: ${maxDimension * 2}px;
        background: radial-gradient(circle, rgba(${glowColor}, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        pointer-events: none;
        z-index: 1000;
      `;

      card.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("click", handleClick);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("click", handleClick);
      cleanupParticles();
    };
  }, [
    shouldDisableAnimations,
    animateParticles,
    cleanupParticles,
    enableTilt,
    enableMagnetism,
    enableBorderGlow,
    enableParticles,
    clickEffect,
    glowColor,
  ]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      particlesRef.current = [];
    };
  }, []);

  return (
    <>
      <style>
        {`
          .magic-card {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
            position: relative;
            overflow: hidden;
            transform-style: preserve-3d;
            perspective: 1000px;
          }
          
          .magic-card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 2px;
            background: radial-gradient(
              var(--glow-radius) circle at var(--glow-x) var(--glow-y),
              rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
              rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
              transparent 60%
            );
            border-radius: inherit;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
            opacity: 1;
            transition: opacity 0.3s ease;
            z-index: 1;
          }
        `}
      </style>
      <div
        ref={cardRef}
        className={`magic-card ${enableBorderGlow ? "magic-card--border-glow" : ""} ${className}`}
        style={{
          ...style,
          "--glow-x": "50%",
          "--glow-y": "50%",
          "--glow-intensity": "0",
          "--glow-radius": "200px",
        }}>
        {children}
      </div>
    </>
  );
};

export default MagicCard;
