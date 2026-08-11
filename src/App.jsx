import React, { useState, useEffect, useRef } from 'react';

// ==========================================================
// 1. BASE DE DATOS Y CONSTANTES DE NAVEGACIÓN
// ==========================================================
const AIRPORT_DATABASE = {
  LEMD: {
    name: "Madrid-Barajas Adolfo Suárez",
    city: "Madrid, España",
    elevation: "2000 FT",
    magVar: "2° W",
    transAlt: "6000 FT",
    airac: "2608",
    metar: "LEMD 111200Z 21008KT 9999 FEW030 22/11 Q1018 NOSIG",
    taf: "LEMD 111100Z 1112/1218 20010KT 9999 SCT040 TX26/15Z TN12/06Z",
    gates: [
      ["T1 / T2 / T3 (Non-Schengen & Domestic)", "Gates A1-A38, B18-B33, C34-C50"],
      ["T4 Main Terminal (Schengen)", "Gates H, J, K (Gates H1-H30, K1-K24)"],
      ["T4S Satellite Terminal (Non-Schengen)", "Gates M, S (Gates M1-M50, S1-S48)"],
      ["Cargo Terminal", "North Apron (Cargo 1-8)"],
      ["General Aviation / Executive", "South Apron (P-GA)"],
      ["De-icing Pads", "Pads 1 to 6 (Rwy 36L/36R Dep)"]
    ],
    tech: [
      ["MADRID ATIS (Dep / Arr)", "118.250 / 121.850 MHz"],
      ["MADRID DELIVERY", "121.705 / 121.930 MHz"],
      ["MADRID GROUND (T1-T3 / T4)", "121.750 / 121.875 MHz"],
      ["MADRID TOWER (Rwy 36L/18R)", "118.150 MHz"],
      ["MADRID TOWER (Rwy 36R/18L)", "120.500 MHz"],
      ["MADRID APPROACH", "127.100 / 124.000 MHz"],
      ["DVOR/DME BRA (Barajas)", "115.40 MHz (Ch 101X)"]
    ],
    rwyData: ["36L/18R: 4179m", "36R/18L: 4350m", "32L/14R: 3988m", "32R/14L: 3500m"],
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
    name: "Barcelona-El Prat Josep Tarradellas",
    city: "Barcelona, España",
    elevation: "14 FT",
    magVar: "1° E",
    transAlt: "6000 FT",
    airac: "2608",
    metar: "LEBL 111200Z 18012KT 150V220 9999 FEW025 24/18 Q1016 NOSIG",
    taf: "LEBL 111100Z 1112/1218 19014KT 9999 CAVOK TX25/14Z TN16/05Z",
    gates: [
      ["T1 Docks A & B (Schengen)", "Gates A01-A30, B01-B24"],
      ["T1 Docks C, D, E (Non-Schengen)", "Gates C01-C15, D01-D20, E01-E15"],
      ["T2A Terminal (Non-Schengen)", "Gates M01-M15"],
      ["T2B Terminal (Schengen / Low-Cost)", "Gates U30-U50, W01-W20"],
      ["T2C Terminal (EasyJet)", "Gates Y01-Y12"],
      ["Cargo & General Aviation", "South Apron / Hangar Zone"]
    ],
    tech: [
      ["BARCELONA ATIS (Dep / Arr)", "121.980 / 118.000 MHz"],
      ["BARCELONA DELIVERY", "121.805 MHz"],
      ["BARCELONA GROUND (T1 / T2)", "121.650 / 121.700 MHz"],
      ["BARCELONA TOWER (07L/25R)", "118.100 MHz"],
      ["BARCELONA TOWER (07R/25L)", "120.800 MHz"],
      ["BARCELONA APPROACH", "127.700 / 124.700 MHz"],
      ["DVOR/DME BCN (Barcelona)", "112.10 MHz (Ch 58X)"]
    ],
    rwyData: ["07L/25R: 3352m", "07R/25L: 2660m", "02/20:   2528m"],
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
    name: "Valencia Manises",
    city: "Valencia, España",
    elevation: "240 FT",
    magVar: "1° W",
    transAlt: "6000 FT",
    airac: "2608",
    metar: "LEVC 111200Z 12009KT 080V150 9999 CAVOK 25/16 Q1017 NOSIG",
    taf: "LEVC 111100Z 1112/1218 11010KT 9999 SKC TX27/14Z TN15/06Z",
    gates: [
      ["Main Terminal T1 / T2 (Schengen)", "Gates A1-A12, B1-B8"],
      ["Main Terminal T1 (Non-Schengen)", "Gates B9-B14"],
      ["Regional Terminal (R1)", "Gates C1-C8 (Embraer/ATR)"],
      ["Remote Apron Stands", "Stands 20 through 35"],
      ["General Aviation / Cargo", "Private Jet Hangar 1-6"]
    ],
    tech: [
      ["VALENCIA ATIS", "118.275 MHz"],
      ["VALENCIA DELIVERY", "121.705 MHz"],
      ["VALENCIA GROUND", "121.700 MHz"],
      ["VALENCIA TOWER", "118.550 MHz"],
      ["VALENCIA APPROACH", "120.100 MHz"],
      ["DVOR/DME VLC (Valencia)", "114.80 MHz (Ch 95X)"]
    ],
    rwyData: ["12/30: 3215m x 45m", "ILS: Cat II"],
    runways: [
      { coords: [[15, 70], [85, 70]], label1: '12', label2: '30', pos1: [11, 70], pos2: [89, 70] }
    ],
    buildings: [
      { type: 'rect', xy: [35, 45], w: 25, h: 10, color: '#1e40af', border: '#38bdf8', label: 'TERMINAL T1/T2', pos: [47.5, 50] },
      { type: 'rect', xy: [20, 45], w: 12, h: 8, color: '#047857', border: '#10b981', label: 'REGIONAL (R1)', pos: [26, 49] },
      { type: 'rect', xy: [65, 45], w: 15, h: 8, color: '#334155', border: '#94a3b8', label: 'CARGA / GA', pos: [72.5, 49] }
    ]
  },
  LEIB: {
    name: "Ibiza",
    city: "Ibiza, España",
    elevation: "24 FT",
    magVar: "1° E",
    transAlt: "6000 FT",
    airac: "2608",
    metar: "LEIB 111200Z 16011KT 9999 FEW020 26/19 Q1016 NOSIG",
    taf: "LEIB 111100Z 1112/1218 17012KT 9999 CAVOK TX27/13Z TN18/05Z",
    gates: [
      ["Main Passenger Terminal", "Gates 1 to 17"],
      ["Non-Schengen Gate Area", "Gates 18 to 24"],
      ["General Aviation Apron", "Stands GA1 to GA12"]
    ],
    tech: [
      ["IBIZA ATIS", "128.500 MHz"],
      ["IBIZA GROUND", "121.800 MHz"],
      ["IBIZA TOWER", "118.500 MHz"],
      ["IBIZA APPROACH", "119.800 MHz"],
      ["DVOR/DME SBA (San Antonio)", "114.10 MHz"]
    ],
    rwyData: ["06/24: 2800m x 45m"],
    runways: [
      { coords: [[20, 30], [80, 70]], label1: '06', label2: '24', pos1: [16, 28], pos2: [84, 72] }
    ],
    buildings: [
      { type: 'rect', xy: [40, 58], w: 20, h: 12, color: '#1e40af', border: '#38bdf8', label: 'MAIN TERMINAL', pos: [50, 64] }
    ]
  }
};

