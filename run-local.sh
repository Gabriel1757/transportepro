#!/bin/bash
echo "🚀 Iniciando TransportePRO localmente..."
echo ""

# Detectar SO
if [[ "$OSTYPE" == "darwin"* ]]; then
    OPEN_CMD="open"
else
    OPEN_CMD="xdg-open"
fi

# Backend em background
echo "📍 Iniciando Backend (porta 3001)..."
(cd back && npm run dev > /tmp/backend.log 2>&1) &
BACKEND_PID=$!
echo "✅ Backend PID: $BACKEND_PID"
sleep 3

# Frontend em background  
echo "📍 Iniciando Frontend (porta 3000)..."
(cd front && npm run dev > /tmp/frontend.log 2>&1) &
FRONTEND_PID=$!
echo "✅ Frontend PID: $FRONTEND_PID"
sleep 2

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "🎉 TransportePRO está rodando!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "📱 Frontend:  http://localhost:3000"
echo "🔗 API:       http://localhost:3001"
echo "❤️  Health:   http://localhost:3001/health"
echo ""
echo "📊 Logs:"
echo "   Backend:  tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🛑 Para parar:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "═══════════════════════════════════════════════════════════════"

wait
