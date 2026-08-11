# Power Gym

Pure **HTML + CSS + JavaScript** project. No React, no Node build step.

## Folder structure

```
GYM/
├── index.html          ← main page (open this with Live Server)
├── css/
│   └── style.css       ← all styling
├── js/
│   ├── playlist.js     ← song list (edit songs here)
│   └── player.js       ← music player logic
└── assets/
    ├── bg.svg          ← gym background
    └── logo.svg        ← पावर जिम logo
```

## Run in VS Code (recommended)

### Step 1 — Open the folder
1. Open **VS Code**
2. **File → Open Folder**
3. Select `C:\Users\Umesh\Downloads\GYM`

### Step 2 — Install Live Server
1. Click the **Extensions** icon (left sidebar) or press `Ctrl+Shift+X`
2. Search **Live Server**
3. Install **Live Server** by Ritwick Dey

### Step 3 — Start the site
1. Open `index.html` in the editor
2. Right-click inside the file → **Open with Live Server**
   - OR click **Go Live** at the bottom-right of VS Code
3. Browser opens at `http://127.0.0.1:5500`
4. Click the **white Play button** to start music

### Step 4 — Edit & refresh
- Change design → edit `css/style.css`
- Change songs → edit `js/playlist.js`
- Change layout → edit `index.html`
- Save the file → browser auto-refreshes (Live Server)

## Run with Python (alternative)

Open terminal in VS Code (`Ctrl + ~`) and run:

```powershell
cd C:\Users\Umesh\Downloads\GYM
python -m http.server 8080
```

Open **http://localhost:8080**

## Important

Do **NOT** double-click `index.html` to open it. YouTube music needs a local server (Live Server or Python).

## Customize songs

Edit `js/playlist.js`. Each song needs:

```js
{ id: "YOUTUBE_VIDEO_ID", title: "Song Name", artist: "Artist", lang: "hi" }
```