const SAMPLE_WAYPOINTS = [
  { name: "LEMD (DEP)", ident: "LEMD", alt: "2000 FT", speed: "210 KT", fuelBurn: "0 KG", dist: "0 NM" },
  { name: "PINOT", ident: "PINOT", alt: "FL140", speed: "280 KT", fuelBurn: "320 KG", dist: "24 NM" },
  { name: "VULPE", ident: "VULPE", alt: "FL280", speed: "300 KT", fuelBurn: "650 KG", dist: "58 NM" },
  { name: "UN871 / BARSO", ident: "BARSO", alt: "FL340", speed: "M0.78", fuelBurn: "1250 KG", dist: "142 NM" },
  { name: "SENRA", ident: "SENRA", alt: "FL340", speed: "M0.78", fuelBurn: "1820 KG", dist: "210 NM" },
  { name: "LERSO (TOD)", ident: "LERSO", alt: "FL240", speed: "290 KT", fuelBurn: "2100 KG", dist: "268 NM" },
  { name: "CLEAN", ident: "CLEAN", alt: "FL100", speed: "250 KT", fuelBurn: "2350 KG", dist: "295 NM" },
  { name: "LEBL (ARR)", ident: "LEBL", alt: "14 FT", speed: "140 KT", fuelBurn: "2580 KG", dist: "330 NM" }
];

