// sync.js — Auto-sync de resultados del Mundial 2026
// Corre automáticamente via GitHub Actions cada 10 minutos

const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY || "169dd42d32854f3f96436cb3ee063773";
const FIREBASE_URL = "https://prodemundial2026-848ca-default-rtdb.firebaseio.com";

const TEAM_MAP = {
  "Mexico":"México","South Africa":"Sudáfrica","South Korea":"Corea del Sur",
  "Czech Republic":"Rep. Checa","Czechia":"Rep. Checa",
  "Canada":"Canadá","Bosnia and Herzegovina":"Bosnia y Herz.",
  "Switzerland":"Suiza","Brazil":"Brasil","Morocco":"Marruecos",
  "Haiti":"Haití","Scotland":"Escocia","United States":"Estados Unidos",
  "Paraguay":"Paraguay","Australia":"Australia","Turkey":"Turquía","Türkiye":"Turquía",
  "Germany":"Alemania","Curaçao":"Curazao","Curacao":"Curazao",
  "Côte d'Ivoire":"C. de Marfil","Ivory Coast":"C. de Marfil",
  "Ecuador":"Ecuador","Netherlands":"Países Bajos","Japan":"Japón",
  "Sweden":"Suecia","Tunisia":"Túnez","Belgium":"Bélgica",
  "Egypt":"Egipto","Iran":"Irán","New Zealand":"Nueva Zelanda",
  "Spain":"España","Cape Verde":"Cabo Verde","Saudi Arabia":"Arabia Saudita",
  "Uruguay":"Uruguay","France":"Francia","Senegal":"Senegal",
  "Iraq":"Irak","Norway":"Noruega","Argentina":"Argentina",
  "Algeria":"Argelia","Austria":"Austria","Jordan":"Jordania",
  "Portugal":"Portugal","DR Congo":"RD Congo","Congo DR":"RD Congo",
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

async function sync() {
  console.log(`[${new Date().toISOString()}] Iniciando sync...`);

  // 1. Buscar partidos finalizados en football-data.org
  const apiRes = await fetch(
    "https://api.football-data.org/v4/competitions/WC/matches?status=FINISHED",
    { headers: { "X-Auth-Token": FOOTBALL_API_KEY } }
  );

  if (!apiRes.ok) {
    console.error(`Error API: ${apiRes.status} ${await apiRes.text()}`);
    process.exit(1);
  }

  const apiData = await apiRes.json();
  const apiMatches = apiData.matches || [];
  console.log(`Partidos finalizados en API: ${apiMatches.length}`);

  // 2. Obtener resultados actuales de Firebase
  const fbRes = await fetch(`${FIREBASE_URL}/prode26/results.json`);
  const currentResults = (await fbRes.json()) || {};

  // 3. Calcular diferencias
  const updates = {};
  for (const m of apiMatches) {
    const h = m.score?.fullTime?.home ?? m.score?.fullTime?.homeTeam;
    const a = m.score?.fullTime?.away ?? m.score?.fullTime?.awayTeam;
    if (h == null || a == null) continue;

    const apiHome = TEAM_MAP[m.homeTeam?.name] || m.homeTeam?.name || "";
    const apiAway = TEAM_MAP[m.awayTeam?.name] || m.awayTeam?.name || "";

    const found = MATCHES.find(x =>
      (x.home === apiHome && x.away === apiAway) ||
      (x.home === apiAway && x.away === apiHome)
    );
    if (!found) {
      console.log(`  Sin mapear: ${m.homeTeam?.name} vs ${m.awayTeam?.name}`);
      continue;
    }

    const isFlipped = found.home === apiAway;
    const fh = isFlipped ? a : h;
    const fa = isFlipped ? h : a;

    const ex = currentResults[found.id];
    if (!ex || ex.h !== fh || ex.a !== fa) {
      updates[found.id] = { h: fh, a: fa };
      console.log(`  → Actualizar: ${found.home} ${fh}-${fa} ${found.away}`);
    }
  }

  // 4. Guardar en Firebase
  if (Object.keys(updates).length > 0) {
    const patchRes = await fetch(`${FIREBASE_URL}/prode26/results.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    if (patchRes.ok) {
      console.log(`✅ ${Object.keys(updates).length} resultados actualizados en Firebase`);
    } else {
      console.error(`Error Firebase: ${patchRes.status}`);
    }
  } else {
    console.log("✅ Todo al día, sin cambios");
  }
}

sync().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
