// sync.js — Auto-sync de resultados del Mundial 2026
// Corre automáticamente via GitHub Actions cada 10 minutos

const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY || "169dd42d32854f3f96436cb3ee063773";
const FIREBASE_URL = "https://prodemundial2026-848ca-default-rtdb.firebaseio.com";

// Mapeo ampliado de nombres (inglés API → español app)
const TEAM_MAP = {
  "Mexico":"México","South Africa":"Sudáfrica","South Korea":"Corea del Sur",
  "Czech Republic":"Rep. Checa","Czechia":"Rep. Checa","Czech Rep.":"Rep. Checa",
  "Canada":"Canadá","Bosnia and Herzegovina":"Bosnia y Herz.","Bosnia & Herzegovina":"Bosnia y Herz.",
  "Switzerland":"Suiza","Brazil":"Brasil","Morocco":"Marruecos",
  "Haiti":"Haití","Scotland":"Escocia","United States":"Estados Unidos","USA":"Estados Unidos",
  "Paraguay":"Paraguay","Australia":"Australia","Turkey":"Turquía","Türkiye":"Turquía","Turkiye":"Turquía",
  "Germany":"Alemania","Curaçao":"Curazao","Curacao":"Curazao","Curaçao":"Curazao",
  "Côte d'Ivoire":"C. de Marfil","Ivory Coast":"C. de Marfil","Cote d'Ivoire":"C. de Marfil",
  "Ecuador":"Ecuador","Netherlands":"Países Bajos","Holland":"Países Bajos",
  "Japan":"Japón","Sweden":"Suecia","Tunisia":"Túnez","Belgium":"Bélgica",
  "Egypt":"Egipto","Iran":"Irán","Islamic Republic of Iran":"Irán",
  "New Zealand":"Nueva Zelanda","Spain":"España",
  "Cape Verde":"Cabo Verde","Cabo Verde":"Cabo Verde","Cape Verde Islands":"Cabo Verde",
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
  // Prueba directa
  if (TEAM_MAP[name]) return TEAM_MAP[name];
  // Prueba sin tildes / case-insensitive
  const normalized = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  for (const [key, val] of Object.entries(TEAM_MAP)) {
    const k = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    if (k === normalized) return val;
  }
  return name; // devuelve original si no encuentra
}

async function fetchWithRetry(url, options, retries=3) {
  for (let i=0; i<retries; i++) {
    try {
      const r = await fetch(url, options);
      if (r.ok) return r;
      if (r.status === 429) { // rate limit
        await new Promise(res => setTimeout(res, 60000));
        continue;
      }
      throw new Error(`HTTP ${r.status}`);
    } catch(e) {
      if (i === retries-1) throw e;
      await new Promise(res => setTimeout(res, 2000 * (i+1)));
    }
  }
}

async function sync() {
  console.log(`[${new Date().toISOString()}] Iniciando sync...`);

  // 1. Obtener TODOS los partidos del Mundial (sin filtrar por status)
  //    Usamos limit=200 para evitar paginación
  const apiUrl = "https://api.football-data.org/v4/competitions/WC/matches?limit=200";
  const resp = await fetchWithRetry(apiUrl, {
    headers: { "X-Auth-Token": FOOTBALL_API_KEY }
  });

  const data = await resp.json();
  const allMatches = data.matches || [];
  console.log(`Total partidos en API: ${allMatches.length}`);

  // 2. Filtrar solo los que tienen marcador final (independiente del status)
  const finishedMatches = allMatches.filter(m => {
    const h = m.score?.fullTime?.home ?? m.score?.fullTime?.homeTeam;
    const a = m.score?.fullTime?.away ?? m.score?.fullTime?.awayTeam;
    return h != null && a != null &&
           ["FINISHED","FT","AWARDED","COMPLETED"].includes(m.status);
  });
  console.log(`Partidos con resultado: ${finishedMatches.length}`);

  // 3. Obtener resultados actuales de Firebase
  const fbResp = await fetch(`${FIREBASE_URL}/prode26/results.json`);
  const currentResults = (await fbResp.json()) || {};

  // 4. Calcular actualizaciones necesarias
  const updates = {};
  const noMatch = [];

  for (const m of finishedMatches) {
    const h = m.score?.fullTime?.home ?? m.score?.fullTime?.homeTeam;
    const a = m.score?.fullTime?.away ?? m.score?.fullTime?.awayTeam;

    const apiHome = mapTeam(m.homeTeam?.name || m.homeTeam?.shortName || "");
    const apiAway = mapTeam(m.awayTeam?.name || m.awayTeam?.shortName || "");

    const found = MATCHES.find(x =>
      (x.home === apiHome && x.away === apiAway) ||
      (x.home === apiAway && x.away === apiHome)
    );

    if (!found) {
      noMatch.push(`${m.homeTeam?.name} vs ${m.awayTeam?.name}`);
      continue;
    }

    const isFlipped = found.home === apiAway;
    const fh = isFlipped ? +a : +h;
    const fa = isFlipped ? +h : +a;

    const ex = currentResults[found.id];
    if (!ex || ex.h !== fh || ex.a !== fa) {
      updates[found.id] = { h: fh, a: fa };
      console.log(`  → ${found.home} ${fh}-${fa} ${found.away}`);
    }
  }

  if (noMatch.length > 0) {
    console.log(`Sin mapeo (${noMatch.length}): ${noMatch.join(" | ")}`);
  }

  // 5. Guardar en Firebase
  const cnt = Object.keys(updates).length;
  if (cnt > 0) {
    const patchResp = await fetch(`${FIREBASE_URL}/prode26/results.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    if (patchResp.ok) {
      console.log(`✅ ${cnt} resultado${cnt>1?"s":""} actualizados en Firebase`);
    } else {
      throw new Error(`Firebase error: ${patchResp.status}`);
    }
  } else {
    console.log("✅ Todo al día, sin cambios");
  }
}

sync().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
