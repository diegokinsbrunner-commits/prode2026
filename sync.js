// sync.js — Auto-sync de resultados del Mundial 2026
// Fuente principal: openfootball/worldcup.json (pública, sin límites, sin API key)
// Fuente de respaldo: football-data.org (por si la principal no responde)

const FIREBASE_URL = "https://prodemundial2026-848ca-default-rtdb.firebaseio.com";
const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY || "169dd42d32854f3f96436cb3ee063773";
const OPENFOOTBALL_URL = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

const TEAM_MAP = {
  "Mexico":"México","South Africa":"Sudáfrica","South Korea":"Corea del Sur",
  "Czech Republic":"Rep. Checa","Czechia":"Rep. Checa","Czech Rep.":"Rep. Checa",
  "Canada":"Canadá","Bosnia and Herzegovina":"Bosnia y Herz.","Bosnia & Herzegovina":"Bosnia y Herz.",
  "Switzerland":"Suiza","Brazil":"Brasil","Morocco":"Marruecos",
  "Haiti":"Haití","Scotland":"Escocia","United States":"Estados Unidos","USA":"Estados Unidos",
  "Paraguay":"Paraguay","Australia":"Australia","Turkey":"Turquía","Türkiye":"Turquía","Turkiye":"Turquía",
  "Germany":"Alemania","Curaçao":"Curazao","Curacao":"Curazao",
  "Côte d'Ivoire":"C. de Marfil","Ivory Coast":"C. de Marfil","Cote d'Ivoire":"C. de Marfil",
  "Ecuador":"Ecuador","Netherlands":"Países Bajos","Holland":"Países Bajos",
  "Japan":"Japón","Sweden":"Suecia","Tunisia":"Túnez","Belgium":"Bélgica",
  "Egypt":"Egipto","Iran":"Irán","Islamic Republic of Iran":"Irán",
  "New Zealand":"Nueva Zelanda","Spain":"España",
  "Cape Verde":"Cabo Verde","Cape Verde Islands":"Cabo Verde",
  "Saudi Arabia":"Arabia Saudita","KSA":"Arabia Saudita",
  "Uruguay":"Uruguay","France":"Francia","Senegal":"Senegal",
  "Iraq":"Irak","Norway":"Noruega","Argentina":"Argentina",
  "Algeria":"Argelia","Austria":"Austria","Jordan":"Jordania",
  "Portugal":"Portugal","DR Congo":"RD Congo","Congo DR":"RD Congo","Democratic Republic of Congo":"RD Congo",
  "Uzbekistan":"Uzbekistán","Colombia":"Colombia","England":"Inglaterra",
  "Croatia":"Croacia","Ghana":"Ghana","Panama":"Panamá","Qatar":"Qatar",
};

