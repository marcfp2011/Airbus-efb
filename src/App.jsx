import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// BASE DE DATOS DE AEROPUERTOS
// ==========================================
const AIRPORT_DATABASE = {
  LEMD: {
    title: "AIRBUS EFB NAV - AIRPORT CHARTS & INFO",
    subtitle: "LEMD / MAD — MADRID-BARAJAS ADOLFO SUÁREZ",
    meta: "ELEV: 2000 FT | MAG VAR: 2° W | TRANS ALT: 6000 FT | AIRAC 2608",
    gates: [
      ["T1 / T2 / T3 (Non-Schengen & Domestic):", "Gates A1-A38, B18-B33, C34-C50"],
      ["T4 Main Terminal (Schengen):", "Gates H, J, K (Gates H1-H30, K1-K24)"],
      ["T4S Satellite Terminal (Non-Schengen):", "Gates M, S (Gates M1-M50, S1-S48)"],
      ["Cargo Terminal:", "North Apron (Cargo 1-8)"],
      ["General Aviation / Executive:", "South Apron (P-GA)"],
      ["De-icing Pads:", "Pads 1 to 6 (Rwy 36L/36R Dep)"]
    ],
    tech: [
      ["MADRID ATIS (Dep / Arr):", "118.250 / 121.850 MHz"],
      ["MADRID DELIVERY:", "121.705 / 121.930 MHz"],
      ["MADRID GROUND (T1-T3 / T4):", "121.750 / 121.875 MHz"],
      ["MADRID TOWER (Rwy 36L/18R):", "118.150 MHz"],
      ["MADRID TOWER (Rwy 36R/18L):", "120.500 MHz"],
      ["MADRID APPROACH:", "127.100 / 124.000 MHz"],
      ["DVOR/DME BRA (Barajas):", "115.40 MHz (Ch 101X)"]
    ],
    rwyData: ["RWY DATA", "36L: 4179m", "36R: 4350m", "32L: 3988m", "32R: 3500m"],
    runways: [
      { coords: [[30, 20], [30, 95]], label1: '36R', label2: '18L', pos1: [30, 98], pos2: [30, 15] },
      { coords: [[42, 20], [42, 95]], label1: '36L', label2: '18R', pos1: [42, 98], pos2: [42, 15] },
      { coords: [[53, 90], [82, 30]], label1: '32L', label2: '14R', pos1: [51, 92], pos2: [80, 26] },
      { coords: [[62, 90], [91, 30]], label1: '32R', label2: '14L', pos1: [60, 92], pos2: [89, 26] }
    ],
    buildings: [
      { type: 'rect', xy: [35, 60], w: 4, h: 20, color: '#1e40af', border: '#38bdf8', label: 'T4', pos: [37, 70] },
      { type: 'rect', xy: [47, 55], w: 4, h: 22, color: '#1e40af', border: '#38bdf8', label: 'T4S', pos: [49, 66] },
      { type: 'rect', xy: [68, 40], w: 12, h: 10, color: '#047857', border: '#10b981', label: 'T1-T3', pos: [74, 45] }
    ]
  },
  LEBL: {
    title: "AIRBUS EFB NAV - AIRPORT CHARTS & INFO",
    subtitle: "LEBL / BCN — BARCELONA-EL PRAT JOSEP TARRADELLAS",
    meta: "ELEV: 14 FT | MAG VAR: 1° E | TRANS ALT: 6000 FT | AIRAC 2608",
    gates: [
      ["T1 Docks A & B (Schengen):", "Gates A01-A30, B01-B24"],
      ["T1 Docks C, D, E (Non-Schengen):", "Gates C01-C15, D01-D20, E01-E15"],
      ["T2A Terminal (Non-Schengen):", "Gates M01-M15"],
      ["T2B Terminal (Schengen / Low-Cost):", "Gates U30-U50, W01-W20"],
      ["T2C Terminal (EasyJet):", "Gates Y01-Y12"],
      ["Cargo & General Aviation:", "South Apron / Hangar Zone"]
    ],
    tech: [
      ["BARCELONA ATIS (Dep / Arr):", "121.980 / 118.000 MHz"],
      ["BARCELONA DELIVERY:", "121.805 MHz"],
      ["BARCELONA GROUND (T1 / T2):", "121.650 / 121.700 MHz"],
      ["BARCELONA TOWER (07L/25R):", "118.100 MHz"],
      ["BARCELONA TOWER (07R/25L):", "120.800 MHz"],
      ["BARCELONA APPROACH:", "127.700 / 124.700 MHz"],
      ["DVOR/DME BCN (Barcelona):", "112.10 MHz (Ch 58X)"]
    ],
    rwyData: ["RWY DATA", "07L/25R: 3352m", "07R/25L: 2660m", "02/20:   2528m"],
    runways: [
      { coords: [[20, 85], [80, 85]], label1: '07L', label2: '25R', pos1: [16, 85], pos2: [84, 85] },
      { coords: [[20, 35], [70, 35]], label1: '07R', label2: '25L', pos1: [16, 35], pos2: [74, 35] },
      { coords: [[35, 20], [75, 95]], label1: '02', label2: '20', pos1: [33, 17], pos2: [77, 98] }
    ],
    buildings: [
      { type: 'polygon', pts: [[42, 60], [58, 60], [53, 48], [47, 48]], color: '#1e40af', border: '#38bdf8', label: 'T1', pos: [50, 54] },
      { type: 'rect', xy: [25, 90], w: 35, h: 6, color: '#047857', border: '#10b981', label: 'T2 (A/B/C)', pos: [42.5, 93] }
    ]
  },
  LEVC: {
    title: "AIRBUS EFB NAV - AIRPORT CHARTS & INFO",
    subtitle: "LEVC / VLC — VALENCIA MANISES",
    meta: "ELEV: 240 FT | MAG VAR: 1° W | TRANS ALT: 6000 FT | AIRAC 2608",
    gates: [
      ["Main Terminal T1 / T2 (Schengen):", "Gates A1-A12, B1-B8"],
      ["Main Terminal T1 (Non-Schengen):", "Gates B9-B14"],
      ["Regional Terminal (R1):", "Gates C1-C8 (Embraer/ATR)"],
      ["Remote Apron Stands:", "Stands 20 through 35"],
      ["General Aviation / Cargo:", "Private Jet Hangar 1-6"]
    ],
    tech: [
      ["VALENCIA ATIS:", "118.275 MHz"],
      ["VALENCIA DELIVERY:", "121.705 MHz"],
      ["VALENCIA GROUND:", "121.700 MHz"],
      ["VALENCIA TOWER:", "118.550 MHz"],
      ["VALENCIA APPROACH:", "120.100 MHz"],
      ["DVOR/DME VLC (Valencia):", "114.80 MHz (Ch 95X)"]
    ],
    rwyData: ["RWY DATA", "12/30: 3215m", "Width: 45m", "ILS: Cat II"],
    runways: [
      { coords: [[15, 70], [85, 70]], label1: '12', label2: '30', pos1: [11, 70], pos2: [89, 70] }
    ],
    buildings: [
      { type: 'rect', xy: [35, 45], w: 25, h: 10, color: '#1e40af', border: '#38bdf8', label: 'TERMINAL T1/T2', pos: [47.5, 50] },
      { type: 'rect', xy: [20, 45], w: 12, h: 8, color: '#047857', border: '#10b981', label: 'REGIONAL (R1)', pos: [26, 49] },
      { type: 'rect', xy: [65, 45], w: 15, h: 8, color: '#334155', border: '#94a3b8', label: 'CARGA / GA', pos: [72.5, 49] }
    ]
  }
};

