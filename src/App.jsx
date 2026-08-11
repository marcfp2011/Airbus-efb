import React, { useState, useEffect } from 'react';
import { 
  BatteryCharging, CheckSquare, Search, Compass, ZoomIn, ZoomOut 
} from 'lucide-react';

export default function AirbusEFBApp() {
  const [activeTab, setActiveTab] = useState('takeoff');

  // Reloj Zulu en tiempo real
  const [timeZulu, setTimeZulu] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeZulu(now.toISOString().substring(11, 19) + ' Z');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // BASE DE DATOS DE AEROPUERTOS DISPONIBLES
  const AIRPORTS_LIST = [
    { name: 'Madrid-Barajas', icao: 'LEMD', elev: '2,000 FT', rwy: '36L/18R 4,179M', mag: '2° W', trans: '6000 FT' },
    { name: 'Barcelona-El Prat', icao: 'LEBL', elev: '12 FT', rwy: '24L/06R 2,660M', mag: '1° E', trans: '6000 FT' },
    { name: 'Palma de Mallorca', icao: 'LEPA', elev: '27 FT', rwy: '24R/06L 3,270M', mag: '2° E', trans: '6000 FT' },
    { name: 'Ibiza', icao: 'LEIB', elev: '24 FT', rwy: '06/24 2,800M', mag: '2° E', trans: '6000 FT' },
    { name: 'Menorca', icao: 'LEMH', elev: '303 FT', rwy: '01/19 2,550M', mag: '2° E', trans: '6000 FT' },
    { name: 'Reus', icao: 'LERS', elev: '234 FT', rwy: '07/25 2,459M', mag: '1° E', trans: '6000 FT' },
    { name: 'Toulouse-Blagnac', icao: 'LFBO', elev: '499 FT', rwy: '14R/32L 3,500M', mag: '1° E', trans: '5000 FT' },
  ];

  // RUTA Y AEROPUERTOS
  const [selectedAirportIndex, setSelectedAirportIndex] = useState(0); // Madrid por defecto
  const currentAirport = AIRPORTS_LIST[selectedAirportIndex];

  const [origin, setOrigin] = useState(currentAirport.icao);
  const [destination, setDestination] = useState('EGLL');

  // Cambiar origen cuando se selecciona un aeropuerto en Charts
  const handleAirportSelect = (index) => {
    setSelectedAirportIndex(index);
    setOrigin(AIRPORTS_LIST[index].icao);
  };

  // PERF TAKEOFF
  const [runway, setRunway] = useState('36L');
  const [runwayCondition, setRunwayCondition] = useState('DRY');
  const [windDirection, setWindDirection] = useState(220);
  const [windSpeed, setWindSpeed] = useState(15);
  const [oat, setOat] = useState(16);
  const [qnh, setQnh] = useState(1025);
  const [tow, setTow] = useState(64.2);
  const [flaps, setFlaps] = useState('CONF 2');

  const [v1, setV1] = useState(142);
  const [vr, setVr] = useState(145);
  const [v2, setV2] = useState(149);
  const [flexTemp, setFlexTemp] = useState(58);
  const [stopMargin, setStopMargin] = useState(1420);
  const [mcduSent, setMcduSent] = useState(false);

  useEffect(() => {
    const weightFactor = (tow - 60) * 1.2;
    const flapFactor = flaps === 'CONF 1+F' ? 3 : flaps === 'CONF 2' ? 0 : -2;
    const envFactor = (oat - 15) * 0.2;

    const calculatedV1 = Math.round(135 + weightFactor + flapFactor + envFactor);
    const calculatedVR = Math.round(calculatedV1 + 3);
    const calculatedV2 = Math.round(calculatedVR + 4);
    
    const calculatedFlex = Math.round(68 - (tow - 50) * 0.7 - (oat > 15 ? (oat - 15) * 0.5 : 0));
    const calculatedMargin = Math.round(4179 - (2200 + (tow - 50) * 35));

    setV1(calculatedV1);
    setVr(calculatedVR);
    setV2(calculatedV2);
    setFlexTemp(Math.max(calculatedFlex, oat + 10));
    setStopMargin(Math.max(calculatedMargin, 200));
  }, [tow, flaps, oat, runwayCondition, windSpeed]);

  // LOAD & FUEL
  const [paxCount, setPaxCount] = useState(150);
  const [cargoWeight, setCargoWeight] = useState(2.5);
  const [blockFuel, setBlockFuel] = useState(9.8);
  const oew = 42.5;
  const zfw = (oew + (paxCount * 0.084) + cargoWeight).toFixed(1);
  const calculatedTOW = (parseFloat(zfw) + blockFuel).toFixed(1);

  // CHECKLISTS COMPLETAS (14 FASES)
  const [activeChecklistTab, setActiveChecklistTab] = useState('cockpitPreflight');
  const [checklists, setChecklists] = useState({
    cockpitPreflight: [
      { id: 1, text: 'GEAR PINS & COVERS ............. REMOVED & STOWED', checked: false },
      { id: 2, text: 'BATTERIES ...................... CHECKED / AUTO', checked: false },
      { id: 3, text: 'APU FIRE TEST .................. COMPLETED', checked: false },
      { id: 4, text: 'APU ............................ START / ON', checked: false }
    ],
    cockpitPrep: [
      { id: 5, text: 'HIGH VOLT / OXY ................ CHECKED', checked: false },
      { id: 6, text: 'ADIRS .......................... NAV', checked: false },
      { id: 7, text: 'EXT POWER ...................... AS REQ', checked: false },
      { id: 8, text: 'COCKPIT LIGHTS ................. SET', checked: false }
    ],
    mcduSetUp: [
      { id: 9, text: 'INIT A & B ..................... COMPLETED', checked: false },
      { id: 10, text: 'FLIGHT PLAN .................... CHECKED', checked: false },
      { id: 11, text: 'PERF DATA ...................... INSERTED', checked: false },
      { id: 12, text: 'RAD NAV ........................ SET', checked: false }
    ],
    startupPrep: [
      { id: 13, text: 'ATC CLEARANCE .................. OBTAINED', checked: false },
      { id: 14, text: 'DOORS & SLIDES ................. CLOSED / ARMED', checked: false },
      { id: 15, text: 'BEACON LIGHT ................... ON', checked: false },
      { id: 16, text: 'THRUST LEVERS .................. IDLE', checked: false }
    ],
    startup: [
      { id: 17, text: 'ENG MODE SEL ................... IGN / START', checked: false },
      { id: 18, text: 'ENG 2 MASTER ................... ON', checked: false },
      { id: 19, text: 'ENG 1 MASTER ................... ON', checked: false },
      { id: 20, text: 'PARAMETER CHECK ................ NORMAL', checked: false }
    ],
    beforeTaxi: [
      { id: 21, text: 'ENG MODE SEL ................... NORM', checked: false },
      { id: 22, text: 'APU BLEED / APU ................ OFF', checked: false },
      { id: 23, text: 'ANTI ICE ....................... AS REQ', checked: false },
      { id: 24, text: 'FLAPS .......................... SET FOR T/O', checked: false },
      { id: 25, text: 'PITCH / RUDDER TRIM ............ SET / ZERO', checked: false }
    ],
    beforeTakeoff: [
      { id: 26, text: 'FLIGHT CONTROLS ................ CHECKED', checked: false },
      { id: 27, text: 'FLIGHT INSTRUMENTS ............. CHECKED', checked: false },
      { id: 28, text: 'BRIEFING ....................... CONFIRMED', checked: false },
      { id: 29, text: 'CABIN REPORT ................... READY', checked: false },
      { id: 30, text: 'TCAS / RADAR ................... TA/RA / ON', checked: false }
    ],
    takeoff: [
      { id: 31, text: 'RUNWAY IDENT ................... CONFIRMED', checked: false },
      { id: 32, text: 'PACKS .......................... AS REQ', checked: false },
      { id: 33, text: 'THRUST LEVERS .................. TOGA / FLEX', checked: false }
    ],
    afterTakeoff: [
      { id: 34, text: 'LANDING GEAR ................... UP', checked: false },
      { id: 35, text: 'FLAPS .......................... RETRACTED', checked: false },
      { id: 36, text: 'PACKS .......................... ON', checked: false }
    ],
    climb: [
      { id: 37, text: 'BARO REF (STD) ................. SET HIGH', checked: false },
      { id: 38, text: 'ENG MODE SEL ................... NORM', checked: false },
      { id: 39, text: 'TCAS ........................... TA/RA', checked: false }
    ],
    descent: [
      { id: 40, text: 'PERF APPROACH .................. INSERTED', checked: false },
      { id: 41, text: 'BARO REF ....................... SET LOCAL', checked: false },
      { id: 42, text: 'MINIMUMS ....................... SET', checked: false }
    ],
    approach: [
      { id: 43, text: 'BRIEFING ....................... CONFIRMED', checked: false },
      { id: 44, text: 'ECAM STATUS .................... CHECKED', checked: false },
      { id: 45, text: 'SEAT BELTS ..................... ON', checked: false }
    ],
    afterLanding: [
      { id: 46, text: 'FLAPS .......................... RETRACTED', checked: false },
      { id: 47, text: 'SPOILERS ....................... DISARMED', checked: false },
      { id: 48, text: 'APU ............................ START / ON', checked: false },
      { id: 49, text: 'RADAR / TCAS ................... OFF / STBY', checked: false }
    ],
    shutdown: [
      { id: 50, text: 'PARK BRK / CHOCKS .............. SET / IN', checked: false },
      { id: 51, text: 'ENG MASTER 1 & 2 ............... OFF', checked: false },
      { id: 52, text: 'PAX SIGNS ...................... OFF', checked: false },
      { id: 53, text: 'BATTERIES ...................... OFF / AS REQ', checked: false }
    ]
  });

  const toggleChecklist = (category, id) => {
    setChecklists(prev => ({
      ...prev,
      [category]: prev[category].map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    }));
  };

  // CHARTS INTEGRADO
  const [chartType, setChartType] = useState('TAXI');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [customChartUrl, setCustomChartUrl] = useState('');

  return (
    <div className="w-full h-screen bg-[#070a0f] text-slate-200 font-sans flex flex-col select-none overflow-hidden">
      
      {/* HEADER SUPERIOR */}
      <header className="h-12 bg-gradient-to-b from-[#161c28] to-[#0e131d] border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="bg-cyan-500/10 border border-cyan-400/40 text-cyan-400 font-mono text-xs px-2 py-0.5 rounded font-bold tracking-wide">
            A320neo (PW1100G)
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-400 font-bold">FLT IBE320 |</span>
            <input 
              type="text" 
              value={origin} 
              onChange={e => setOrigin(e.target.value.toUpperCase())}
              className="w-12 bg-[#090d14] border border-slate-700 text-amber-400 font-bold text-center rounded py-0.5 outline-none"
            />
            <span className="text-slate-500">➔</span>
            <input 
              type="text" 
              value={destination} 
              onChange={e => setDestination(e.target.value.toUpperCase())}
              className="w-12 bg-[#090d14] border border-slate-700 text-amber-400 font-bold text-center rounded py-0.5 outline-none"
            />
          </div>
        </div>

        <div className="text-xs font-bold text-slate-400 tracking-widest uppercase hidden md:block">
          AIRBUS FlySmart+ EFB
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> ACARS ONLINE
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 flex items-center gap-1">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400"/> 98%
          </span>
          <span className="bg-[#18202f] border border-slate-700 text-cyan-400 font-bold px-2 py-0.5 rounded min-w-[85px] text-center">
            {timeZulu || '00:00:00 Z'}
          </span>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* BARRA LATERAL NAVEGABLE */}
        <aside className="w-52 bg-[#0d111a] border-r border-slate-800 p-2 flex flex-col justify-between shrink-0">
          <div className="space-y-1">
            {[
              { id: 'takeoff', label: 'PERF TAKEOFF', icon: '🚀' },
              { id: 'landing', label: 'PERF LANDING', icon: '🛬' },
              { id: 'load', label: 'LOAD & FUEL', icon: '⚖️' },
              { id: 'checklists', label: 'CHECKLISTS', icon: '📋' },
              { id: 'charts', label: 'CHARTS & MAPS', icon: '🗺️' },
              { id: 'docs', label: 'FCOM / MEL', icon: '📄' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-500/5 border border-cyan-400/50 text-cyan-400 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'
                }`}
              >
                <span className="text-sm">{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg text-center">
            <div className="text-[9px] text-slate-500 font-mono">AIRBUS EFB OS</div>
            <div className="text-xs text-cyan-400 font-mono font-bold">v3.8.2 REALTIME</div>
          </div>
        </aside>

        {/* CONTENIDOS */}
        <main className="flex-1 p-3 bg-[#070a0f] overflow-y-auto">
          
          {/* PERF TAKEOFF */}
          {activeTab === 'takeoff' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-full">
              <section className="bg-[#111622] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                    <span className="text-xs font-bold text-cyan-400 tracking-wider">ENTORNO Y CONFIGURACIÓN</span>
                    <span className="text-[10px] font-mono text-slate-500">{origin} / {runway}</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">PISTA</span>
                      <select 
                        value={runway} 
                        onChange={e => setRunway(e.target.value)}
                        className="bg-[#090d14] border border-cyan-500/50 text-cyan-400 px-2 py-1 rounded font-bold outline-none cursor-pointer font-mono"
                      >
                        <option value="36L">36L (4,179m)</option>
                        <option value="36R">36R (4,350m)</option>
                        <option value="18L">18L (3,700m)</option>
                      </select>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">ESTADO PISTA</span>
                      <select 
                        value={runwayCondition} 
                        onChange={e => setRunwayCondition(e.target.value)}
                        className="bg-[#090d14] border border-slate-700 text-emerald-400 font-mono px-2 py-1 rounded font-bold outline-none cursor-pointer"
                      >
                        <option value="DRY">DRY / CLEAN</option>
                        <option value="WET">WET / GOOD</option>
                        <option value="CONTAMINATED">STANDING WATER</option>
                      </select>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">VIENTO (° / KT)</span>
                      <div className="flex gap-1 font-mono items-center">
                        <input 
                          type="number" 
                          value={windDirection} 
                          onChange={e => setWindDirection(Number(e.target.value))}
                          className="w-12 bg-[#090d14] border border-slate-700 text-white text-center rounded py-0.5 font-bold outline-none"
                        />
                        <span className="text-slate-600">/</span>
                        <input 
                          type="number" 
                          value={windSpeed} 
                          onChange={e => setWindSpeed(Number(e.target.value))}
                          className="w-12 bg-[#090d14] border border-slate-700 text-white text-center rounded py-0.5 font-bold outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">OAT (°C) / QNH (hPa)</span>
                      <div className="flex gap-1 font-mono">
                        <input 
                          type="number" 
                          value={oat} 
                          onChange={e => setOat(Number(e.target.value))}
                          className="w-12 bg-[#090d14] border border-slate-700 text-white text-center rounded py-0.5 font-bold outline-none"
                        />
                        <input 
                          type="number" 
                          value={qnh} 
                          onChange={e => setQnh(Number(e.target.value))}
                          className="w-14 bg-[#090d14] border border-slate-700 text-white text-center rounded py-0.5 font-bold outline-none"
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-800/80 my-2 pt-2"></div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-bold">TAKEOFF WEIGHT (TOW)</span>
                        <span className="text-amber-400 font-mono font-bold text-sm">{tow} TONS</span>
                      </div>
                      <input 
                        type="range" 
                        min="52" 
                        max="77" 
                        step="0.1" 
                        value={tow} 
                        onChange={e => setTow(Number(e.target.value))}
                        className="w-full accent-amber-500 h-1 bg-slate-800 rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">CONFIG FLAPS</span>
                      <div className="flex gap-1">
                        {['CONF 1+F', 'CONF 2', 'CONF 3'].map(f => (
                          <button
                            key={f}
                            onClick={() => setFlaps(f)}
                            className={`text-[10px] font-mono font-bold px-2 py-1 rounded transition ${
                              flaps === f 
                                ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-400' 
                                : 'bg-[#090d14] border border-slate-800 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-[#111622] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                    <span className="text-xs font-bold text-emerald-400 tracking-wider">PRESTACIONES & VELOCIDADES</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      COMPUTED ✓
                    </span>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/50 rounded-lg p-3 text-center mb-3 shadow-inner">
                    <span className="text-[10px] text-emerald-300 font-bold tracking-wider uppercase">EMPUJE DE DESPEGUE (THRUST)</span>
                    <div className="text-3xl font-mono font-black text-emerald-400 tracking-tight my-0.5">
                      FLEX {flexTemp}°C
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-[#090d14] border border-cyan-500/40 rounded-lg p-2 text-center shadow-lg">
                      <span className="text-[10px] font-bold text-slate-400 block">V1</span>
                      <span className="text-2xl font-mono font-black text-cyan-400 leading-none">{v1}</span>
                      <span className="text-[8px] text-slate-500 block mt-1">KNOTS</span>
                    </div>
                    <div className="bg-[#090d14] border border-cyan-500/40 rounded-lg p-2 text-center shadow-lg">
                      <span className="text-[10px] font-bold text-slate-400 block">VR</span>
                      <span className="text-2xl font-mono font-black text-cyan-400 leading-none">{vr}</span>
                      <span className="text-[8px] text-slate-500 block mt-1">KNOTS</span>
                    </div>
                    <div className="bg-[#090d14] border border-cyan-500/40 rounded-lg p-2 text-center shadow-lg">
                      <span className="text-[10px] font-bold text-slate-400 block">V2</span>
                      <span className="text-2xl font-mono font-black text-cyan-400 leading-none">{v2}</span>
                      <span className="text-[8px] text-slate-500 block mt-1">KNOTS</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setMcduSent(true);
                    setTimeout(() => setMcduSent(false), 3000);
                  }}
                  className={`w-full text-slate-950 font-black text-xs py-3 rounded-lg tracking-wider uppercase shadow-lg transition-all flex items-center justify-center gap-2 ${
                    mcduSent ? 'bg-emerald-400' : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300'
                  }`}
                >
                  {mcduSent ? '✓ ENVIADO A MCDU' : 'ENVIAR A MCDU PRESET'}
                </button>
              </section>

              <section className="bg-[#111622] border border-slate-800 rounded-xl p-3">
                <span className="text-xs font-bold text-amber-400 tracking-wider block mb-3 border-b border-slate-800 pb-2">GRÁFICO DE PISTA Y MARGEN</span>
                <div className="bg-[#090d14] border border-slate-800 rounded-lg p-3 text-center">
                  <span className="text-xs font-mono text-emerald-400 block mb-2">MARGEN DE FRENADO: +{stopMargin} M</span>
                  <div className="w-full bg-slate-800 h-6 rounded flex items-center px-2 relative">
                    <div className="h-2 bg-emerald-500 rounded" style={{ width: `${Math.min(100, (stopMargin / 2000) * 100)}%` }}></div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* PERF LANDING */}
          {activeTab === 'landing' && (
            <div className="bg-[#111622] border border-slate-800 rounded-xl p-4 space-y-4">
              <h2 className="text-sm font-bold text-cyan-400 tracking-wider border-b border-slate-800 pb-2">CÁLCULO DE ATERRIZAJE (PERF LANDING)</h2>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <label className="text-slate-400 block">PESO AL ATERRIZAJE (ESTIMATED LW):</label>
                  <input type="number" defaultValue={60.5} className="bg-[#090d14] border border-slate-700 text-white font-mono px-2 py-1 rounded w-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-400 block">AUTOBRAKE:</label>
                  <select className="bg-[#090d14] border border-slate-700 text-cyan-400 font-mono px-2 py-1 rounded w-full">
                    <option>LOW</option>
                    <option>MEDIUM</option>
                    <option>MAX</option>
                  </select>
                </div>
              </div>
              <div className="bg-[#090d14] border border-emerald-500/30 p-4 rounded-lg text-center">
                <span className="text-xs text-slate-400 block">DISTANCIA DE PARADA REQUERIDA (RLD)</span>
                <span className="text-3xl font-mono font-bold text-emerald-400">1,480 M</span>
                <span className="text-xs text-slate-500 block mt-1">PISTA DISPONIBLE DE {destination}: 3,800 M</span>
              </div>
            </div>
          )}

          {/* LOAD & FUEL */}
          {activeTab === 'load' && (
            <div className="bg-[#111622] border border-slate-800 rounded-xl p-4 space-y-4">
              <h2 className="text-sm font-bold text-amber-400 tracking-wider border-b border-slate-800 pb-2">HOJA DE CARGA Y COMBUSTIBLE</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-2 bg-[#090d14] p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block font-bold">PASAJEROS:</span>
                  <input type="number" value={paxCount} onChange={e => setPaxCount(Number(e.target.value))} className="bg-[#111622] border border-slate-700 text-cyan-400 font-mono px-2 py-1 rounded w-full text-lg" />
                  <span className="text-slate-500 text-[10px] block">150 / 180 PAX</span>
                </div>
                <div className="space-y-2 bg-[#090d14] p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block font-bold">CARGA / CARGO (TONS):</span>
                  <input type="number" step="0.1" value={cargoWeight} onChange={e => setCargoWeight(Number(e.target.value))} className="bg-[#111622] border border-slate-700 text-cyan-400 font-mono px-2 py-1 rounded w-full text-lg" />
                </div>
                <div className="space-y-2 bg-[#090d14] p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block font-bold">BLOCK FUEL (TONS):</span>
                  <input type="number" step="0.1" value={blockFuel} onChange={e => setBlockFuel(Number(e.target.value))} className="bg-[#111622] border border-slate-700 text-amber-400 font-mono px-2 py-1 rounded w-full text-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 font-mono text-center">
                <div className="bg-[#090d14] p-3 rounded border border-slate-800">
                  <span className="text-slate-500 text-xs block">ZERO FUEL WEIGHT (ZFW)</span>
                  <span className="text-2xl font-bold text-white">{zfw} T</span>
                </div>
                <div className="bg-[#090d14] p-3 rounded border border-slate-800">
                  <span className="text-slate-500 text-xs block">CALCULATED TOW</span>
                  <span className="text-2xl font-bold text-amber-400">{calculatedTOW} T</span>
                </div>
              </div>
            </div>
          )}

          {/* CHECKLISTS (14 FASES COMPLETAS) */}
          {activeTab === 'checklists' && (
            <div className="bg-[#111622] border border-slate-800 rounded-xl p-4 space-y-4">
              <h2 className="text-sm font-bold text-cyan-400 tracking-wider border-b border-slate-800 pb-2">LISTAS DE COMPROBACIÓN OPERATIVAS (AIRBUS A320)</h2>
              
              <div className="flex gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto">
                {[
                  { id: 'cockpitPreflight', label: 'COCKPIT PREFLIGHT' },
                  { id: 'cockpitPrep', label: 'COCKPIT PREP' },
                  { id: 'mcduSetUp', label: 'MCDU SET UP' },
                  { id: 'startupPrep', label: 'STARTUP PREP' },
                  { id: 'startup', label: 'STARTUP' },
                  { id: 'beforeTaxi', label: 'BEFORE TAXI' },
                  { id: 'beforeTakeoff', label: 'BEFORE TAKEOFF' },
                  { id: 'takeoff', label: 'TAKEOFF' },
                  { id: 'afterTakeoff', label: 'AFTER TAKEOFF' },
                  { id: 'climb', label: 'CLIMB' },
                  { id: 'descent', label: 'DESCENT' },
                  { id: 'approach', label: 'APPROACH' },
                  { id: 'afterLanding', label: 'AFTER LANDING' },
                  { id: 'shutdown', label: 'SHUTDOWN' },
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveChecklistTab(sub.id)}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-mono font-bold transition whitespace-nowrap ${
                      activeChecklistTab === sub.id
                        ? 'bg-amber-500/20 border border-amber-400 text-amber-400'
                        : 'bg-[#090d14] border border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {checklists[activeChecklistTab]?.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => toggleChecklist(activeChecklistTab, item.id)} 
                    className={`p-3 rounded-lg border text-xs font-mono flex justify-between items-center cursor-pointer transition ${
                      item.checked 
                        ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-400' 
                        : 'bg-[#090d14] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{item.text}</span>
                    <CheckSquare className={`w-5 h-5 ${item.checked ? 'text-emerald-400' : 'text-slate-600'}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CHARTS & MAPS (CON SELECCIÓN DE 7 AEROPUERTOS) */}
          {activeTab === 'charts' && (
            <div className="bg-[#111622] border border-slate-800 rounded-xl p-3 h-full flex flex-col justify-between">
              <div className="space-y-3 flex-1 flex flex-col">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-cyan-400 font-mono">SELECCIÓN DE AEROPUERTO:</span>
                    
                    {/* DESPLEGABLE DE AEROPUERTOS */}
                    <select
                      value={selectedAirportIndex}
                      onChange={e => handleAirportSelect(Number(e.target.value))}
                      className="bg-[#090d14] border border-cyan-500/50 text-amber-400 font-mono text-xs font-bold px-2 py-1 rounded outline-none cursor-pointer"
                    >
                      {AIRPORTS_LIST.map((ap, idx) => (
                        <option key={ap.icao} value={idx}>
                          {ap.name} ({ap.icao})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    {['TAXI', 'SID', 'STAR', 'IAC'].map(t => (
                      <button
                        key={t}
                        onClick={() => setChartType(t)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          chartType === t ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-400' : 'bg-[#090d14] text-slate-500'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                    <button onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2))} className="p-1 bg-[#090d14] rounded border border-slate-800 text-slate-400 hover:text-white">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.6))} className="p-1 bg-[#090d14] rounded border border-slate-800 text-slate-400 hover:text-white">
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* VISOR DIRECTO DENTRO DE LA APLICACIÓN */}
                <div className="flex-1 bg-[#090d14] border border-slate-800 rounded-lg overflow-hidden relative flex flex-col items-center justify-center p-2">
                  {customChartUrl ? (
                    <iframe 
                      src={customChartUrl} 
                      className="w-full h-full border-none"
                      title="Carta Aeronáutica PDF"
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center overflow-auto p-4" style={{ transform: `scale(${zoomLevel})` }}>
                      <div className="w-full max-w-lg bg-[#111622] border border-cyan-500/30 rounded-lg p-4 font-mono text-left space-y-3">
                        <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
                          <span className="text-amber-400 font-bold">{currentAirport.name} ({currentAirport.icao}) - {chartType}</span>
                          <span className="text-slate-500">AIRBUS EFB NAV</span>
                        </div>
                        <div className="h-44 bg-[#070a0f] border border-slate-800 rounded flex items-center justify-center relative overflow-hidden">
                          <div className="w-full h-8 bg-slate-800 border-t-2 border-b-2 border-dashed border-slate-500 flex items-center justify-around">
                            <span className="text-[10px] text-white font-bold tracking-widest">{currentAirport.icao}</span>
                            <span className="text-[10px] text-emerald-400 font-bold">||||||||||||||||||||</span>
                            <span className="text-[10px] text-white font-bold tracking-widest">RWY</span>
                          </div>
                          <div className="absolute top-2 left-2 text-[9px] text-cyan-400">ELEV: {currentAirport.elev}</div>
                          <div className="absolute bottom-2 right-2 text-[9px] text-emerald-400">RWY MAIN: {currentAirport.rwy}</div>
                        </div>
                        <div className="text-[10px] text-slate-400 flex justify-between">
                          <span>TRANS ALT: {currentAirport.trans}</span>
                          <span>MAG VAR: {currentAirport.mag}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    placeholder="Pega aquí la URL directa de una carta en PDF o Imagen para cargarla dentro..." 
                    value={customChartUrl}
                    onChange={e => setCustomChartUrl(e.target.value)}
                    className="flex-1 bg-[#090d14] border border-slate-800 text-xs px-3 py-1.5 rounded text-white outline-none"
                  />
                  {customChartUrl && (
                    <button onClick={() => setCustomChartUrl('')} className="bg-red-500/20 border border-red-500/40 text-red-400 text-xs px-2 py-1 rounded">
                      Limpiar
                    </button>
                  )}
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-500 text-center border-t border-slate-800 pt-2 mt-2">
                AIRAC CYCLE 2026/08 - EMBEDDED NAV SYSTEM
              </div>
            </div>
          )}

          {/* FCOM / MEL */}
          {activeTab === 'docs' && (
            <div className="bg-[#111622] border border-slate-800 rounded-xl p-4 space-y-4">
              <h2 className="text-sm font-bold text-cyan-400 tracking-wider border-b border-slate-800 pb-2">DOCUMENTACIÓN TÉCNICA (FCOM / MEL)</h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Buscar en FCOM, QRH o MEL..." 
                  className="w-full bg-[#090d14] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white outline-none"
                />
              </div>
              <div className="bg-[#090d14] p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-2 text-slate-300">
                <div className="text-amber-400 font-bold">FCOM A320 - LIM-ENGINE-01</div>
                <div>MAX TOGA TIME: 5 MIN (10 MIN ENG OUT)</div>
                <div>MAX EGT TOGA: 1060°C</div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