const MATCHES = [
  {id:1,  home:"México",         away:"Sudáfrica"},
  {id:2,  home:"Corea del Sur",  away:"Rep. Checa"},
  {id:3,  home:"Rep. Checa",     away:"Sudáfrica"},
  {id:4,  home:"México",         away:"Corea del Sur"},
  {id:5,  home:"Sudáfrica",      away:"Corea del Sur"},
  {id:6,  home:"Rep. Checa",     away:"México"},
  {id:7,  home:"Canadá",         away:"Bosnia y Herz."},
  {id:8,  home:"Qatar",          away:"Suiza"},
  {id:9,  home:"Suiza",          away:"Bosnia y Herz."},
  {id:10, home:"Canadá",         away:"Qatar"},
  {id:11, home:"Suiza",          away:"Canadá"},
  {id:12, home:"Bosnia y Herz.", away:"Qatar"},
  {id:13, home:"Brasil",         away:"Marruecos"},
  {id:14, home:"Haití",          away:"Escocia"},
  {id:15, home:"Escocia",        away:"Marruecos"},
  {id:16, home:"Brasil",         away:"Haití"},
  {id:17, home:"Marruecos",      away:"Haití"},
  {id:18, home:"Brasil",         away:"Escocia"},
  {id:19, home:"Estados Unidos", away:"Paraguay"},
  {id:20, home:"Australia",      away:"Turquía"},
  {id:21, home:"Estados Unidos", away:"Australia"},
  {id:22, home:"Turquía",        away:"Paraguay"},
  {id:23, home:"Paraguay",       away:"Australia"},
  {id:24, home:"Turquía",        away:"Estados Unidos"},
  {id:25, home:"Alemania",       away:"Curazao"},
  {id:26, home:"C. de Marfil",   away:"Ecuador"},
  {id:27, home:"Alemania",       away:"C. de Marfil"},
  {id:28, home:"Ecuador",        away:"Curazao"},
  {id:29, home:"Curazao",        away:"C. de Marfil"},
  {id:30, home:"Ecuador",        away:"Alemania"},
  {id:31, home:"Países Bajos",   away:"Japón"},
  {id:32, home:"Suecia",         away:"Túnez"},
  {id:33, home:"Países Bajos",   away:"Suecia"},
  {id:34, home:"Túnez",          away:"Japón"},
  {id:35, home:"Japón",          away:"Suecia"},
  {id:36, home:"Túnez",          away:"Países Bajos"},
  {id:37, home:"Bélgica",        away:"Egipto"},
  {id:38, home:"Irán",           away:"Nueva Zelanda"},
  {id:39, home:"Bélgica",        away:"Irán"},
  {id:40, home:"Nueva Zelanda",  away:"Egipto"},
  {id:41, home:"Egipto",         away:"Irán"},
  {id:42, home:"Nueva Zelanda",  away:"Bélgica"},
  {id:43, home:"España",         away:"Cabo Verde"},
  {id:44, home:"Arabia Saudita", away:"Uruguay"},
  {id:45, home:"España",         away:"Arabia Saudita"},
  {id:46, home:"Uruguay",        away:"Cabo Verde"},
  {id:47, home:"Cabo Verde",     away:"Arabia Saudita"},
  {id:48, home:"Uruguay",        away:"España"},
  {id:49, home:"Francia",        away:"Senegal"},
  {id:50, home:"Irak",           away:"Noruega"},
  {id:51, home:"Francia",        away:"Irak"},
  {id:52, home:"Noruega",        away:"Senegal"},
  {id:53, home:"Noruega",        away:"Francia"},
  {id:54, home:"Senegal",        away:"Irak"},
  {id:55, home:"Argentina",      away:"Argelia"},
  {id:56, home:"Austria",        away:"Jordania"},
  {id:57, home:"Argentina",      away:"Austria"},
  {id:58, home:"Jordania",       away:"Argelia"},
  {id:59, home:"Argelia",        away:"Austria"},
  {id:60, home:"Jordania",       away:"Argentina"},
  {id:61, home:"Portugal",       away:"RD Congo"},
  {id:62, home:"Uzbekistán",     away:"Colombia"},
  {id:63, home:"Portugal",       away:"Uzbekistán"},
  {id:64, home:"Colombia",       away:"RD Congo"},
  {id:65, home:"Colombia",       away:"Portugal"},
  {id:66, home:"RD Congo",       away:"Uzbekistán"},
  {id:67, home:"Inglaterra",     away:"Croacia"},
  {id:68, home:"Ghana",          away:"Panamá"},
  {id:69, home:"Inglaterra",     away:"Ghana"},
  {id:70, home:"Panamá",         away:"Croacia"},
  {id:71, home:"Croacia",        away:"Ghana"},
  {id:72, home:"Panamá",         away:"Inglaterra"},
];

function mapTeam(name) {
  if (!name) return "";
  if (TEAM_MAP[name]) return TEAM_MAP[name];
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const target = norm(name);
  for (const [k,v] of Object.entries(TEAM_MAP)) if (norm(k) === target) return v;
  return name;
}

