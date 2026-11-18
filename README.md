# בית ספר קדרון · Kidron School website

Static bilingual (Hebrew/English) site. No build step: `index.html` + `img/`, deployed on Vercel.

## Editing content
All editable lists live at the bottom of `index.html` in the `<script>`:
- `PROJECTS` – the school's own projects (Our projects page)
- `FUND` – projects we're raising money for (`goal`, `raised` in ₪, `link` per project)
- `MONTHS` – yearly curriculum calendar (holidays, events, and per-grade `topics`)

Placeholders to replace before launch: search for `[` / `PLACEHOLDER` / `data-placeholder` (donation links, amuta name & number, Kol Kidron link, info@ email).
Remove `<meta name="robots" content="noindex">` at launch.

Pages are hash routes: `#home #about #projects #support #calendar #donate #join #accessibility`.
