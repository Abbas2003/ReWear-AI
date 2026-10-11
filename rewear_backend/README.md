# ReWear AI — Backend Service

A robust, modular, and production-ready FastAPI backend for **ReWear AI**. This service processes uploaded clothing images, uses OpenAI's GPT-4o Vision to analyze fabric type and damage, and generates visual redesign previews via DALL-E 3 along with step-by-step upcycling instructions.

---

## 📁 Project Architecture

```
rewear_backend/
├── app/
│   ├── api/
│   │   └── routes.py         # API endpoints (/health, /analyze-and-redesign)
│   ├── models/
│   │   └── schemas.py        # Pydantic validation & response models
│   ├── services/
│   │   └── openai_service.py # Business logic & OpenAI API integration
│   └── main.py               # FastAPI application entrypoint
├── .env.example              # Environment variables template
├── requirements.txt          # Python dependencies
└── README.md                 # Documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+ installed on your machine.
- An OpenAI API Key with access to GPT-4o and DALL-E 3.

### 2. Installation & Setup

1. Clone or download this project folder.
2. Navigate into the backend directory:
   ```bash
   cd rewear_backend
   ```
3. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### 3. Environment Configuration

Create a `.env` file in the root of `rewear_backend/` (or copy `.env.example`):
```env
OPENAI_API_KEY=your_actual_openai_api_key_here
PORT=8000
DEBUG=True
```

### 4. Running the Server

Start the development server using Uvicorn:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be accessible at:
- **API Root:** `http://localhost:8000`
- **Interactive Swagger Docs:** `http://localhost:8000/docs`
- **Alternative ReDoc Docs:** `http://localhost:8000/redoc`

---

## 🔌 API Endpoints

### 1. Health Check
* **Endpoint:** `GET /api/v1/health`
* **Description:** Verifies service availability.
* **Response:**
  ```json
  {
    "status": "healthy",
    "message": "ReWear AI Backend is running smoothly!"
  }
  ```

### 2. Analyze Garment & Generate Redesign
* **Endpoint:** `POST /api/v1/analyze-and-redesign`
* **Content-Type:** `multipart/form-data`
* **Form Field:** `image` (File)
* **Response Example:**
  ```json
  {
    "garment_type": "Blue Denim Jacket",
    "detected_damage": "Faded color on elbows and a small tear on the left pocket.",
    "materials_needed": [
      "Fabric patches with botanical embroidery",
      "Fabric glue or needle and thread",
      "Scissors"
    ],
    "upcycling_steps": [
      "Trim any frayed threads around the left pocket tear.",
      "Place the botanical embroidered patch over the tear and pin it in place.",
      "Stitch securely around the edges of the patch using matching blue thread.",
      "Add a matching patch on the right elbow for aesthetic symmetry."
    ],
    "redesign_prompt": "A trendy blue denim jacket decorated with intricate botanical embroidered patches over the pockets and sleeves, streetwear aesthetic",
    "preview_image_url": "https://oaidalleapiprodscus.blob.core.windows.net/..."
  }
  ```
