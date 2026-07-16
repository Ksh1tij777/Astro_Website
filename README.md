# 🌌 Astro Website

This is the website for our **Astronomy Club**. It is a long, scrolling "space journey" — as you scroll down the page, you fly past a series of planets, and each planet is a different section of the site (Home, Events, Gallery, and so on).

This guide is written so that **anyone can set it up and start helping**, even if you have never built a website before. Take it one step at a time. 💙

---

## 🧠 What is this built with? (in plain words)

- **Next.js / React** — the tool that turns our code into a real website. Think of it as the engine.
- **TypeScript** — JavaScript with a spell-checker. Files end in `.tsx` or `.ts`.
- **Three.js** — the library that draws the 3D planets and stars in the background.
- **Node.js / npm** — the program that runs everything on your computer. `npm` = "the app store" that downloads the pieces we need.
- **Git / GitHub** — how the whole team shares code without emailing files around.

You will mostly edit **text and content**, so don't panic about the 3D math. 🙂

---

## ✅ Step 1 — Install the tools you need (one time only)

1. **Install Node.js**
   - Go to <https://nodejs.org> and download the **LTS** version.
   - Run the installer, click Next → Next → Finish.
   - To check it worked, open a terminal (on Windows: search for **PowerShell**) and type:
     ```powershell
     node -v
     npm -v
     ```
     If you see version numbers (like `v20.x.x`), you're good. ✅

2. **Install Git** (if you don't have it)
   - Download from <https://git-scm.com/downloads> and install with the default options.
   - Check it worked:
     ```powershell
     git --version
     ```

3. *(Recommended)* **Install VS Code** — a friendly code editor: <https://code.visualstudio.com>

---

## ✅ Step 2 — Get the project onto your computer (one time only)

In your terminal, run these one at a time:

```powershell
git clone https://github.com/Ksh1tij777/Astro_Website.git
cd Astro_Website
npm install
```

- `git clone` — copies the whole project from GitHub to your computer.
- `cd Astro_Website` — steps *into* the project folder.
- `npm install` — downloads all the pieces the website needs. This can take a few minutes the first time. ☕

> 💡 You only do Step 1 and Step 2 **once**. After that, jump straight to Step 3.

---

## ✅ Step 3 — Run the website on your computer

```powershell
npm run dev
```

Then open your browser and go to:

### 👉 http://localhost:3000

You should see the website! While `npm run dev` is running, **any change you save in the code shows up in the browser instantly** — no need to restart.

To **stop** the website, click on the terminal and press `Ctrl + C`.

---

## 📁 Where things live (the map of the project)

You will spend almost all your time in just two folders: **`components/sections/`** and **`content/`**.

```
Astro_Website/
├── app/
│   ├── page.tsx          ← the list of sections shown on the page (in order)
│   ├── layout.tsx        ← wraps every page (fonts, background, nav)
│   └── globals.css       ← site-wide styles / colors
│
├── components/
│   ├── sections/         ← ⭐ EACH SECTION OF THE SITE IS A FILE HERE
│   │   ├── Home.tsx
│   │   ├── Events.tsx
│   │   ├── Gallery.tsx
│   │   ├── Projects.tsx
│   │   ├── Merch.tsx
│   │   ├── Tools.tsx
│   │   ├── Contact.tsx
│   │   └── About.tsx
│   ├── Nav.tsx           ← the top navigation menu
│   ├── SpaceBackground.tsx ← the 3D stars & planets (advanced)
│   └── ...
│
├── content/              ← ⭐ THE WORDS / DATA shown on the site
│   ├── events.json       ← list of events
│   ├── gallery.json      ← gallery images
│   ├── projects.json     ← projects
│   ├── merch.json        ← merch items
│   ├── tools.json        ← tools
│   ├── team.json         ← team members (name, role, bio, photo)
│   └── sections.ts       ← the master order + planet colors (see below)
│
└── DESIGN.md             ← the official colors, fonts & style rules
```

---

## ✍️ How to make common changes

### Change the WORDS or DATA (easiest — start here!)
Open the matching file in **`content/`** and edit it.

Example — to add a team member, open `content/team.json` and copy an existing block:

```json
{
  "name": "Your Name",
  "role": "Coordinator · Something",
  "bio": "A short sentence about you.",
  "photo": "https://link-to-your-photo.jpg"
}
```

> ⚠️ JSON files are picky! Every item needs a comma after it **except the last one**, and text must be in `"double quotes"`. If the site shows an error, a missing comma or quote is usually the reason.

### Change how a SECTION looks
Open the file in `components/sections/`. For example, `Events.tsx` controls the Events section. The text between the tags is what you see on screen.

### The master control file: `content/sections.ts`
This one file decides **the order of the sections, the nav menu, and each planet's color and size**. If you add a whole new section, you update this file (and `app/page.tsx`). Ask a coordinator before doing this — it touches several things at once.

### Colors & fonts
Don't guess colors! Use the ones already chosen for us in **`DESIGN.md`**.

---

## 🤝 How the team works together (VERY IMPORTANT)

So we never overwrite each other's work, everyone follows the same simple routine. **Never edit directly on `main`.**

### Every time you start working:

```powershell
git checkout main          # go to the main version
git pull                   # download everyone's latest work
git checkout -b my-section # make your OWN branch to work in
```

Name your branch after what you're doing, e.g. `events-section`, `fix-team-photos`.

### When you've made changes you're happy with:

```powershell
git add .
git commit -m "Short description of what I changed"
git push -u origin my-section
```

Then go to the repo on GitHub and open a **Pull Request** (a "please add my changes" request). I will look at it and merge it in. 

### 🛟 The golden rules
1. **One person, one branch, one job** — makes merging painless.
2. **`git pull` before you start**, every time.
3. **Save small and often** — lots of tiny commits beat one giant one.
4. **When two people edit different files, nothing breaks.** Try to stay in your own section's file.
5. **Stuck? Ask.** Breaking things is normal and fixable — nothing you do here can truly ruin the project. 💪

---

## 🐞 Common problems & quick fixes

| Problem | Fix |
|---|---|
| `npm : command not found` | Node.js isn't installed. Redo Step 1. |
| `npm run dev` gives lots of red errors | Run `npm install` again inside the project folder. |
| Website won't open at localhost:3000 | Make sure the `npm run dev` terminal is still running. |
| Page shows a JSON / syntax error | You probably missed a comma or a `"quote"` in a `content/` file. |
| "Port 3000 is already in use" | Another copy is running. Close the other terminal, or open the address it suggests instead. |
| Git says your branch is behind | Run `git pull` to catch up. |

---

## 🧾 Cheat sheet (copy-paste friendly)

```powershell
# First time only
git clone https://github.com/Ksh1tij777/Astro_Website.git
cd Astro_Website
npm install

# Every work session
git checkout main
git pull
git checkout -b my-branch-name
npm run dev            # opens http://localhost:3000

# When done
git add .
git commit -m "what I changed"
git push -u origin my-branch-name
# then open a Pull Request on GitHub
```

---