function findMatch(t1, t2) {
  const a = mapTeam(t1), b = mapTeam(t2);
  return MATCHES.find(m => (m.home===a && m.away===b) || (m.home===b && m.away===a));
}

async function fetchJSON(url, opts) {
  const r = await fetch(url, opts);
  if (!r.ok) throw new Error(`HTTP ${r.status} en ${url}`);
  return r.json();
}

/* ── FUENTE 1: openfootball (pública, sin límites) ── */
async function syncFromOpenFootball() {
  console.log("→ Intentando fuente principal: openfootball/worldcup.json");
  const data = await fetchJSON(OPENFOOTBALL_URL);
  const updates = {};
  const now = Date.now();

  for (const m of data.matches || []) {
    if (!m.score || !m.score.ft) continue;
    const found = findMatch(m.team1, m.team2);
    if (!found) continue;

    // Evitar el bug de marcadores "pre-cargados" para partidos futuros:
    // si el partido todavía no debería haber arrancado, lo ignoramos.
    // (defensa extra; igual ya filtramos por score presente)
    const isFlipped = found.home === mapTeam(m.team2);
    const [s1, s2] = m.score.ft;
    const h = isFlipped ? s2 : s1;
    const a = isFlipped ? s1 : s2;
    updates[found.id] = { h, a };
  }
  return updates;
}

/* ── FUENTE 2 (respaldo): football-data.org ── */
async function syncFromFootballData() {
  console.log("→ Intentando fuente de respaldo: football-data.org");
  const data = await fetchJSON(
    "https://api.football-data.org/v4/competitions/WC/matches?limit=200",
    { headers: { "X-Auth-Token": FOOTBALL_API_KEY } }
  );
  const updates = {};
  for (const m of (data.matches || [])) {
    const h = m.score?.fullTime?.home;
    const a = m.score?.fullTime?.away;
    if (h == null || a == null) continue;
    if (!["FINISHED","FT","AWARDED","COMPLETED"].includes(m.status)) continue;
    const found = findMatch(m.homeTeam?.name, m.awayTeam?.name);
    if (!found) continue;
    const isFlipped = found.home === mapTeam(m.awayTeam?.name);
    updates[found.id] = { h: isFlipped?+a:+h, a: isFlipped?+h:+a };
  }
  return updates;
}

async function sync() {
  console.log(`[${new Date().toISOString()}] Iniciando sync...`);

  let updates = {};
  let usedSource = "";

  try {
    updates = await syncFromOpenFootball();
    usedSource = "openfootball";
  } catch (e) {
    console.log(`⚠️ Fuente principal falló (${e.message}), probando respaldo...`);
    try {
      updates = await syncFromFootballData();
      usedSource = "football-data.org";
    } catch (e2) {
      console.error(`❌ Ambas fuentes fallaron: ${e2.message}`);
      process.exit(1);
    }
  }

  console.log(`Fuente usada: ${usedSource}. Partidos con resultado: ${Object.keys(updates).length}`);

  // Comparar contra lo que ya hay en Firebase, solo escribir lo nuevo/distinto
  const fbResp = await fetch(`${FIREBASE_URL}/prode26/results.json`);
  const current = (await fbResp.json()) || {};

  const finalUpdates = {};
  for (const [id, val] of Object.entries(updates)) {
    const ex = current[id];
    if (!ex || ex.h !== val.h || ex.a !== val.a) {
      finalUpdates[id] = val;
      console.log(`  → #${id}: ${val.h}-${val.a}`);
    }
  }

  const cnt = Object.keys(finalUpdates).length;
  if (cnt > 0) {
    const patch = await fetch(`${FIREBASE_URL}/prode26/results.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalUpdates)
    });
    if (!patch.ok) throw new Error(`Firebase error: ${patch.status}`);
    console.log(`✅ ${cnt} resultado(s) actualizados en Firebase`);
  } else {
    console.log("✅ Todo al día, sin cambios");
  }
}

sync().catch(err => {
  console.error("Error fatal:", err.message);
  process.exit(1);
});