// ==========================================================
// 2. COMPONENTE DIBUJO DE CARTAS EN CANVAS
// ==========================================================
function AirportCanvasChart({ selectedIcao }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const config = AIRPORT_DATABASE[selectedIcao];
    if (!config) return;

    const W = 600;
    const H = 780;
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
    const mapY = (y) => 750 - (y / 100) * 380;

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    // Cabecera
    ctx.textAlign = 'center';
    ctx.fillStyle = ACCENT_BLUE;
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText("AIRBUS EFB NAV — AIRPORT LAYOUT & FREQ", W / 2, 28);

    ctx.fillStyle = TEXT_WHITE;
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`${selectedIcao} / ${config.name.toUpperCase()}`, W / 2, 48);

    ctx.fillStyle = TEXT_MUTED;
    ctx.font = '10px monospace';
    ctx.fillText(`ELEV: ${config.elevation} | MAG VAR: ${config.magVar} | TRANS ALT: ${config.transAlt} | AIRAC ${config.airac}`, W / 2, 64);

    ctx.strokeStyle = ACCENT_BLUE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 75);
    ctx.lineTo(570, 75);
    ctx.stroke();

    // Bloque Izquierdo: Gates
    ctx.fillStyle = CARD_BG;
    ctx.strokeStyle = CARD_BORDER;
    ctx.lineWidth = 1;
    ctx.fillRect(30, 85, 260, 250);
    ctx.strokeRect(30, 85, 260, 250);

    ctx.textAlign = 'left';
    ctx.fillStyle = ACCENT_AMBER;
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText("TERMINAL & GATE ALLOCATION", 40, 103);

    let yPos = 122;
    config.gates.forEach(([title, detail]) => {
      ctx.fillStyle = ACCENT_BLUE;
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText(title, 40, yPos);
      ctx.fillStyle = TEXT_WHITE;
      ctx.font = '9px monospace';
      ctx.fillText(detail, 40, yPos + 11);
      yPos += 33;
    });

    // Bloque Derecha: Frecuencias
    ctx.fillStyle = CARD_BG;
    ctx.fillRect(310, 85, 260, 250);
    ctx.strokeRect(310, 85, 260, 250);

    ctx.fillStyle = ACCENT_AMBER;
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText("RADIO FREQUENCIES & NAVAIDS", 320, 103);

    yPos = 122;
    config.tech.forEach(([title, detail]) => {
      ctx.fillStyle = ACCENT_BLUE;
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText(title, 320, yPos);
      ctx.fillStyle = ACCENT_GREEN;
      ctx.font = 'bold 9px monospace';
      ctx.fillText(detail, 320, yPos + 11);
      yPos += 31;
    });

    // Diagrama Mapa
    ctx.fillStyle = CARD_BG;
    ctx.fillRect(30, 350, 540, 410);
    ctx.strokeRect(30, 350, 540, 410);

    ctx.fillStyle = ACCENT_AMBER;
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText("AIRPORT DIAGRAM & RUNWAY LAYOUT", 45, 370);

    ctx.fillStyle = ACCENT_BLUE;
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText("N ↑", 535, 375);

    // Leyenda Pistas
    ctx.fillStyle = BG;
    ctx.fillRect(45, 650, 150, 95);
    ctx.strokeRect(45, 650, 150, 95);
    ctx.fillStyle = TEXT_WHITE;
    ctx.font = '9px monospace';
    ctx.fillText("RWY LENGTHS:", 52, 665);
    config.rwyData.forEach((line, idx) => {
      ctx.fillText(line, 52, 680 + idx * 13);
    });

    // Dibujo Pistas
    config.runways.forEach(rwy => {
      const [p1, p2] = rwy.coords;
      const x1 = mapX(p1[0]), y1 = mapY(p1[1]);
      const x2 = mapX(p2[0]), y2 = mapY(p2[1]);

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.strokeStyle = '#f8fafc';
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

    // Dibujo Edificios
    config.buildings.forEach(b => {
      ctx.fillStyle = b.color;
      ctx.strokeStyle = b.border;
      ctx.lineWidth = 1.5;

      if (b.type === 'rect') {
        const rx = mapX(b.xy[0]);
        const ry = mapY(b.xy[1] + b.h);
        const rw = (b.w / 100) * 540;
        const rh = (b.h / 100) * 380;
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
    <canvas
      ref={canvasRef}
      style={{
        maxWidth: '100%',
        height: 'auto',
        border: '1px solid #1f293d',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.6)'
      }}
    />
  );
}

// ==========================================================
// 3. COMPONENTE DIBUJO ENVELOPE PESO Y BALANCE
// ==========================================================
function WeightBalanceEnvelope({ zfw, tow, maxZfw = 62500, maxTow = 77000 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const W = 400;
    const H = 220;
    canvas.width = W;
    canvas.height = H;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    // Ejes y envolvente de vuelo
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;

    // Cuadrícula
    for (let x = 40; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H - 30); ctx.stroke();
    }
    for (let y = 20; y < H - 30; y += 30) {
      ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Polígono de envolvente permitida (CG)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 180);   // Min Weight Forward
    ctx.lineTo(120, 30);   // Max TOW Forward
    ctx.lineTo(340, 30);   // Max TOW Aft
    ctx.lineTo(320, 180);  // Min Weight Aft
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Punto ZFW
    const zfwY = 180 - ((zfw - 40000) / (80000 - 40000)) * 150;
    const towY = 180 - ((tow - 40000) / (80000 - 40000)) * 150;

    // Dibujar ZFW (Amarillo)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(200, zfwY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Dibujar TOW (Verde o Rojo)
    const isOver = tow > maxTow || zfw > maxZfw;
    ctx.fillStyle = isOver ? '#ef4444' : '#10b981';
    ctx.beginPath();
    ctx.arc(210, towY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Etiquetas
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText("CG ENVELOPE % MAC", 150, 205);

    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`• ZFW: ${zfw}kg`, 50, 25);
    ctx.fillStyle = isOver ? '#ef4444' : '#10b981';
    ctx.fillText(`• TOW: ${tow}kg`, 150, 25);

  }, [zfw, tow, maxZfw, maxTow]);

  return <canvas ref={canvasRef} style={{ width: '100%', borderRadius: '6px', border: '1px solid #1e293b' }} />;
}

