// notify.js — Envía notificaciones push automáticas via OneSignal
// Corre via GitHub Actions antes de cada partido del Mundial 2026

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;
const APP_URL = "https://diegokinsbrunner-commits.github.io/prode2026";

// Partidos del Mundial 2026 con horarios en hora argentina (UTC-3)
const MATCHES = [
  {id:1,  date:"11/06",time:"16:00",home:"México",         away:"Sudáfrica"},
  {id:2,  date:"11/06",time:"23:00",home:"Corea del Sur",  away:"Rep. Checa"},
  {id:3,  date:"18/06",time:"13:00",home:"Rep. Checa",     away:"Sudáfrica"},
  {id:4,  date:"18/06",time:"22:00",home:"México",         away:"Corea del Sur"},
  {id:5,  date:"24/06",time:"22:00",home:"Sudáfrica",      away:"Corea del Sur"},
  {id:6,  date:"24/06",time:"22:00",home:"Rep. Checa",     away:"México"},
  {id:7,  date:"12/06",time:"16:00",home:"Canadá",         away:"Bosnia y Herz."},
  {id:8,  date:"13/06",time:"16:00",home:"Qatar",          away:"Suiza"},
  {id:9,  date:"18/06",time:"16:00",home:"Suiza",          away:"Bosnia y Herz."},
  {id:10, date:"18/06",time:"19:00",home:"Canadá",         away:"Qatar"},
  {id:11, date:"24/06",time:"16:00",home:"Suiza",          away:"Canadá"},
  {id:12, date:"24/06",time:"16:00",home:"Bosnia y Herz.", away:"Qatar"},
  {id:13, date:"13/06",time:"19:00",home:"Brasil",         away:"Marruecos"},
  {id:14, date:"13/06",time:"22:00",home:"Haití",          away:"Escocia"},
  {id:15, date:"19/06",time:"19:00",home:"Escocia",        away:"Marruecos"},
  {id:16, date:"19/06",time:"21:30",home:"Brasil",         away:"Haití"},
  {id:17, date:"24/06",time:"19:00",home:"Marruecos",      away:"Haití"},
  {id:18, date:"24/06",time:"19:00",home:"Brasil",         away:"Escocia"},
  {id:19, date:"12/06",time:"22:00",home:"Estados Unidos", away:"Paraguay"},
  {id:20, date:"14/06",time:"01:00",home:"Australia",      away:"Turquía"},
  {id:21, date:"19/06",time:"16:00",home:"Estados Unidos", away:"Australia"},
  {id:22, date:"20/06",time:"00:00",home:"Turquía",        away:"Paraguay"},
  {id:23, date:"25/06",time:"23:00",home:"Paraguay",       away:"Australia"},
  {id:24, date:"25/06",time:"23:00",home:"Turquía",        away:"Estados Unidos"},
  {id:25, date:"14/06",time:"14:00",home:"Alemania",       away:"Curazao"},
  {id:26, date:"14/06",time:"20:00",home:"C. de Marfil",   away:"Ecuador"},
  {id:27, date:"20/06",time:"17:00",home:"Alemania",       away:"C. de Marfil"},
  {id:28, date:"20/06",time:"23:00",home:"Ecuador",        away:"Curazao"},
  {id:29, date:"25/06",time:"17:00",home:"Curazao",        away:"C. de Marfil"},
  {id:30, date:"25/06",time:"17:00",home:"Ecuador",        away:"Alemania"},
  {id:31, date:"14/06",time:"17:00",home:"Países Bajos",   away:"Japón"},
  {id:32, date:"14/06",time:"23:00",home:"Suecia",         away:"Túnez"},
  {id:33, date:"20/06",time:"14:00",home:"Países Bajos",   away:"Suecia"},
  {id:34, date:"21/06",time:"01:00",home:"Túnez",          away:"Japón"},
  {id:35, date:"25/06",time:"20:00",home:"Japón",          away:"Suecia"},
  {id:36, date:"25/06",time:"20:00",home:"Túnez",          away:"Países Bajos"},
  {id:37, date:"15/06",time:"16:00",home:"Bélgica",        away:"Egipto"},
  {id:38, date:"15/06",time:"22:00",home:"Irán",           away:"Nueva Zelanda"},
  {id:39, date:"21/06",time:"16:00",home:"Bélgica",        away:"Irán"},
  {id:40, date:"21/06",time:"22:00",home:"Nueva Zelanda",  away:"Egipto"},
  {id:41, date:"27/06",time:"00:00",home:"Egipto",         away:"Irán"},
  {id:42, date:"27/06",time:"00:00",home:"Nueva Zelanda",  away:"Bélgica"},
  {id:43, date:"15/06",time:"13:00",home:"España",         away:"Cabo Verde"},
  {id:44, date:"15/06",time:"19:00",home:"Arabia Saudita", away:"Uruguay"},
  {id:45, date:"21/06",time:"13:00",home:"España",         away:"Arabia Saudita"},
  {id:46, date:"21/06",time:"19:00",home:"Uruguay",        away:"Cabo Verde"},
  {id:47, date:"26/06",time:"21:00",home:"Cabo Verde",     away:"Arabia Saudita"},
  {id:48, date:"26/06",time:"21:00",home:"Uruguay",        away:"España"},
  {id:49, date:"16/06",time:"16:00",home:"Francia",        away:"Senegal"},
  {id:50, date:"16/06",time:"19:00",home:"Irak",           away:"Noruega"},
  {id:51, date:"22/06",time:"18:00",home:"Francia",        away:"Irak"},
  {id:52, date:"22/06",time:"21:00",home:"Noruega",        away:"Senegal"},
  {id:53, date:"26/06",time:"16:00",home:"Noruega",        away:"Francia"},
  {id:54, date:"26/06",time:"16:00",home:"Senegal",        away:"Irak"},
  {id:55, date:"16/06",time:"22:00",home:"Argentina",      away:"Argelia"},
  {id:56, date:"17/06",time:"01:00",home:"Austria",        away:"Jordania"},
  {id:57, date:"22/06",time:"14:00",home:"Argentina",      away:"Austria"},
  {id:58, date:"23/06",time:"00:00",home:"Jordania",       away:"Argelia"},
  {id:59, date:"27/06",time:"23:00",home:"Argelia",        away:"Austria"},
  {id:60, date:"27/06",time:"23:00",home:"Jordania",       away:"Argentina"},
  {id:61, date:"17/06",time:"14:00",home:"Portugal",       away:"RD Congo"},
  {id:62, date:"17/06",time:"23:00",home:"Uzbekistán",     away:"Colombia"},
  {id:63, date:"23/06",time:"14:00",home:"Portugal",       away:"Uzbekistán"},
  {id:64, date:"23/06",time:"23:00",home:"Colombia",       away:"RD Congo"},
  {id:65, date:"27/06",time:"20:30",home:"Colombia",       away:"Portugal"},
  {id:66, date:"27/06",time:"20:30",home:"RD Congo",       away:"Uzbekistán"},
  {id:67, date:"17/06",time:"17:00",home:"Inglaterra",     away:"Croacia"},
  {id:68, date:"17/06",time:"20:00",home:"Ghana",          away:"Panamá"},
  {id:69, date:"23/06",time:"17:00",home:"Inglaterra",     away:"Ghana"},
  {id:70, date:"23/06",time:"20:00",home:"Panamá",         away:"Croacia"},
  {id:71, date:"27/06",time:"18:00",home:"Croacia",        away:"Ghana"},
  {id:72, date:"27/06",time:"18:00",home:"Panamá",         away:"Inglaterra"},
];

