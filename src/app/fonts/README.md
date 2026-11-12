# Bundled fonts

These fonts are loaded with `next/font/local` in `src/app/layout.tsx`, so
production builds do not need to request Google Fonts stylesheets or binaries.
The existing CSS variables and font families are preserved.

Source: https://github.com/google/fonts (downloaded November 12, 2026).

- `bebas-neue/BebasNeue-Regular.ttf`: `ofl/bebasneue/BebasNeue-Regular.ttf`
- `heebo/Heebo-Variable.ttf`: `ofl/heebo/Heebo[wght].ttf`
- `roboto/Roboto-Variable.ttf`: `ofl/roboto/Roboto[wdth,wght].ttf`

Each directory includes its font's SIL Open Font License in `OFL.txt`.