// ==========================================================
// 4. COMPONENTE PRINCIPAL APP (EFB SUITE)
// ==========================================================
export default function App() {
  const [activeTab, setActiveTab] = useState('flightplan');
  const [selectedAirport, setSelectedAirport] = useState('LEMD');
  const [utcTime, setUtcTime] = useState('');

  // Estado Plan de Vuelo
  const [flightData, setFlightData] = useState({
    callsign: 'IBE3102',
    dep: 'LEMD',
    arr: 'LEBL',
    altn: 'LEVC',
    fl: 'FL340',
    costIndex: '28',
    route: 'PINOT UN871 BARSO DCT SENRA DCT LERSO'
  });

  // Estado Carga y Pesos
  const [paxCount, setPaxCount] = useState(145);
  const [cargoKg, setCargoKg] = useState(2400);
  const [fuelFobKg, setFuelFobKg] = useState(6500);

  // Estado Cálculo de Rendimiento (Takeoff)
  const [perfData, setPerfData] = useState({
    rwyCondition: 'DRY',
    flaps: '1+F',
    flexTemp: '58',
    wind: '210/08',
    qnh: '1018'
  });

  // Estado Checklists
  const [checklists, setChecklists] = useState({
    beforePush: [
      { id: 1, text: "Cockpit Prep — COMPLETED", checked: true },
      { id: 2, text: "Gear Pins & Covers — REMOVED", checked: true },
      { id: 3, text: "Fuel Quantity — ACCORDING OFP", checked: true },
      { id: 4, text: "Altimeters — SET QNH 1018", checked: false }
    ],
    afterStart: [
      { id: 5, text: "Anti Ice — AS REQUIRED", checked: false },
      { id: 6, text: "ECAM Status — CHECKED NORMAL", checked: false },
      { id: 7, text: "Pitch Trim — SET 1.2 UP", checked: false },
      { id: 8, text: "Rudder Trim — ZERO", checked: false }
    ],
    beforeTakeoff: [
      { id: 9, text: "Cabin Crew — REPORTED READY", checked: false },
      { id: 10, text: "TCAS — TA / RA", checked: false },
      { id: 11, text: "Engine Mode Sel — NORMAL / IGN", checked: false },
      { id: 12, text: "Packs — OFF / ON AS REQ", checked: false }
    ]
  });

  // Reloj UTC
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().substring(11, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cálculos de Peso
  const paxWeight = paxCount * 84;
  const totalPayload = paxWeight + Number(cargoKg || 0);
  const dryOperatingWeight = 42500;
  const zeroFuelWeight = dryOperatingWeight + totalPayload;
  const takeOffWeight = zeroFuelWeight + Number(fuelFobKg || 0);

  // Cálculos Rendimiento Takeoff (Simulados A320)
  const calculatedV1 = Math.round(130 + (takeOffWeight - 50000) / 1000 * 0.8);
  const calculatedVR = calculatedV1 + 3;
  const calculatedV2 = calculatedVR + 5;

  const toggleCheck = (cat, id) => {
    setChecklists(prev => ({
      ...prev,
      [cat]: prev[cat].map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    }));
  };

  return (
    <div style={{ backgroundColor: '#030712', minHeight: '100vh', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* BARRA SUPERIOR DE ESTADO EFB */}
      <header style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>✈</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '16px', color: '#38bdf8', letterSpacing: '1px', fontWeight: 'bold' }}>AIRBUS ELECTRONIC FLIGHT BAG</h1>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>A320-200 | FLY-BY-WIRE EFB SUITE v4.2</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '12px', fontFamily: 'monospace' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#10b981', fontWeight: 'bold' }}>GPS: 3D FIX</div>
            <div style={{ color: '#94a3b8' }}>{utcTime}</div>
          </div>
          <div style={{ padding: '4px 10px', backgroundColor: '#1e293b', borderRadius: '4px', border: '1px solid #334155', color: '#f59e0b' }}>
            BAT: 98% ⚡
          </div>
        </div>
      </header>

      {/* MENÚ DE NAVEGACIÓN */}
      <nav style={{ backgroundColor: '#090d16', padding: '10px 20px', borderBottom: '1px solid #1e293b', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {[
          { id: 'flightplan', label: '📋 Plan de Vuelo' },
          { id: 'performance', label: '⚡ Performance (V-Speeds)' },
          { id: 'payload', label: '⚖ Peso & Balance' },
          { id: 'charts', label: '🗺 Cartas / Aeropuertos' },
          { id: 'checklist', label: '☑ Checklists' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              backgroundColor: activeTab === tab.id ? '#0284c7' : '#1e293b',
              color: '#ffffff',
              border: '1px solid',
              borderColor: activeTab === tab.id ? '#38bdf8' : '#334155',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>

        {/* ================= MODULO 1: PLAN DE VUELO ================= */}
        {activeTab === 'flightplan' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '10px', border: '1px solid #1e293b' }}>
              <h2 style={{ marginTop: 0, color: '#f59e0b', fontSize: '18px' }}>Operational Flight Plan (OFP) - Airbus Navigation</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>CALLSIGN</label>
                  <input type="text" value={flightData.callsign} onChange={e => setFlightData({...flightData, callsign: e.target.value})} style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px', fontFamily: 'monospace' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>ORIGEN (ICAO)</label>
                  <input type="text" value={flightData.dep} onChange={e => setFlightData({...flightData, dep: e.target.value.toUpperCase()})} style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px', fontFamily: 'monospace' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>DESTINO (ICAO)</label>
                  <input type="text" value={flightData.arr} onChange={e => setFlightData({...flightData, arr: e.target.value.toUpperCase()})} style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px', fontFamily: 'monospace' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>CRUISE LEVEL</label>
                  <input type="text" value={flightData.fl} onChange={e => setFlightData({...flightData, fl: e.target.value})} style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px', fontFamily: 'monospace' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>COST INDEX</label>
                  <input type="text" value={flightData.costIndex} onChange={e => setFlightData({...flightData, costIndex: e.target.value})} style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px', fontFamily: 'monospace' }} />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>ATC ROUTE STRING</label>
                <textarea value={flightData.route} onChange={e => setFlightData({...flightData, route: e.target.value})} rows={2} style={{ width: '100%', padding: '10px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#10b981', fontFamily: 'monospace', borderRadius: '4px', fontSize: '13px' }} />
              </div>

              {/* TABLA DE WAYPOINTS */}
              <h3 style={{ color: '#38bdf8', fontSize: '14px', marginBottom: '10px' }}>Waypoint Navigation Log</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#1e293b', color: '#94a3b8', textAlign: 'left' }}>
                      <th style={{ padding: '8px' }}>WAYPOINT</th>
                      <th style={{ padding: '8px' }}>IDENT</th>
                      <th style={{ padding: '8px' }}>ALTITUDE</th>
                      <th style={{ padding: '8px' }}>SPD</th>
                      <th style={{ padding: '8px' }}>DIST</th>
                      <th style={{ padding: '8px' }}>EST BURN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_WAYPOINTS.map((wpt, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #1e293b', backgroundColor: idx % 2 === 0 ? '#0b1329' : 'transparent' }}>
                        <td style={{ padding: '8px', color: '#fff', fontWeight: 'bold' }}>{wpt.name}</td>
                        <td style={{ padding: '8px', color: '#38bdf8' }}>{wpt.ident}</td>
                        <td style={{ padding: '8px', color: '#f59e0b' }}>{wpt.alt}</td>
                        <td style={{ padding: '8px', color: '#94a3b8' }}>{wpt.speed}</td>
                        <td style={{ padding: '8px', color: '#94a3b8' }}>{wpt.dist}</td>
                        <td style={{ padding: '8px', color: '#10b981' }}>{wpt.fuelBurn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* METAR & TAF INFO */}
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '10px', border: '1px solid #1e293b' }}>
              <h3 style={{ marginTop: 0, color: '#f59e0b', fontSize: '15px' }}>Weather Info (METAR / TAF) - {flightData.dep} & {flightData.arr}</h3>
              <div style={{ fontFamily: 'monospace', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ backgroundColor: '#1e293b', padding: '10px', borderRadius: '6px' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>[DEP] {AIRPORT_DATABASE[flightData.dep]?.name || flightData.dep}:</span>
                  <p style={{ margin: '5px 0 0 0', color: '#10b981' }}>{AIRPORT_DATABASE[flightData.dep]?.metar || "METAR NO DISPONIBLE"}</p>
                </div>
                <div style={{ backgroundColor: '#1e293b', padding: '10px', borderRadius: '6px' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>[ARR] {AIRPORT_DATABASE[flightData.arr]?.name || flightData.arr}:</span>
                  <p style={{ margin: '5px 0 0 0', color: '#10b981' }}>{AIRPORT_DATABASE[flightData.arr]?.metar || "METAR NO DISPONIBLE"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODULO 2: PERFORMANCE ================= */}
        {activeTab === 'performance' && (
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <h2 style={{ marginTop: 0, color: '#f59e0b', fontSize: '18px' }}>Takeoff Performance & V-Speeds (A320 CFM56)</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              
              {/* Entradas de Configuración */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>ESTADO PISTA</label>
                  <select value={perfData.rwyCondition} onChange={e => setPerfData({...perfData, rwyCondition: e.target.value})} style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }}>
                    <option value="DRY">DRY (Seca)</option>
                    <option value="WET">WET (Mojada)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>CONFIGURACIÓN FLAPS</label>
                  <select value={perfData.flaps} onChange={e => setPerfData({...perfData, flaps: e.target.value})} style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }}>
                    <option value="1+F">CONF 1+F</option>
                    <option value="2">CONF 2</option>
                    <option value="3">CONF 3</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>FLEX TEMP (°C)</label>
                  <input type="number" value={perfData.flexTemp} onChange={e => setPerfData({...perfData, flexTemp: e.target.value})} style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>VIENTO CALCULADO</label>
                  <input type="text" value={perfData.wind} onChange={e => setPerfData({...perfData, wind: e.target.value})} style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }} />
                </div>
              </div>

              {/* Salida V-Speeds Calculadas */}
              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#38bdf8', fontSize: '14px', textAlign: 'center' }}>TARGET V-SPEEDS</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', textAlign: 'center' }}>
                  <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px', border: '1px solid #38bdf8' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>V1</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{calculatedV1}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>KTS</div>
                  </div>
                  <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px', border: '1px solid #38bdf8' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>VR</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#38bdf8' }}>{calculatedVR}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>KTS</div>
                  </div>
                  <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px', border: '1px solid #38bdf8' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>V2</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{calculatedV2}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>KTS</div>
                  </div>
                </div>

                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#0f172a', borderRadius: '6px', fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
                  <div>TOW ESTIMADO: <span style={{ color: '#fff' }}>{takeOffWeight} KG</span></div>
                  <div>TRANSIT ALT: <span style={{ color: '#fff' }}>6000 FT</span></div>
                  <div>THR RED / ACCEL: <span style={{ color: '#fff' }}>1500 / 3000 FT</span></div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= MODULO 3: PESO Y BALANCE ================= */}
        {activeTab === 'payload' && (
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <h2 style={{ marginTop: 0, color: '#f59e0b', fontSize: '18px' }}>Calculadora de Peso, Carga & Balance</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>
                    Pasajeros a Bordo ({paxCount} PAX)
                  </label>
                  <input type="range" min="0" max="180" value={paxCount} onChange={e => setPaxCount(Number(e.target.value))} style={{ width: '100%' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>
                    Carga / Bodegas (KG)
                  </label>
                  <input type="number" value={cargoKg} onChange={e => setCargoKg(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>
                    Fuel On Board - FOB (KG)
                  </label>
                  <input type="number" value={fuelFobKg} onChange={e => setFuelFobKg(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }} />
                </div>

                <div style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>BOW (Dry Operating):</span> <span>42,500 KG</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>PAYLOAD TOTAL:</span> <span style={{ color: '#38bdf8' }}>{totalPayload} KG</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>ZFW (Max 62,500):</span> <span style={{ color: zeroFuelWeight > 62500 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{zeroFuelWeight} KG</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>TOW (Max 77,000):</span> <span style={{ color: takeOffWeight > 77000 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{takeOffWeight} KG</span>
                  </div>
                </div>
              </div>

              {/* Grafico Envelope CG */}
              <div>
                <h3 style={{ marginTop: 0, color: '#38bdf8', fontSize: '13px' }}>Centro de Gravedad (CG Diagram)</h3>
                <WeightBalanceEnvelope zfw={zeroFuelWeight} tow={takeOffWeight} />
              </div>

            </div>
          </div>
        )}

        {/* ================= MODULO 4: CARTAS Y MAPAS ================= */}
        {activeTab === 'charts' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.keys(AIRPORT_DATABASE).map(icao => (
                <button
                  key={icao}
                  onClick={() => setSelectedAirport(icao)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: selectedAirport === icao ? '#38bdf8' : '#1e293b',
                    color: selectedAirport === icao ? '#000' : '#38bdf8',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {icao} - {AIRPORT_DATABASE[icao].name.split(' ')[0]}
                </button>
              ))}
            </div>

            <AirportCanvasChart selectedIcao={selectedAirport} />
          </div>
        )}

        {/* ================= MODULO 5: CHECKLISTS ================= */}
        {activeTab === 'checklist' && (
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <h2 style={{ marginTop: 0, color: '#f59e0b', fontSize: '18px' }}>Airbus A320 Normal Checklists</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              
              <div>
                <h3 style={{ color: '#38bdf8', fontSize: '14px', borderBottom: '1px solid #334155', paddingBottom: '5px' }}>BEFORE PUSHBACK / START</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {checklists.beforePush.map(item => (
                    <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', backgroundColor: '#1e293b', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                      <input type="checkbox" checked={item.checked} onChange={() => toggleCheck('beforePush', item.id)} />
                      <span style={{ textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? '#94a3b8' : '#fff' }}>{item.text}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ color: '#38bdf8', fontSize: '14px', borderBottom: '1px solid #334155', paddingBottom: '5px' }}>AFTER ENGINE START</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {checklists.afterStart.map(item => (
                    <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', backgroundColor: '#1e293b', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                      <input type="checkbox" checked={item.checked} onChange={() => toggleCheck('afterStart', item.id)} />
                      <span style={{ textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? '#94a3b8' : '#fff' }}>{item.text}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ color: '#38bdf8', fontSize: '14px', borderBottom: '1px solid #334155', paddingBottom: '5px' }}>BEFORE TAKEOFF</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {checklists.beforeTakeoff.map(item => (
                    <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', backgroundColor: '#1e293b', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                      <input type="checkbox" checked={item.checked} onChange={() => toggleCheck('beforeTakeoff', item.id)} />
                      <span style={{ textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? '#94a3b8' : '#fff' }}>{item.text}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
