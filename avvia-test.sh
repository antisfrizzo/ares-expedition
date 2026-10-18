#!/usr/bin/env bash
PORT=8080
echo "=========================================================="
echo "🚀 Ares Expedition - Server Locale di Test"
echo "=========================================================="
echo ""
echo "Per testare dal tuo computer:"
echo "👉 Apri il browser su: http://localhost:$PORT"
echo ""
echo "💡 CONSIGLIO PER TESTARE SU SMARTPHONE SENZA PUSHARE:"
echo "   1. Apri http://localhost:$PORT sul tuo PC (Chrome, Edge o Firefox)"
echo "   2. Premi F12 sulla tastiera (o tasto destro ➔ 'Ispeziona')"
echo "   3. Clicca sull'icona dello smartphone (o premi Ctrl + Shift + M)"
echo "   4. Puoi selezionare iPhone, Samsung Galaxy o qualsiasi risoluzione!"
echo ""
echo "Per fermare il server di test: premi CTRL + C"
echo "=========================================================="
python3 -m http.server $PORT
