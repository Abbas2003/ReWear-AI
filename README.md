# ReWear AI &mdash; Frontend

> **Circular Garment Intelligence Engine**  
> Don't throw it away. Rewear it.

ReWear AI is an editorial web application that analyzes tears, wear, and flaws in forgotten clothing using artificial intelligence, formulating step-by-step DIY upcycling blueprints and bespoke redesign previews to keep textiles in circulation.

---

## 🛠️ Stack & Technologies Used

- **Framework**: Next.js 16 (App Router with Turbopack)
- **3D Background**: React Three Fiber & Three.js (Generative undulating textile weave with subtle cursor & scroll parallax)
- **Motion & Transitions**: Motion (`motion/react`) for smooth reveals, interactive sliders, and responsive vector illustrations
- **Typography & Aesthetics**: Fraunces (Editorial Serif) + Inter (Clean Sans) designed in an ivory/ink/glass lookbook palette
- **Pair Programming**: Built collaboratively with Google DeepMind's Antigravity AI coding assistant during this hackathon

---

## 🚀 Getting Started

### 1. Installation

```bash
cd rewear_frontend
npm install
```

### 2. Environment Variables

Create `.env.local` (or copy from `.env.local.example`):

```env
# Backend FastAPI endpoint (default: http://localhost:8000)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Set to true to bypass backend and run simulated demo AI
NEXT_PUBLIC_USE_MOCK=false
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎭 Presenter Demo Mode

For seamless live stage presentations:
- Append `?demo=1` to the URL: `http://localhost:3000/upload?demo=1`
- **OR** press `Ctrl + Shift + D` anywhere on the upload page to toggle **Presenter Demo Mode**.
- **Live Fallback**: If the backend connection drops, a polite **"Show demo result instead"** option appears immediately so the presentation never stalls.

---

## 🎬 Devpost Demo Video Script (2:30 min)

### Scene 1: The Problem (0:00 &ndash; 0:15)
- **Visual**: Open on the landing page hero. Show the undulating textile weave and the animated "Tear to Reborn" vector loop on the right.
- **Narrator**: *"Every year, over 90 million tons of clothing are discarded because of minor tears, broken zippers, or fabric wear. Most of these garments are completely salvageable, but people don't know how to redesign them. This is ReWear AI."*

### Scene 2: Upload & AI Vision Scan (0:15 &ndash; 1:00)
- **Visual**: Click *Upload a garment*. Drop an image of a worn denim jacket with sleeve distress into the breathing dropzone. Click *Analyze and redesign*.
- **Narrator**: *"We upload a photo of our damaged jacket. ReWear performs client-side validation and streams the garment to our vision pipeline. A frosted scanning laser evaluates the wear zones, classifies the textile structure, and formulates an artisan upcycling blueprint."*

### Scene 3: Result & Interactive Guide (1:00 &ndash; 2:00)
- **Visual**: The lookbook result page appears. Drag the Before/After comparison slider across the garment. Scroll down to show the diagnostic note, check off tools in the Materials Toolkit, and interact with the Step-by-Step Repair Guide. Click *Save as PDF*.
- **Narrator**: *"Here is our finished blueprint. The Before/After slider reveals an artisan Sashiko-stitched geometric repair. On the left, we see a precise diagnostic and an interactive toolkit checklist. On the right, a step-by-step DIY guide tracks your progress as you work. When you're ready, you can copy the guide or print it as an atelier work order."*

### Scene 4: Circular Mission & Closing (2:00 &ndash; 2:30)
- **Visual**: Show the quiet ecological note at the bottom of the guide. Click *Try another garment* to return to the landing page.
- **Narrator**: *"Extending the life of a garment by just nine months reduces its carbon and water footprint by 20 to 30 percent. ReWear AI turns discarded clothing into bespoke wardrobe staples. Don't throw it away. Rewear it."*

---

## 🔒 Security Standards

- Comprehensive HTTP Security Headers (`nosniff`, `DENY` clickjacking protection, strict referrer policy, restricted permissions policy)
- Strict Content Security Policy (`CSP`) configured in `next.config.ts`
- Client-side magic byte inspection for file uploads (JPEG, PNG, WEBP)
- Image previews restricted to secure `https://` URLs with `referrerPolicy="no-referrer"`
- Plaintext-only string rendering with zero `dangerouslySetInnerHTML` across the codebase
- All secrets and credentials strictly isolated from source code
