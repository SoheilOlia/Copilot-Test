"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimationControls } from "framer-motion";
import { useTheme } from "next-themes";

interface Circle {
  radius: number;
  rotationSpeed: number;
  targetSpeed: number;
  dots: { angle: number; size: number; opacity?: number }[];
}

interface Point {
  x: number;
  y: number;
}

interface RotatingCirclesProps {
  canvasControls: AnimationControls;
}

export function RotatingCircles({ canvasControls }: RotatingCirclesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const circlesRef = useRef<Circle[]>([]);
  const lastDirectionChangeRef = useRef<number>(0);
  const { theme } = useTheme();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize circles
    const initializeCircles = () => {
      circlesRef.current = [
        {
          radius: 0,
          rotationSpeed: 0.002,
          targetSpeed: 0.002,
          dots: Array.from({ length: 12 }, () => ({
            angle: Math.random() * Math.PI * 2,
            size: 3,
            opacity: 0,
          })),
        },
        {
          radius: 0,
          rotationSpeed: -0.003,
          targetSpeed: -0.003,
          dots: Array.from({ length: 10 }, () => ({
            angle: Math.random() * Math.PI * 2,
            size: 3,
            opacity: 0,
          })),
        },
        {
          radius: 0,
          rotationSpeed: 0.004,
          targetSpeed: 0.004,
          dots: Array.from({ length: 8 }, () => ({
            angle: Math.random() * Math.PI * 2,
            size: 3,
            opacity: 0,
          })),
        },
      ];
    };

    initializeCircles();

    // Animation loop
    const animate = (timestamp: number) => {
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set center point in bottom right, offset to make circles extend beyond canvas
      const centerX = canvas.width - 50;
      const centerY = canvas.height - 50;

      // Check if it's time to change directions (every 5-10 seconds)
      if (
        timestamp - lastDirectionChangeRef.current >
        5000 + Math.random() * 5000
      ) {
        lastDirectionChangeRef.current = timestamp;

        circlesRef.current.forEach((circle) => {
          // Set new target speed (random between -0.004 and 0.004)
          circle.targetSpeed = (Math.random() - 0.5) * 0.008;
        });
      }

      // Calculate all dot positions first
      const dotPositions: Point[][] = circlesRef.current.map((circle) =>
        circle.dots.map((dot) => ({
          x: centerX + Math.cos(dot.angle) * circle.radius,
          y: centerY + Math.sin(dot.angle) * circle.radius,
        }))
      );

      // Get theme-appropriate colors
      const isDark = theme === "dark";
      const circleColor = isDark
        ? "rgba(135, 135, 135, 0.61)"
        : "rgba(102, 102, 102, 0.2)";
      const dotColor = isDark
        ? "rgba(135, 135, 135, 0.6)"
        : "rgba(102, 102, 102, 0.6)";

      // Draw circles and dots
      circlesRef.current.forEach((circle, circleIndex) => {
        // Smoothly interpolate current speed to target speed
        const speedDiff = circle.targetSpeed - circle.rotationSpeed;
        circle.rotationSpeed += speedDiff * 0.01;

        // Animate circle radius
        const targetRadius = [600, 400, 200][circleIndex];
        const radiusDiff = targetRadius - circle.radius;
        // Add different sprint speeds for each circle
        const sprintMultiplier = [1.8, 1.4, 1.2][circleIndex]; // Different multipliers for each circle
        const easingFactor = Math.max(0.05, 1 - circle.radius / targetRadius); // Gradually slow down as we approach target
        circle.radius += radiusDiff * 0.05 * sprintMultiplier * easingFactor;

        // Draw circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, circle.radius, 0, Math.PI * 2);
        ctx.strokeStyle = circleColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw dots
        circle.dots.forEach((dot) => {
          const x = centerX + Math.cos(dot.angle) * circle.radius;
          const y = centerY + Math.sin(dot.angle) * circle.radius;

          // Animate dot opacity
          const targetOpacity = 1;
          const opacityDiff = targetOpacity - (dot.opacity || 0);
          dot.opacity = (dot.opacity || 0) + opacityDiff * 0.05;

          ctx.beginPath();
          ctx.arc(x, y, dot.size, 0, Math.PI * 2);
          ctx.fillStyle = dotColor.replace("0.6", dot.opacity.toString());
          ctx.fill();

          // Update dot angle
          dot.angle += circle.rotationSpeed;
        });
      });

      // Check if animation is complete
      const isAnimationComplete = circlesRef.current.every(
        (circle, index) =>
          Math.abs(circle.radius - [600, 400, 200][index]) < 0.1 &&
          circle.dots.every((dot) => (dot.opacity || 0) > 0.95)
      );

      if (isAnimationComplete && !isInitialized) {
        setIsInitialized(true);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none origin-bottom-right"
      initial={{ opacity: 0 }}
      animate={canvasControls}
      transition={{ duration: 0.6, ease: "easeOut" }}
    />
  );
}
