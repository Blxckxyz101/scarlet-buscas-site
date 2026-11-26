#!/bin/bash
# Prepara o motor numa máquina nova (Linux com Node 22 + Playwright/Chromium já instalados).
set -e
cd "$(dirname "$0")"
npm install --no-audit --no-fund
cd kits
for z in *.zip; do d="${z%.zip}"; [ -d "$d" ] || unzip -q "$z" -d "$d"; done
cd ..
# Fontes das legendas: Inter (licença OFL). Cap = Inter Bold, CapB = Inter Black.
[ -f font.otf ]  || cp /usr/share/fonts/opentype/inter/Inter-Bold.otf font.otf
[ -f fontb.otf ] || cp /usr/share/fonts/opentype/inter/Inter-Black.otf fontb.otf
echo "Pronto. Rode: npx -y http-server -p 8767 -s -c-1 .  e abra http://localhost:8767/ep3.html"
