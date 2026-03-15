## Offline AI Question Generation Script (Design)

Goal: use an AI model **offline during development time** to generate or refresh math questions,
then save them into the typed config files under `src/math/questions/`.

This avoids runtime token costs and lets you review questions before students see them.

### High-level flow

1. Developer runs a script, e.g.:
   - `npm run gen:math-questions k2 1` (grade K–2, level 1)
2. Script:
   - Reads the current `MathLevelConfig` for that grade/level.
   - Sends a prompt to an AI model describing:
     - Grade band, target skill (e.g. "add within 10"), style ("Math Kangaroo‑like story problems").
   - Receives new candidate questions.
3. Script converts model output into `MathQuestion[]` objects:
   - Assigns unique `id`s.
   - Ensures fields match `MathQuestion` type.
4. Script writes/overwrites the matching level in a local file:
   - `src/math/questions/k2.ts` (or another grade file).
5. Developer reviews the diff and commits if happy.

### Possible implementation sketch (Node.js + OpenAI-like SDK)

- File: `scripts/generateMathQuestions.ts`
- Steps:
  - Parse CLI args: gradeId, levelNumber, skill description, count.
  - Import `MathLevelConfig` and existing level file.
  - Call AI API with a structured prompt:
    - Ask for JSON output with fields: `prompt`, `options`, `answerIndex`, `kangarooStyle`.
  - Validate and transform JSON into `MathQuestion[]`:
    - Ensure there are 4 options per question.
    - Ensure `answerIndex` is in range.
  - Update and pretty‑print the `${GRADE}_LEVELS` array in the matching questions file.

This design is enough to implement the script later without changing the Math Lab UI.

