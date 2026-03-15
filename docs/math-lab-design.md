## Math Lab – Design & Ideas

Math Lab is the place in Allien where you can **grow your math skills step by step** using:
- **Levels** (like a game)
- **Questions with hints**
- **AI tutor help**

This doc is written so it is easy to read for kids and helpers.

---

## 1. Goals

- **P0 goal**:  
  - Make **one full working path**: pick a grade → pick Level 1 → answer questions → see score.  
  - Focus first on **K–2 Level 1** (very simple addition up to 10).
- **P1 goal**:  
  - Add more levels and fun features so Math Lab feels like a **learning game**, not just a worksheet.
- **Big vision**:  
  - If you use Math Lab a few minutes each day, you see your **math power grow** over time.

---

## 2. How Math Lab Works

- You open **Math Lab** from the top navigation bar.
- You choose **your grade band**:
  - K–2, 3–5, 6–8, 9–12 (we start building K–2 and 3–5 first).
- You see **25 levels** for that grade:
  - Level 1 is unlocked.
  - Higher levels are locked at first.
- You pick a level and answer a **small set of questions** (for example 5–10).
- At the end you see:
  - How many you got right.
  - A friendly message.
  - If you unlocked the **next level**.

This loop is how Math Lab helps you get better:  
**tiny missions → instant feedback → see progress → want to try again**.

---

## 3. Question Types (Engine)

To start, Math Lab will support:

- **Single choice**  
  - One question, several options, you choose one.
- **Type a number**  
  - You type the answer (for example `7`).

Later (P1), we can add:

- **Multi-select** questions (pick all correct answers).
- **Word problems** with small stories.

Each question will support:

- **One extra try**:  
  - First wrong → soft message + hint.  
  - Second wrong → show correct answer + short explanation.

---

## 4. Levels, Skills, and “Math Kangaroo” Style

Each **level** should focus on **one main math idea**.

Example for **K–2** (ideas, not final list):

- Level 1 – Add up to 10
- Level 2 – Add up to 20
- Level 3 – Take away (subtract) up to 10
- Level 4 – Compare numbers (bigger / smaller)
- Level 5 – Very simple word problems

Example for **3–5**:

- Level 1 – Times tables (×2, ×5, ×10)
- Level 2 – Times tables (×3, ×4)
- Level 3 – Division facts
- Level 4 – Fractions (½, ⅓, ¼)
- Level 5 – Multi-step word problems

We can keep this list in code as a simple **config**, so adding a new level is mostly adding:

- Level number
- Name (short title)
- Skill (what it teaches)
- Set of questions or a question generator

### 4.1. “Math Kangaroo” style questions

Math Kangaroo problems are usually:
- **Short stories** with pictures in your head.
- About **thinking carefully**, not only calculating.
- Often have a **little trick** or surprise.

We can mix in some *Kangaroo-style* questions we invent ourselves (not copied) into some levels.

Example ideas (K–2 / 3–4 style):

1. **K–2 example – Counting and comparing**  
   > Mia has 3 red balloons and 2 blue balloons.  
   > Her friend gives her 2 more red balloons.  
   > How many red balloons does Mia have now?  
   > A) 3 B) 4 C) 5 D) 7  

2. **K–2 example – Thinking about order**  
   > There are 5 birds on a fence.  
   > 2 birds fly away and then 1 new bird lands.  
   > How many birds are on the fence now?  
   > A) 3 B) 4 C) 5 D) 6  

3. **3–4 example – Multiple steps**  
   > Leo has 12 stickers.  
   > He gives 3 stickers to each of his 2 friends.  
   > How many stickers does Leo have left?  
   > A) 3 B) 4 C) 6 D) 9  

4. **3–4 example – Reasoning, not just calculation**  
   > A box holds exactly 8 toy cars.  
   > Sam has 17 toy cars.  
   > How many boxes does Sam need so **all** cars fit in boxes?  
   > A) 2 B) 3 C) 4 D) 5  
   (Correct answer is 3, because 2×8 = 16 and he still has 1 car left.)  

5. **3–4 example – Which is bigger?**  
   > Which number is the biggest?  
   > A) 3 + 4 B) 2 + 6 C) 1 + 8 D) 5 + 3  
   (All are 7, 8, 9, 8 → the answer is C.)  

We can tag these as `kangarooStyle: true` in the config so later we can:
- Show a tiny icon for “puzzle question”.
- Let the AI tutor give **extra rich explanations** for these.

---

## 5. Progress and Saving

Math Lab should remember your progress using `localStorage`:

- Last chosen **grade**.
- For each grade:
  - **Highest unlocked level**.
  - Optional: stars or best score for each level.

This means:

