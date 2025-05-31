"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Point {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  velocity: { x: number; y: number };
}

export function RadiusCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [points, setPoints] = useState<Point[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

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

    // Initialize points
    const initialPoints: Point[] = Array.from({ length: 8 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 30 + 10,
      opacity: Math.random() * 0.5 + 0.2,
      velocity: {
        x: (Math.random() - 0.5) * 1.5,
        y: (Math.random() - 0.5) * 1.5,
      },
    }));
    setPoints(initialPoints);

    // Animation loop
    const animate = () => {
      if (!ctx) return;

      // Clear canvas with slight fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw points
      setPoints((prevPoints) =>
        prevPoints.map((point) => {
          // Update position
          point.x += point.velocity.x;
          point.y += point.velocity.y;

          // Bounce off walls
          if (point.x < 0 || point.x > canvas.width) point.velocity.x *= -1;
          if (point.y < 0 || point.y > canvas.height) point.velocity.y *= -1;

          // Draw point
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${point.opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Draw connecting lines to mouse
          const dx = mousePos.x - point.x;
          const dy = mousePos.y - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 200;

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${
              (1 - distance / maxDistance) * 0.2
            })`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          return point;
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
}
