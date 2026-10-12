"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Camera } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { verifyImageFileSignature } from "@/lib/file-check";

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  onError: (msg: string) => void;
}

export default function Dropzone({ onFileSelect, onError }: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleValidate = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      onError("File is too large. Maximum size is 10 MB.");
      return;
    }

    const verification = await verifyImageFileSignature(file);
    if (!verification.isValid) {
      onError(verification.error || "Please select a valid JPG, PNG, or WEBP image.");
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files?.[0]) {
      handleValidate(e.dataTransfer.files[0]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6; // max 3deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    setTilt({ x: y, y: x });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files?.[0]) handleValidate(e.target.files[0]);
        }}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files?.[0]) handleValidate(e.target.files[0]);
        }}
      />

      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => fileInputRef.current?.click()}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          y: isDragOver ? -6 : 0,
          scale: isDragOver ? 1.015 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className={`relative cursor-pointer rounded-3xl p-10 sm:p-16 text-center transition-colors duration-300 select-none glass flex flex-col items-center justify-center min-h-[360px] sm:min-h-[420px] ${
          isDragOver
            ? "border-[#0E0E0E] bg-white/70 shadow-lg"
            : "border-dashed border-[rgba(14,14,14,0.2)] hover:border-[rgba(14,14,14,0.45)]"
        }`}
      >
        {/* Center: Self-drawing subtle SVG Garment Outline */}
        <motion.div
          animate={{ scale: isDragOver ? 1.08 : [1, 1.025, 1] }}
          transition={{
            scale: isDragOver ? { duration: 0.2 } : { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="mb-8"
        >
          <svg
            className="w-20 h-20 text-[#0E0E0E] opacity-75"
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              d="M20 12 L26 18 Q32 20 38 18 L44 12 L56 22 L49 29 L45 25 L45 54 L19 54 L19 25 L15 29 L8 22 Z"
            />
            <line x1="28" y1="54" x2="28" y2="28" strokeDasharray="3 3" opacity="0.4" />
            <line x1="36" y1="54" x2="36" y2="28" strokeDasharray="3 3" opacity="0.4" />
          </svg>
        </motion.div>

        {/* Primary Prompt */}
        <h3 className="font-editorial text-2xl sm:text-3xl text-[#0E0E0E] mb-2 font-normal">
          {isDragOver ? "Release to upload" : "Drop a photo here"}
        </h3>

        <p className="text-xs sm:text-sm text-[#6B6860] font-sans mb-6">
          or{" "}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="underline underline-offset-4 text-[#0E0E0E] hover:text-[#6B6860] cursor-pointer"
          >
            browse files
          </button>
        </p>

        {/* Mobile Camera Option */}
        <div className="sm:hidden mb-6">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              cameraInputRef.current?.click();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0E0E0E] text-white text-xs font-mono tracking-wider uppercase"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Take a photo</span>
          </button>
        </div>

        {/* Small Helper Line */}
        <p className="text-[11px] font-mono text-[#6B6860] tracking-wide">
          JPG, PNG or WEBP, up to 10 MB
        </p>
      </motion.div>
    </div>
  );
}
