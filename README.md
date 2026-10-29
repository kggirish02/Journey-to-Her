# The Journey to Her ❤️
### A 3D Browser Endless-Runner Adventure Game with Generative AI Art

![Game Status](https://img.shields.io/badge/Status-Complete%20&%20Playable-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20|%20CSS3%20|%20JavaScript%20|%20Three.js-blue?style=for-the-badge)
![AI Framework](https://img.shields.io/badge/Generative%20AI-PyTorch%20|%20Diffusers-orange?style=for-the-badge)
![Audio](https://img.shields.io/badge/Audio-Web%20Audio%20API%20Synthesizer-purple?style=for-the-badge)

---

## 🌟 1. Project Concept & Story

**"The Journey to Her ❤️"** is a vibrant, heartwarming 3D runner adventure game designed for college students and web enthusiasts.

The story follows a young boy on a quest through enchanting lands to reach the girl who waits for him at the sunset garden gazebo. Along the way:
1. **Scene 1: The Beginning** - Stand on a blooming path with the cute 3D cartoon boy under a sunny sky.
2. **Scene 2: The Run Begins** - Sprint along a 3-lane path bordered by green trees, flowers, and rolling hills.
3. **Scene 3: Golden Coins** - Collect glowing rotating golden coins across lanes to increase your score.
4. **Scene 4: Agile Controls** - Jump over fallen logs, slide under warning bars, and dodge tall boulders.
5. **Scene 5: Trouble in the Middle** - Cross a perilous, damaged wooden suspension bridge suspended over a rushing canyon river. A warning siren sounds: *"DANGER AHEAD! ⚠️"*.
6. **Scene 6: The Golden Approach** - Overcome the bridge to enter a warm, glowing twilight landscape filled with pink cherry blossom trees. An alert greets you: *"ALMOST THERE! ❤️"*.
7. **Scene 7: Destination & Golden Sunset Beach Reunion** - Cross the finish line to reach the golden sunset shore! The boy arrives at the water's edge on the wet sand, wraps his arms lovingly around the girl's waist, and she wraps her arms around his neck on tiptoes in an intimate, laughing beach embrace against breaking ocean waves and coastal boulders as celebration fanfare sounds!

---

## 🎮 2. How to Play (Keyboard Controls)

| Key | Alternate Key | Action |
| :--- | :--- | :--- |
| **A** | **Left Arrow (←)** | Move to Left Lane |
| **D** | **Right Arrow (→)** | Move to Right Lane |
| **Space** | **Up Arrow (↑)** or **W** | Jump over Logs, Rocks & Gaps |
| **S** | **Down Arrow (↓)** | Slide / Duck under Hanging Barriers |
| **Esc** | **P** | Pause / Resume Game |

---

## ⚡ 3. Dynamic Difficulty Levels

Players can select their preferred gameplay challenge on the Start Screen or switch anytime from the Pause screen:

| Level | Badge | Running Speed | Obstacle Gaps | Collision Tolerance | Score Multiplier | Gameplay Feel |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Easy** | 🟢 Easy Mode | 15.0 m/s | Wide (30–44m) | Forgiving near-misses | **1.0x** | Relaxed, beginner-friendly story run with abundant coins |
| **Medium** | 🟡 Medium Mode | 19.0 m/s | Balanced (22–32m) | Standard balance | **1.5x** | The classic adventure runner experience |
| **High** | 🔴 High Level | 25.0 m/s | Dense (10–22m) | Crisp timing required | **2.5x Bonus 🔥** | High-speed sprint, rapid step cadence & maximum score glory |

---

## 🌐 4. Direct Vercel Deployment

This project is fully configured for **1-click direct Vercel deployment**:

### Method 1: Using the Vercel Dashboard (GitHub / GitLab / Bitbucket)
1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "Configure Vercel deployment & realistic theme"
   git push origin main
   ```
2. Log into [Vercel](https://vercel.com) and click **"Add New... -> Project"**.
3. Import your `Journey-to-Her` repository.
4. Keep the Framework Preset as **Other** (Root Directory: `./`).
5. Click **"Deploy"**!

### Method 2: Using the Vercel CLI
1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```
2. In the project folder, run:
   ```bash
   vercel
   ```
3. For production release:
   ```bash
   vercel --prod
   ```

### ⚙️ Vercel Optimizations Configured (`vercel.json`):
- **Audio Streaming Support:** Adds `Accept-Ranges: bytes` and proper MIME types (`audio/webm`, `audio/mp4`, `audio/wav`) for smooth background music streaming across all mobile and desktop browsers.
- **Edge CDN Asset Caching:** Caches generated environment textures and audio files (`Cache-Control: public, max-age=31536000, immutable`).
- **Security Headers:** Enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and clean cross-origin policies.

---

## 🚀 5. Local Development Options

You can run the game immediately with zero build tools or complex server setups!

### Option A: Using VS Code "Live Server" (Recommended)
1. Open the **`Journey-to-Her`** folder in Visual Studio Code (`File -> Open Folder... -> Select Journey-to-Her`).
2. If you don't have it, install the **Live Server** extension by *Ritwick Dey* (search for `Live Server` in VS Code Extensions `Ctrl+Shift+X`).
3. Right-click on **`index.html`** in the Explorer sidebar and click **"Open with Live Server"**.
4. The game will automatically launch in your default web browser at `http://127.0.0.1:5500/index.html`.

### Option B: Using Built-in Python Server
1. Open a terminal inside the `Journey-to-Her` folder in VS Code (`Ctrl + ~`).
2. Run:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### Option C: Direct Browser Launch
- You can simply double-click **`index.html`** to open it directly in Google Chrome, Microsoft Edge, Firefox, or Safari! (Three.js and procedural audio run smoothly out of the box).

---

## 🎵 6. Cinematic Three-Tier Soundtrack System
The game features a complete, responsive three-stage soundtrack system with studio-quality audio playback and procedural Web Audio synthesis fallback:
- **Stage 1: High-Energy Running Soundtrack:**
  - **🔥 Veera Veera (OM) - Sai Abhyankkar / Dhanush Mass BGM (from [YouTube](https://youtu.be/UAdkjJaD_u8)):** Pumps continuously during gameplay with zero interruptions. Available as `assets/audio/jailer2_track.webm` and `.m4a`.
- **Stage 2: Stumble / Game Over Failure Theme:**
  - **💔 Sad Breakup Emotional BGM (from [YouTube Shorts](https://youtube.com/shorts/IA7f98LlimI)):** Immediately plays whenever the boy stumbles into an obstacle or stops without winning. Available as `assets/audio/gameover_track.webm` and `.m4a`.
- **Stage 3: Climax Reunion & Victory Love Song:**
  - **💖 Premada Oorali Romantic Love Song (from [YouTube](https://youtu.be/PVOyIdRsPYo)):** Automatically triggers the moment the boy reaches the 500m finish line and embraces the girl on the warm sunset beach! Available as `assets/audio/victory_love_track.webm` and `.m4a`.
- **Dynamic Audio Engine:** Seamlessly transitions tracks across game states, auto-loops without gaps, pauses on demand, and restores running audio upon restart.
- **Sound Effects (SFX):**
  - High-pitch dual-tone golden coin chime.
  - Upward pitch-sweep jump whoosh.
  - Low-pass swoosh slide sound.
  - Descending bass thud on obstacle impact.
- **Controls:** Easily toggle background music or sound effects on/off anytime using the HUD buttons (🎵 and 🔊).

---

## 🤖 7. Generative AI Component (College Assignment)

This project features a dedicated **Generative AI Art Generation Pipeline** powered by **PyTorch** and **Hugging Face Diffusers**.

### What It Does:
- Converts descriptive text prompts into high-resolution, panoramic game environment textures.
- Generates three themed visual chapters:
  1. **Magical Forest Path** (`assets/generated/magical_forest_path.jpg`)
  2. **Golden Sunset Garden** (`assets/generated/golden_sunset_garden.jpg`)
  3. **Fantasy Destination Scene** (`assets/generated/fantasy_destination_scene.jpg`)
- Maps the generated textures onto a 3D cylindrical horizon mesh in Three.js with real-time parallax scrolling.

### How to Run the AI Generator:
1. Open terminal in the `Journey-to-Her` folder.
2. Install requirements:
   ```bash
   pip install -r ai_model/requirements.txt
   ```
3. Generate environment artwork:
   ```bash
   python ai_model/generate_art.py --theme all
   ```
   *(For full academic details on Latent Diffusion, U-Net denoising, and CLIP text encoders, see [`ai_model/README.md`](file:///c:/Users/Lenovo/OneDrive/Desktop/boy/ai_model/README.md)).*

---

## 📁 8. Project Structure

```
Journey-to-Her/
├── index.html                 # Main game HTML with 3D canvas, HUD, and glassmorphic UI
├── style.css                  # Modern CSS design system (glassmorphism, animations)
├── game.js                    # Core Three.js 3D game engine & Web Audio synthesizer
├── README.md                  # Complete documentation and user guide
├── assets/
│   ├── images/                # Game backdrop images synced from AI generator
│   │   ├── magical_forest_path.jpg
│   │   ├── golden_sunset_garden.jpg
│   │   └── fantasy_destination_scene.jpg
│   ├── audio/                 # Audio folder (Web Audio API runs procedurally)
│   └── generated/             # Raw output from the PyTorch Diffusion pipeline
└── ai_model/
    ├── generate_art.py        # Python PyTorch script for text-to-image synthesis
    ├── requirements.txt       # Dependencies (torch, diffusers, transformers)
    └── README.md              # Deep dive on Generative AI & Deep Learning concepts
```

---

## ❤️ 9. Gameplay Flow Checklist
- [x] **Start Screen:** Title, romantic story summary, cute 3D cartoon boy preview, theme selection.
- [x] **Scene 2:** Smooth third-person running along a 3-lane road with side trees & flowers.
- [x] **Scene 3:** Golden coins rotating and glowing; touch to collect (+10 score & chime sound).
- [x] **Scene 4:** Keyboard lane switching (A/D), jumping (Space/Up), sliding (S/Down), pausing (Esc).
- [x] **Scene 5:** "Danger Ahead! ⚠️" banner, weathered wooden canyon bridge, jumpable logs, slideable barriers, dodgeable boulders.
- [x] **Scene 6:** "Almost There! ❤️" banner, warm sunset lighting, cherry blossoms, pink petal atmosphere.
- [x] **Scene 7:** Finish line gazebo, girl character waiting with flowers, reunion cutscene, heart fireworks, gentle romantic melody, and victory stats modal with "Play Again" button.