function matchKickoff(m) {
  const [day, month] = m.date.split("/");
  const time = m.time || "12:00";
  return new Date(`2026-${month.padStart(2,"0")}-${day.padStart(2,"0")}T${time}:00-03:00`);
}

async function sendNotification(title, message) {
  console.log(`Enviando: "${title}" — "${message}"`);
  const resp = await fetch("https://api.onesignal.com/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Key ${ONESIGNAL_API_KEY}`
    },
    body: JSON.stringify({
      app_id: ONESIGNAL_APP_ID,
      included_segments: ["All"],
      contents: { es: message, en: message },
      headings: { es: title,   en: title },
      url: APP_URL,
      chrome_web_icon: `${APP_URL}/icon-192.png`,
    })
  });
  const data = await resp.json();
  if (data.id) {
    console.log(`✅ Notificación enviada a ${data.recipients} jugadores (ID: ${data.id})`);
  } else {
    console.error("❌ Error OneSignal:", JSON.stringify(data));
    process.exit(1);
  }
}

async function main() {
  if (!ONESIGNAL_APP_ID || !ONESIGNAL_API_KEY) {
    console.log("OneSignal no configurado todavía — saltando notificaciones");
    process.exit(0); // salida limpia, sin error
  }

  const now   = Date.now();
  const nowAR = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
  const hour  = nowAR.getHours();

  // Partidos de HOY (en hora argentina)
  const todayStr = nowAR.toLocaleDateString("es-AR", { day:"2-digit", month:"2-digit" }).replace("/", "/");
  const todayMatches = MATCHES.filter(m => {
    const ko = matchKickoff(m);
    const koAR = new Date(ko.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
    const koStr = koAR.toLocaleDateString("es-AR", { day:"2-digit", month:"2-digit" }).replace("/", "/");
    return koStr === todayStr && ko.getTime() > now;
  }).sort((a,b) => matchKickoff(a) - matchKickoff(b));

  // Partidos de MAÑANA
  const tomorrowAR = new Date(nowAR);
  tomorrowAR.setDate(tomorrowAR.getDate() + 1);
  const tomorrowStr = tomorrowAR.toLocaleDateString("es-AR", { day:"2-digit", month:"2-digit" }).replace("/", "/");
  const tomorrowMatches = MATCHES.filter(m => {
    const ko = matchKickoff(m);
    const koAR = new Date(ko.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
    const koStr = koAR.toLocaleDateString("es-AR", { day:"2-digit", month:"2-digit" }).replace("/", "/");
    return koStr === tomorrowStr;
  }).sort((a,b) => matchKickoff(a) - matchKickoff(b));

  console.log(`Hora argentina: ${hour}:00`);
  console.log(`Partidos hoy: ${todayMatches.length}`);
  console.log(`Partidos mañana: ${tomorrowMatches.length}`);

  // MAÑANA A LAS 9AM → notificación "mañana hay partidos"
  if (hour === 9 && tomorrowMatches.length > 0) {
    const names = tomorrowMatches.slice(0,2).map(m=>`${m.home} vs ${m.away}`).join(", ");
    const extra = tomorrowMatches.length > 2 ? ` y ${tomorrowMatches.length-2} más` : "";
    await sendNotification(
      "⚽ Mañana hay partidos — ¡cargá tus pronósticos!",
      `${names}${extra}. Entrá antes de que empiecen.`
    );
    return;
  }

  // DÍA DEL PARTIDO A LAS 9AM → recordatorio de hoy
  if (hour === 9 && todayMatches.length > 0) {
    const next = todayMatches[0];
    const ko = matchKickoff(next);
    const horasHasta = Math.round((ko.getTime() - now) / 3600000);
    const names = todayMatches.slice(0,2).map(m=>`${m.home} vs ${m.away}`).join(", ");
    await sendNotification(
      `⚽ Hoy juegan — ${todayMatches.length} partido${todayMatches.length>1?"s":""}!`,
      `${names}. El primero arranca en ${horasHasta}h. ¡Cargá tu pronóstico ya!`
    );
    return;
  }

  // 2 HORAS ANTES del primer partido del día → alerta urgente
  if (todayMatches.length > 0) {
    const next = todayMatches[0];
    const ko   = matchKickoff(next);
    const minsHasta = Math.round((ko.getTime() - now) / 60000);
    if (minsHasta > 90 && minsHasta <= 150) { // ventana 90-150 min antes
      await sendNotification(
        `🚨 Faltan 2hs — ${next.home} vs ${next.away}`,
        `¡Última chance para cargar tu pronóstico! El partido empieza en ${Math.round(minsHasta/60)}h.`
      );
      return;
    }
  }

  console.log("Sin notificación para este horario.");
}

main().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
