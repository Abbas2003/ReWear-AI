"use client";

import React, { useState, useRef, useSyncExternalStore, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToggleLeft, ToggleRight } from "lucide-react";
import UploadHeader from "@/components/upload/upload-header";
import StepIndicator from "@/components/upload/step-indicator";
import PhotoTips from "@/components/upload/photo-tips";
import Dropzone from "@/components/upload/dropzone";
import PhotoPreview from "@/components/upload/photo-preview";
import UploadError from "@/components/upload/upload-error";
import ScanOverlay from "@/components/upload/scan-overlay";
import { analyzeGarment, getMockResult, ApiError, StoredResultData } from "@/lib/api";
import { fileToDataUrl, optimizeImageIfNeeded } from "@/lib/image";

function subscribeStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getMockSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem("rewear_mock_mode");
  if (stored !== null) return stored === "true";
  return process.env.NEXT_PUBLIC_USE_MOCK === "true";
}

export default function UploadPage() {
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCompressed, setIsCompressed] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [apiError, setApiError] = useState<{ message: string; hint?: string } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Secret Demo Toggle (?demo=1 or Ctrl+Shift+D)
  const [showDemoToggle, setShowDemoToggle] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("demo") === "1";
  });

  const isMockActive = useSyncExternalStore(subscribeStorage, getMockSnapshot, () => false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "D" || e.key === "d")) {
        e.preventDefault();
        setShowDemoToggle((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleMock = () => {
    if (typeof window !== "undefined") {
      const next = !isMockActive;
      window.localStorage.setItem("rewear_mock_mode", String(next));
      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleFileSelect = async (file: File) => {
    setValidationError(null);
    setApiError(null);

    try {
      const dataUrl = await fileToDataUrl(file);
      setPreviewUrl(dataUrl);

      const optimization = await optimizeImageIfNeeded(file);
      setSelectedFile(optimization.file);
      setIsCompressed(optimization.compressed);
    } catch {
      setValidationError("Could not process this file. Please choose another image.");
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsCompressed(false);
    setApiError(null);
    setValidationError(null);
  };

  const saveAndNavigate = (resultData: ReturnType<typeof getMockResult>) => {
    if (!previewUrl) return;
    const payload: StoredResultData = {
      result: resultData,
      originalImageDataUrl: previewUrl,
      uploadedAt: new Date().toISOString(),
    };
    try {
      sessionStorage.setItem("rewear:result", JSON.stringify(payload));
    } catch {
      // safe fallback
    }
    router.push("/result");
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile || !previewUrl) return;
    setApiError(null);
    setIsScanning(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const result = await analyzeGarment(selectedFile, controller.signal);
      saveAndNavigate(result);
    } catch (err: unknown) {
      setIsScanning(false);
      if (err instanceof ApiError) {
        setApiError({ message: err.message, hint: err.hint });
      } else if (err instanceof Error) {
        setApiError({ message: err.message });
      } else {
        setApiError({ message: "An unexpected error occurred during analysis." });
      }
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsScanning(false);
  };

  const step: 1 | 2 | 3 = isScanning ? 3 : selectedFile ? 2 : 1;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Secret Demo Switcher */}
      {showDemoToggle && (
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono">
          <span className="text-[#6B6860]">Presenter Mode:</span>
          <button type="button" onClick={handleToggleMock} className="cursor-pointer">
            {isMockActive ? <ToggleRight className="w-5 h-5 text-black" /> : <ToggleLeft className="w-5 h-5 text-neutral-400" />}
          </button>
          <span className="font-bold">{isMockActive ? "ON" : "OFF"}</span>
        </div>
      )}

      {/* Main 2-Column Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column (Sticky on desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8">
          <UploadHeader />
          <StepIndicator currentStep={step} />
          <PhotoTips />
        </div>

        {/* Right Column (Single Focused Glass Panel) */}
        <div className="lg:col-span-7 space-y-6">
          {!selectedFile || !previewUrl ? (
            <Dropzone onFileSelect={handleFileSelect} onError={(m) => setValidationError(m)} />
          ) : (
            <PhotoPreview
              file={selectedFile}
              previewUrl={previewUrl}
              isCompressed={isCompressed}
              onAnalyze={handleStartAnalysis}
              onChangePhoto={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/jpeg,image/png,image/webp";
                input.onchange = (e) => {
                  const f = (e.target as HTMLInputElement).files?.[0];
                  if (f) handleFileSelect(f);
                };
                input.click();
              }}
              onRemove={handleRemove}
            />
          )}

          {validationError && (
            <div role="alert" className="glass rounded-xl p-3 text-xs text-[#0E0E0E] border border-neutral-300">
              {validationError}
            </div>
          )}

          {apiError && (
            <UploadError
              message={apiError.message}
              hint={apiError.hint}
              onRetry={handleStartAnalysis}
              onShowDemo={() => saveAndNavigate(getMockResult())}
            />
          )}
        </div>
      </div>

      {isScanning && previewUrl && <ScanOverlay previewUrl={previewUrl} onCancel={handleCancel} />}
    </div>
  );
}
