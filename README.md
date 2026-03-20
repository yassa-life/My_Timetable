<h1 align="center">
  <br/>
  🎓 SLIIT Timetable
  <br/>
</h1>

<p align="center">
  <strong>A modern, responsive timetable manager built for SLIIT students.</strong><br/>
  Smart today-view · OCR image scanning · HTML import · Dark mode · Zero backend
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19"/>
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8"/>
  <img src="https://img.shields.io/badge/Tesseract.js-OCR-4CAF50?style=for-the-badge" alt="Tesseract.js"/>
  <img src="https://img.shields.io/badge/Three.js-3D_BG-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js"/>
  <img src="https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify"/>
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="MIT License"/>
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| **Today's Schedule** | Smart home page showing only today's classes with live, upcoming, and completed status |
| **Live Progress Bar** | Ongoing class shows a real-time animated progress bar |
| **Pulse Indicator** | Live *"Now"* badge with a pulsing dot for the current class |
| **Weekly Timetable** | Full-week view with day-filter tabs and time-sorted entries |
| **Add / Edit / Delete** | Full CRUD for classes (subject, day, time, room, lecturer, notes, color) |
| **OCR Image Scan** | Upload or drag-and-drop a timetable photo to auto-fill fields via Tesseract.js |
| **HTML Import** | Parse an official SLIIT HTML timetable file and import all entries for your group automatically |
| **Color Labels** | 8-color picker to visually distinguish modules at a glance |
| **Dark / Light Mode** | Persistent theme toggle with glassmorphism navbar |
| **JSON Export** | Download all entries as a `.json` backup file |
| **JSON Import** | Restore entries from a `.json` backup file |
| **LocalStorage** | All data persists in the browser — **no backend required** |
| **3D Animated Background** | Ambient Three.js particle scene on every page |
| **Responsive Design** | Works on mobile, tablet, and desktop |
| **SVG Icons** | All icons are inline SVG — no emoji, no icon fonts |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### 1 — Clone and install

```bash
git clone https://github.com/yassa-life/My_Timetable.git
cd My_Timetable
npm install
```

### 2 — Run locally

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📦 Building for Production

```bash
npm run build
```

The production bundle is output to `dist/`. Preview it locally with:

```bash
npm run preview
```

---

## 🌐 Deployment

The project includes a pre-configured `netlify.toml` — no extra setup required for Netlify.

### Option A — Netlify CLI

```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
```

### Option B — Netlify Dashboard (Drag & Drop)

1. Run `npm run build`
2. Go to [app.netlify.com](https://app.netlify.com)
3. Drag the `dist/` folder onto the dashboard

### Option C — Netlify Git Integration (Auto-Deploy on push)

1. Push this repo to GitHub
2. Go to [app.netlify.com/start](https://app.netlify.com/start)
3. Click **"Import an existing project"** → connect GitHub → select this repo
4. Use these build settings:

   | Setting | Value |
   |---|---|
   | Build command | `npm run build` |
   | Publish directory | `dist` |

5. Click **"Deploy site"** — every `git push` to `main` will auto-redeploy.

> **Note:** The `netlify.toml` already configures SPA redirects so React Router works correctly on all page reloads.

---

## 📁 Project Structure

```
My_Timetable/
├── public/
│   ├── favicon.svg           # App icon
│   └── icons.svg             # SVG sprite
├── src/
│   ├── components/
│   │   ├── Icons.jsx         # All inline SVG icons
│   │   ├── Illustrations.jsx # SVG illustration components
│   │   ├── Navbar.jsx        # Top navigation bar
│   │   ├── ThreeBackground.jsx  # Three.js ambient particle background
│   │   ├── ThreeHeroScene.jsx   # 3D hero animation (Today page)
│   │   ├── ThreeWeekScene.jsx   # 3D hero animation (Timetable page)
│   │   ├── TodayView.jsx     # Today's schedule page
│   │   ├── TimetableView.jsx # Full weekly timetable page
│   │   ├── EntryModal.jsx    # Add/Edit class modal (with OCR)
│   │   └── HtmlImportModal.jsx  # SLIIT HTML parser modal
│   ├── context/
│   │   └── TimetableContext.jsx # Global state via React Context
│   ├── utils/
│   │   ├── htmlParser.js     # Parser for official SLIIT HTML timetable files
│   │   ├── storage.js        # localStorage & JSON export/import helpers
│   │   └── timeUtils.js      # Time formatting & class status logic
│   ├── App.jsx               # Root component with Router setup
│   ├── App.css               # Full design system (CSS custom properties)
│   ├── index.css             # Base reset & font
│   └── main.jsx              # React app entry point
├── index.html                # Vite HTML entry
├── netlify.toml              # Netlify build & SPA redirect config
├── vite.config.js            # Vite configuration
├── eslint.config.js          # ESLint configuration
└── package.json
```

---

## 🛠️ Using the App

### Adding a Class

1. Click **"Add Class"** on the Today or Timetable page
2. Fill in the fields manually, **or**
3. Use **OCR** — drag and drop a timetable image to auto-fill fields
4. Choose a color label for visual grouping
5. Click **"Add Class"** to save

### Importing from an Official SLIIT Timetable HTML

1. Download the official SLIIT timetable HTML file (weekday version)
2. Click the **Import HTML** button in the navbar
3. Select the file and choose your group (e.g., *"Group 14"*)
4. The app will parse all entries and populate your timetable automatically

### OCR Image Scanning

- Supports PNG, JPG, and other common image formats
- Works best with clear, printed timetable images
- Automatically extracts: subject name, time, room, lecturer, day
- You can manually adjust any field after scanning

### Exporting / Importing JSON Data

- **Export** — Click the download icon in the navbar → a `.json` backup file is saved
- **Import** — Click the import icon → select a `.json` file → confirm to restore

### Dark / Light Mode

Click the sun/moon icon in the navbar. Your preference is saved to localStorage automatically.

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 + Vite 8 |
| Routing | React Router DOM v7 |
| OCR | Tesseract.js v7 |
| 3D Graphics | Three.js |
| Styling | Vanilla CSS (custom design system with CSS variables) |
| Icons | Inline SVG |
| Persistence | Browser localStorage |
| Deployment | Netlify |

---

## ⚠️ Environment Notes

- All data is stored in **browser localStorage** — clearing browser data will delete your entries
- Use the **JSON Export** feature regularly to back up your timetable
- No login, no server, fully **offline-capable** after the first page load
- Tesseract.js downloads its language model on first OCR use (~10 MB), so OCR requires an internet connection the first time

---

## 🤝 Contributing

Contributions are welcome! To get started:

```bash
# Fork the repository, then:
git clone https://github.com/<your-username>/My_Timetable.git
cd My_Timetable
npm install
npm run dev
```

Please open an issue before submitting large pull requests.

---

## 📄 License

[MIT](LICENSE) — free to use, fork, and modify.

---

<p align="center">Made with ❤️ for SLIIT students</p>
