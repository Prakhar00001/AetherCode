⚡ AetherCode

**AetherCode** is a premium Next.js full-stack development workspace engineered to accelerate code auditing, complexity calculation, and script optimization. By matching developer source code directly against state-of-the-art LLM reasoning models via a reinforced backend architecture, AetherCode breaks down code down into actionable metrics without the typical overhead of local container tools.

It generates isolated abstract syntax tree (AST) integrity scores, computes runtime time complexity markers, isolates structural anomalies, catches token-hijack profiles, and serves an immediate side-by-side clean rewrite panel complete with a continuous chat console for conversational micro-tuning.

---

## 🛠️ Tech Stack

*   **Frontend Ecosystem:** Next.js 15 (App Router), React, TailwindCSS, Framer Motion (Fluid Spring Mechanics).
*   **Aesthetics & Visual Context:** Lucide Icons, Prism Syntax Highlighter (High-fidelity token coloring).
*   **Backend & Orchestration:** Next.js API Routes (Route Handlers), Edge-ready Runtime Handlers.
*   **AI Engine:** Google GenAI SDK (`@google/genai`) tracking the active production `gemini-3.5-flash` node array.

---

## ✨ Key Features

*   💻 **Expanded Workspace Input Gutter:** A stretched `min-h-[400px]` drag-and-drop source viewport featuring live line-index counting that comfortably renders large, complex functions out of the box.
*   📊 **AST Integrity Telemetry:** Real-time production metrics scoring system mapping logic patterns directly against verified industrial software guidelines.
*   🌿 **Side-by-Side Synthesis View:** Instant code diff presentation highlighting your baseline layout text right next to optimized, production-ready AI code.
*   ⚠️ **Anomaly & Security Isolation:** Deep token exploration tracking logical bugs, memory leaks, and access vector leaks grouped cleanly by severity flags.
*   💬 **Refinement Prompt Console:** A conversational, state-guarded context window providing micro-adjustment loops over the generated output text.

---

## 🚀 Quick Start & Installation

Ensure you have [Node.js v18.x or later](https://nodejs.org/) installed before spinning up your workspace environment.

### 1. Clone & Position Repository
```bash
git clone [https://github.com/Prakhar00001/AetherCode.git](https://github.com/Prakhar00001/AetherCode.git)

2. Install Dependencies

npm install

3. Environment Variable Provisioning

Create a .env.local file in the project root directory:

GEMINI_API_KEY=gemini_api_key_here

4. Fire Up the Local Runtime Engine

npm run dev

Open your browser to http://localhost:3000 to interact with your live local workspace grid.

⚙️ Architecture & How It Works

[ Client Workspace ] ──( Payload: Code + Lang )──> [ Next.js API Gateway ]
        │                                                     │
 (Renders Stretched UI)                               (Resilient Catch Block)
        │                                                     │
[ High-Fidelity Diff ] <──( Structured JSON Schema )── [ Gemini 3.5 Engine ]



📂 Structural Overview

AetherCode/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts     # Streamlined API Route Handler (AI Schema Mapping)
│   ├── globals.css          # Tailwind Custom Styles & Gutter Configurations
│   └── page.tsx             # Interactive Light-Theme Workspace (Framer Motion UI)
├── package.json             # Core Dependency Declarations
└── README.md                # Project Architecture Blueprint

🌐 Production Deployment

This project is configured to run out-of-the-box on the Vercel platform.

1)Connect your GitHub repository account to Vercel.

2)Import the AetherCode project workspace.

3)Inject your production GEMINI_API_KEY into the Environment Variables panel

4)Trigger the build. Vercel's data network will handle standard handshake routing securely at the edge!



