# The Journey to Her 💙
### A 3D Cinematic Browser Adventure Game with Generative AI Art

![Game Status](https://img.shields.io/badge/Status-Complete%20&%20Playable-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20|%20CSS3%20|%20JavaScript%20|%20Three.js-blue?style=for-the-badge)
![AI Framework](https://img.shields.io/badge/Generative%20AI-PyTorch%20|%20Diffusers-orange?style=for-the-badge)
![Audio](https://img.shields.io/badge/Audio-Web%20Audio%20API%20Synthesizer-purple?style=for-the-badge)

---

## 🚀 Quick Start - How to Run the Game

You can run the game in several simple ways with **zero configuration**:

### ⚡ Method 1: 1-Click Launch (Easiest)
- Double-click **`Play_Game.bat`** in the project folder.
- It will automatically launch the game in your default browser at `http://localhost:8000` (or directly via browser if Python is not installed).

### 💻 Method 2: VS Code (F5 Launch)
1. Open this folder in **Visual Studio Code**.
2. Press **`F5`** (or go to **Run -> Start Debugging**).
3. The game will automatically launch in Google Chrome or Microsoft Edge!

### 🌐 Method 3: Direct Double-Click
- Double-click **`index.html`** in Windows Explorer.
- The game runs immediately in Chrome, Edge, Firefox, or Safari (Three.js is bundled locally in `assets/js/three.min.js` so it even works 100% offline!).

### 🐍 Method 4: Python Web Server
1. Open terminal in the project folder.
2. Run:
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your browser.

---

## 🌟 1. Project Concept & Story

**"The Journey to Her 💙"** is a vibrant, heartwarming 3D runner adventure game:

1. **Scene 1: The Beginning 💙** - Stand on a blooming path with the cute 3D cartoon boy under a sunny sky.
2. **Scene 2: The Run Begins** - Sprint along a 3-lane path bordered by green trees, flowers, and rolling hills.
3. **Scene 3: Golden Coins** - Collect glowing rotating golden coins across lanes to increase your score.
4. **Scene 4: Agile Controls** - Jump over fallen logs, slide under warning bars, and dodge tall boulders.
5. **Scene 5: Trouble in the Middle** - Cross a perilous, damaged wooden suspension bridge suspended over a rushing canyon river. Warning alert: *"DANGER AHEAD! ⚠️"*.
6. **Scene 6: The Approach** - Overcome the bridge to enter a warm, glowing twilight landscape filled with pink cherry blossom trees. An alert greets you: *"ALMOST THERE! 💙"*.
7. **Scene 7: Reunion & United Hearts ❤️💙** - Cross the finish line to reach the golden sunset shore! The boy arrives at the water's edge on the wet sand, wraps his arms lovingly around the girl's waist in an intimate beach embrace as celebration fanfare sounds. Above them shines the united red and blue heart (`❤️💙`), and beside her stands a glowing blue heart (`💙`).
8. **Failure / Stumble 💔** - If the boy trips on an obstacle, the red broken heart (`💔`) appears with heartfelt encouragement to try again.

---

## 🎮 2. How to Play (Keyboard Controls)

| Key | Alternate Key | Action |
| :--- | :--- | :--- |
| **A** | **Left Arrow (←)** | Move to Left Lane |
| **D** | **Right Arrow (→)** | Move to Right Lane |
| **Space** | **Up Arrow (↑)** or **W** | Jump over Logs, Rocks & Gaps / Start Game / Retry |
| **S** | **Down Arrow (↓)** | Slide / Duck under Hanging Barriers |
| **Esc** | **P** | Pause / Resume Game |
| **Enter** | **Space** | Quick Start & Quick Retry from menus |

On touch devices (mobile/tablets), dedicated on-screen touch buttons and swipe gestures are available automatically.

---

## ⚡ 3. Dynamic Difficulty Levels

Players can select their preferred gameplay challenge on the Start Screen or switch anytime from the Pause screen:

| Level | Badge | Running Speed | Obstacle Gaps | Collision Tolerance | Score Multiplier | Gameplay Feel |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Easy** | 🟢 Easy Mode | 15.0 m/s | Wide (30–44m) | Forgiving near-misses | **1.0x** | Relaxed, beginner-friendly story run with abundant coins |
| **Medium** | 🟡 Medium Mode | 19.0 m/s | Balanced (22–32m) | Standard balance | **1.5x** | The classic adventure runner experience |
| **High** | 🔴 High Level | 25.0 m/s | Dense (10–22m) | Crisp timing required | **2.5x Bonus 🔥** | High-speed sprint, rapid step cadence & maximum score glory |

---

## 🎵 4. Dynamic Three-Tier Soundtrack System

The game features a complete, responsive three-stage soundtrack system with studio-quality audio playback and procedural Web Audio synthesis fallback:
- **Stage 1: High-Energy Running Soundtrack:**
  - **🔥 Veera Veera (OM) - Sai Abhyankkar / Dhanush Mass BGM (from [YouTube](https://youtu.be/UAdkjJaD_u8)):** Pumps continuously during gameplay with zero interruptions. Available as `assets/audio/jailer2_track.webm` and `.m4a`.
- **Stage 2: Stumble / Game Over Failure Theme:**
  - **💔 Sad Breakup Emotional BGM (from [YouTube Shorts](https://youtube.com/shorts/IA7f98LlimI)):** Immediately plays whenever the boy stumbles into an obstacle or stops without winning. Available as `assets/audio/gameover_track.webm` and `.m4a`.
- **Stage 3: Climax Reunion & Victory Love Song:**
  - **💖 Premada Oorali Romantic Love Song (from [YouTube](https://youtu.be/PVOyIdRsPYo)):** Automatically triggers the moment the boy reaches the 500m finish line and embraces the girl on the warm sunset beach! Available as `assets/audio/victory_love_track.webm` and `.m4a`.
- **United Heart Art Switcher:** On the Victory screen, click the interactive art card or *"Switch Art Style"* button to toggle between the **Neon Red-Blue Heart** and **Painted Red-Blue Heart** artwork!

---

## 🤖 5. Generative AI Component (College Assignment)

This project features a dedicated **Generative AI Art Generation Pipeline** powered by **PyTorch** and **Hugging Face Diffusers**.

### What It Does:
- Converts descriptive text prompts into high-resolution, panoramic game environment textures.
- Generates themed visual chapters:
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

## 📁 6. Project Structure

```
Journey-to-Her/
├── Play_Game.bat              # 1-Click Windows Game Launcher (Starts local server & browser)
├── index.html                 # Main game HTML with 3D canvas, HUD, and glassmorphic UI
├── style.css                  # Modern CSS design system (glassmorphism, animations)
├── game.js                    # Core Three.js 3D game engine & Web Audio synthesizer
├── README.md                  # Complete documentation and quick start guide
├── package.json               # Project manifest and dev scripts
├── .vscode/
│   └── launch.json            # VS Code F5 Run/Debug launcher for Chrome and Edge
├── assets/
│   ├── js/                    # Local Three.js library bundle (offline support)
│   │   └── three.min.js
│   ├── images/                # Game backdrop images & united red-blue heart artwork
│   │   ├── united_heart_neon.png
│   │   ├── united_heart_paint.jpg
│   │   ├── magical_forest_path.jpg
│   │   ├── golden_sunset_garden.jpg
│   │   ├── fantasy_destination_scene.jpg
│   │   └── sunset_beach_backdrop.jpg
│   ├── audio/                 # High quality soundtracks & fallback synthesized audio
│   └── generated/             # Raw output from the PyTorch Diffusion pipeline
└── ai_model/
    ├── generate_art.py        # Python PyTorch script for text-to-image synthesis
    ├── requirements.txt       # Dependencies (torch, diffusers, transformers)
    └── README.md              # Deep dive on Generative AI & Deep Learning concepts
```

---

## 🏆 7. Features & Polishing Completed
- [x] **Blue Heart Theme:** Title, favicon, HUD, progress bar, and dialogue callouts styled in blue (`💙`).
- [x] **Red Broken Heart on Loss:** Failure state displays red broken heart (`💔`) and plays emotional breakup soundtrack.
- [x] **United Hearts on Win:** Reaching the girl displays the 3D rotating Red-and-Blue United Heart (`❤️💙`), ascending embrace heart, and interactive Neon / Paint art showcase.
- [x] **Girl's Blue Heart:** In the destination 3D scene, a radiant pulsing 3D blue heart floats beside the girl.
- [x] **Clean Home Screen:** Removed `(Built with Three.js & Web Audio API . Generative AI Environment Pipeline)` footnote for a clean, modern start page.
- [x] **100% Offline Support:** Local `assets/js/three.min.js` bundled with CDN fallback.
- [x] **Zero-Error Execution:** Works via 1-click batch launcher, VS Code F5, local server, or direct file protocol.