- When you come back later, your levels are still unlocked.
- The level buttons can show:
  - **Locked** levels (you cannot click yet).
  - **Done** levels (with a checkmark or star).

---

## 6. AI Tutor Ideas

In the future, Allien can act like an **AI math tutor** inside Math Lab.

Some ideas:

- **Hint button** during a question:
  - Explains how to think about the problem without giving the full answer right away.
- **Explain my mistake**:
  - After you finish a level, AI can explain one or two tricky questions in simple words.
- **Practice more like this**:
  - If you miss many questions of the same type, AI can suggest a mini-set of extra questions on that topic.

Technical idea (later):

- Send the **question, your answer, and the correct answer** to the AI.
- Ask the AI to return:
  - A short hint (1–2 sentences).
  - A friendly explanation.

We will keep the core **question engine** simple so AI help is an **add-on**, not required.

---

## 7. Game and Fun Ideas

To make Math Lab feel more like a game:

- **Stars per level**:
  - 3 stars if you get almost everything right the first time.
  - 2 stars if you needed hints.
  - 1 star just for finishing.
- **Friendly streaks**:
  - A small badge if you play Math Lab on several days in a row.
- **Mini characters or badges**:
  - Earn small badges like “Addition Ace” or “Fraction Explorer”.
- **Soft animations**:
  - Tiny confetti or glow when you finish a level.

We can start with just **stars and level unlocks** in code, then add more visuals later.

---

## 8. P0 vs P1 Summary

**P0 (first version to ship):**
- One full working grade path:
  - K–2, Level 1 (real questions and scoring).
- Question engine:
  - Single choice + numeric answers.
  - One extra try + explanation.
- Saving:
  - Remember chosen grade and Level 1 completion.
- UI:
  - Clear level screen, back button, progress bar.

**P1 (next steps):**
- More levels and more grades.
- Multi-select questions and better word problems.
- Stars, better progress view, basic streaks.
- First AI tutor features:
  - Hints and mistake explanations.

This doc can grow as we add more ideas and details for Math Lab.

---

## 9. Adventure Game Mode (first design)

**Idea:** Math Lab feels like a **game**: you control a little character on a map, move with **arrow keys** (up, down, left, right), and meet **enemies** on the map. When you move into an enemy, it asks you a **math question**. Answer correctly → you defeat the enemy and gain **energy**; answer wrong → you see the right answer and can try again. Goal: defeat all enemies to complete the level.

### First version (v1)

- **Map:** A small grid (e.g. 8×6 or 7×7). Empty tiles = walkable ground. Some tiles have an **enemy** (one per tile).
- **Character:** One character (e.g. little person or Allien mascot) that the player controls. Starts at a fixed tile (e.g. top-left). **Controls:** Arrow keys Up / Down / Left / Right move the character one tile. Character cannot walk off the map.
- **Enemies:** 3–5 fixed tiles have an “enemy” (e.g. monster or question mark). Enemies do not move. When the player **moves onto** an enemy tile:
  - The game pauses and a **question modal** appears (same math question UI as today: one question, multiple choice).
  - **Correct answer** → enemy is defeated (tile becomes empty or shows a “defeated” marker), player gains **energy** (e.g. +1), modal closes, character stays on that tile.
  - **Wrong answer** → show the correct answer and a short “Try again” message; modal closes; enemy is **not** defeated, so the player can move away and come back to try again, or we could allow one retry on the same tile (same or new question).
- **Energy:** Shown on screen (e.g. “Energy: 3”). Each correct answer adds 1. Used for “power” or just as a score.
- **Goal:** Defeat all enemies. When all are defeated, show **“Level complete!”** and total energy, then a button like **“Back to Math Lab”** or **“Next level”**.

### Tech (v1)

- **State:** Character position `(x, y)`; list of enemy positions `[{x, y, questionIndex}, ...]`; set of defeated enemy indices; “question modal” state (open, which enemy, selected option, show result); optional “pending move” (when you try to step on an enemy we open the modal and only move if correct).
- **Movement:** On Arrow key, compute next tile. If next tile is in bounds and empty or has a defeated enemy → move. If next tile has an undefeated enemy → open question modal and **don’t move** until they answer; if correct, then move and mark enemy defeated.
- **Rendering:** Grid of cells (CSS Grid or flex). Each cell: background (ground), optional enemy sprite (if not defeated), optional character (if this cell is character position). Character and enemies can be emojis or small images.

### Later (v2+)

- Different character sprite and enemy sprites; simple animations.
- More tiles (bigger map), obstacles (walls), keys/doors.
- “Boss” enemy that asks a harder question or several questions.
- Sound effects and celebration when defeating an enemy or completing the level.