// ==========================================
// COMPONENTE VISOR DE CARTAS Y MAPAS
// ==========================================
function AirportChartsView() {
  const [selectedIcao, setSelectedIcao] = useState('LEMD');
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const config = AIRPORT_DATABASE[selectedIcao];
    if (!config) return;

    const W = 600;
    const H = 840;
    canvas.width = W;
    canvas.height = H;

    const BG = '#090d16';
    const CARD_BG = '#111827';
    const CARD_BORDER = '#1f293d';
    const ACCENT_BLUE = '#38bdf8';
    const ACCENT_AMBER = '#f59e0b';
    const ACCENT_GREEN = '#10b981';
    const TEXT_WHITE = '#ffffff';
    const TEXT_MUTED = '#94a3b8';

    const mapX = (x) => 30 + (x / 100) * 540;
    const mapY = (y) => 810 - (y / 100) * 426;

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = 'center';
    ctx.fillStyle = ACCENT_BLUE;
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(config.title, W / 2, 35);

    ctx.fillStyle = TEXT_WHITE;
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(config.subtitle, W / 2, 58);

    ctx.fillStyle = TEXT_MUTED;
    ctx.font = '11px monospace';
    ctx.fillText(config.meta, W / 2, 76);

    ctx.strokeStyle = ACCENT_BLUE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 88);
    ctx.lineTo(570, 88);
    ctx.stroke();

    // Card Gates
    ctx.fillStyle = CARD_BG;
    ctx.strokeStyle = CARD_BORDER;
    ctx.lineWidth = 1;
    ctx.fillRect(30, 100, 260, 270);
    ctx.strokeRect(30, 100, 260, 270);

    ctx.textAlign = 'left';
    ctx.fillStyle = ACCENT_AMBER;
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText("TERMINAL & GATE ALLOCATION", 45, 120);

    let yPos = 142;
    config.gates.forEach(([title, detail]) => {
      ctx.fillStyle = ACCENT_BLUE;
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(title, 45, yPos);
      ctx.fillStyle = TEXT_WHITE;
      ctx.font = '9px monospace';
      ctx.fillText(detail, 45, yPos + 12);
      yPos += 36;
    });

    // Card Frecuencias
    ctx.fillStyle = CARD_BG;
    ctx.fillRect(310, 100, 260, 270);
    ctx.strokeRect(310, 100, 260, 270);

    ctx.fillStyle = ACCENT_AMBER;
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText("RADIO FREQUENCIES & NAVAIDS", 325, 120);

    yPos = 142;
    config.tech.forEach(([title, detail]) => {
      ctx.fillStyle = ACCENT_BLUE;
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(title, 325, yPos);
      ctx.fillStyle = ACCENT_GREEN;
      ctx.font = 'bold 10px monospace';
      ctx.fillText(detail, 325, yPos + 12);
      yPos += 34;
    });

    // Card Diagrama Mapa
    ctx.fillStyle = CARD_BG;
    ctx.fillRect(30, 384, 540, 426);
    ctx.strokeRect(30, 384, 540, 426);

    ctx.fillStyle = ACCENT_AMBER;
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText("AIRPORT DIAGRAM & RUNWAY LAYOUT", 45, 405);

    ctx.fillStyle = ACCENT_BLUE;
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText("N ↑", 530, 415);

    ctx.fillStyle = BG;
    ctx.fillRect(45, 690, 85, 100);
    ctx.strokeRect(45, 690, 85, 100);
    ctx.fillStyle = TEXT_WHITE;
    ctx.font = '9px monospace';
    config.rwyData.forEach((line, idx) => {
      ctx.fillText(line, 50, 705 + idx * 15);
    });

    // Pistas
    config.runways.forEach(rwy => {
      const [p1, p2] = rwy.coords;
      const x1 = mapX(p1[0]), y1 = mapY(p1[1]);
      const x2 = mapX(p2[0]), y2 = mapY(p2[1]);

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = TEXT_WHITE;
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(rwy.label1, mapX(rwy.pos1[0]), mapY(rwy.pos1[1]));
      ctx.fillText(rwy.label2, mapX(rwy.pos2[0]), mapY(rwy.pos2[1]));
    });

    // Edificios
    config.buildings.forEach(b => {
      ctx.fillStyle = b.color;
      ctx.strokeStyle = b.border;
      ctx.lineWidth = 1.5;

      if (b.type === 'rect') {
        const rx = mapX(b.xy[0]);
        const ry = mapY(b.xy[1] + b.h);
        const rw = (b.w / 100) * 540;
        const rh = (b.h / 100) * 426;
        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeRect(rx, ry, rw, rh);
      } else if (b.type === 'polygon') {
        ctx.beginPath();
        b.pts.forEach(([px, py], i) => {
          if (i === 0) ctx.moveTo(mapX(px), mapY(py));
          else ctx.lineTo(mapX(px), mapY(py));
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      ctx.fillStyle = TEXT_WHITE;
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(b.label, mapX(b.pos[0]), mapY(b.pos[1]));
    });

  }, [selectedIcao]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        {Object.keys(AIRPORT_DATABASE).map(icao => (
          <button
            key={icao}
            onClick={() => setSelectedIcao(icao)}
            style={{
              padding: '8px 18px',
              backgroundColor: selectedIcao === icao ? '#38bdf8' : '#111827',
              color: selectedIcao === icao ? '#000' : '#38bdf8',
              border: '1px solid #1f293d',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {icao}
          </button>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: '100%',
          height: 'auto',
          border: '1px solid #1f293d',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
        }}
      />
    </div>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL APP
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('flightplan');

  const [flightData, setFlightData] = useState({
    callsign: 'IBE3102',
    dep: 'LEMD',
    arr: 'LEBL',
    altn: 'LEVC',
    fl: 'FL340',
    route: 'PINOT UN871 BARSO DCT'
  });

  const [paxCount, setPaxCount] = useState(150);
  const [cargoKg, setCargoKg] = useState(2500);

  const [checklists, setChecklists] = useState({
    beforeStart: [
      { id: 1, text: "Cockpit Prep — COMPLETED", checked: false },
      { id: 2, text: "Gear Pins & Covers — REMOVED", checked: false },
      { id: 3, text: "Fuel Quantity — ACCORDING OFP", checked: false },
      { id: 4, text: "Altimeters — SET", checked: false }
    ],
    afterStart: [
      { id: 5, text: "Anti Ice — AS REQ", checked: false },
      { id: 6, text: "ECAM Status — CHECKED", checked: false },
      { id: 7, text: "Pitch Trim — SET", checked: false },
      { id: 8, text: "Rudder Trim — ZERO", checked: false }
    ]
  });

  const toggleCheck = (category, id) => {
    setChecklists(prev => ({
      ...prev,
      [category]: prev[category].map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    }));
  };

  const passengerWeight = paxCount * 84;
  const totalPayload = passengerWeight + Number(cargoKg);
  const dryOperatingWeight = 42500;
  const zeroFuelWeight = dryOperatingWeight + totalPayload;

  return (
    <div style={{ backgroundColor: '#030712', minHeight: '100vh', color: '#f8fafc', fontFamily: 'sans-serif' }}>
      
      {/* NAVEGACIÓN */}
      <header style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', color: '#38bdf8', letterSpacing: '1px' }}>✈ AIRBUS EFB SUITE</h1>
        <nav style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setActiveTab('flightplan')} style={{ padding: '8px 16px', backgroundColor: activeTab === 'flightplan' ? '#0284c7' : '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Plan de Vuelo</button>
          <button onClick={() => setActiveTab('payload')} style={{ padding: '8px 16px', backgroundColor: activeTab === 'payload' ? '#0284c7' : '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Carga & Peso</button>
          <button onClick={() => setActiveTab('charts')} style={{ padding: '8px 16px', backgroundColor: activeTab === 'charts' ? '#0284c7' : '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Cartas y Mapas</button>
          <button onClick={() => setActiveTab('checklist')} style={{ padding: '8px 16px', backgroundColor: activeTab === 'checklist' ? '#0284c7' : '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Checklists</button>
        </nav>
      </header>

      {/* VISTAS */}
      <main style={{ padding: '25px', maxWidth: '900px', margin: '0 auto' }}>
        {activeTab === 'flightplan' && (
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <h2 style={{ marginTop: 0, color: '#f59e0b' }}>Operational Flight Plan (OFP)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>CALLSIGN</label>
                <input type="text" value={flightData.callsign} onChange={e => setFlightData({...flightData, callsign: e.target.value})} style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>ORIGEN (ICAO)</label>
                <input type="text" value={flightData.dep} onChange={e => setFlightData({...flightData, dep: e.target.value})} style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>DESTINO (ICAO)</label>
                <input type="text" value={flightData.arr} onChange={e => setFlightData({...flightData, arr: e.target.value})} style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>NIVEL DE VUELO</label>
                <input type="text" value={flightData.fl} onChange={e => setFlightData({...flightData, fl: e.target.value})} style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>RUTA DE NAVEGACIÓN</label>
              <textarea value={flightData.route} onChange={e => setFlightData({...flightData, route: e.target.value})} rows={3} style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#10b981', fontFamily: 'monospace', borderRadius: '4px' }} />
            </div>
          </div>
        )}

        {activeTab === 'payload' && (
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <h2 style={{ marginTop: 0, color: '#f59e0b' }}>Calculadora de Peso & Balance (A320)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>Pasajeros ({paxCount})</label>
                <input type="range" min="0" max="180" value={paxCount} onChange={e => setPaxCount(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>Carga Carga/Bodega (Kg)</label>
                <input type="number" value={cargoKg} onChange={e => setCargoKg(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }} />
              </div>
            </div>
            <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px', fontFamily: 'monospace' }}>
              <p style={{ margin: '5px 0' }}>PESO PASAJEROS: <span style={{ color: '#38bdf8' }}>{passengerWeight} kg</span></p>
              <p style={{ margin: '5px 0' }}>PAYLOAD TOTAL: <span style={{ color: '#38bdf8' }}>{totalPayload} kg</span></p>
              <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold' }}>ZFW ESTIMADO: <span style={{ color: zeroFuelWeight > 62500 ? '#ef4444' : '#10b981' }}>{zeroFuelWeight} kg</span> (Máx 62,500kg)</p>
            </div>
          </div>
        )}

        {activeTab === 'charts' && (
          <div>
            <h2 style={{ textAlign: 'center', color: '#38bdf8', marginTop: 0 }}>Cartas y Mapas de Navegación</h2>
            <AirportChartsView />
          </div>
        )}

        {activeTab === 'checklist' && (
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <h2 style={{ marginTop: 0, color: '#f59e0b' }}>Airbus A320 Normal Checklists</h2>
            <h3 style={{ color: '#38bdf8', fontSize: '16px' }}>BEFORE START</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {checklists.beforeStart.map(item => (
                <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', backgroundColor: '#1e293b', borderRadius: '4px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={item.checked} onChange={() => toggleCheck('beforeStart', item.id)} />
                  <span style={{ textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? '#94a3b8' : '#fff' }}>{item.text}</span>
                </label>
              ))}
            </div>

            <h3 style={{ color: '#38bdf8', fontSize: '16px' }}>AFTER START</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {checklists.afterStart.map(item => (
                <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', backgroundColor: '#1e293b', borderRadius: '4px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={item.checked} onChange={() => toggleCheck('afterStart', item.id)} />
                  <span style={{ textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? '#94a3b8' : '#fff' }}>{item.text}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
