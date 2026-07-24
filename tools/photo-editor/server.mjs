// Editor de fotos — herramienta LOCAL de desarrollo (no se despliega).
// Sube una foto por "slot"; la normaliza con sharp (JPEG, máx 2400px, calidad 82)
// y la guarda en src/assets/images/slots/<slot>.jpeg. El build de Astro la optimiza a WebP/AVIF.
//
//   npm run editor   →   http://localhost:4340
import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, statSync } from 'node:fs';
import { slots } from './slots.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SLOTS_DIR = join(__dirname, '..', '..', 'src', 'assets', 'images', 'slots');
const PORT = 4340;

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });
const bySlot = Object.fromEntries(slots.map((s) => [s.id, s]));

// Vista previa de la imagen actual de un slot (con timestamp anti-caché)
app.get('/current/:id', (req, res) => {
  const file = join(SLOTS_DIR, `${req.params.id}.jpeg`);
  if (!existsSync(file)) return res.status(404).end();
  res.sendFile(file);
});

// Subida + normalización
app.post('/api/upload/:id', upload.single('photo'), async (req, res) => {
  const slot = bySlot[req.params.id];
  if (!slot) return res.status(400).json({ error: 'Slot desconocido' });
  if (!req.file) return res.status(400).json({ error: 'No se recibió archivo' });
  try {
    const out = join(SLOTS_DIR, `${slot.id}.jpeg`);
    await sharp(req.file.buffer)
      .rotate() // respeta orientación EXIF
      .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(out);
    const kb = Math.round(statSync(out).size / 1024);
    res.json({ ok: true, id: slot.id, sizeKB: kb });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

app.get('/', (_req, res) => {
  const cards = slots
    .map(
      (s) => `
    <article class="card" data-id="${s.id}">
      <div class="thumb" style="aspect-ratio:${s.ratio}">
        <img src="/current/${s.id}?t=${Date.now()}" alt="" onerror="this.style.display='none'">
      </div>
      <div class="body">
        <span class="sec">${s.section}</span>
        <h3>${s.label}</h3>
        <label class="file">
          <input type="file" accept="image/*" data-slot="${s.id}">
          <span>Elegir foto…</span>
        </label>
        <p class="status" id="st-${s.id}"></p>
      </div>
    </article>`
    )
    .join('');
  res.type('html').send(`<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Editor de fotos · Global Hotel Panamá</title>
<style>
  :root{--gold:#B8965A;--charcoal:#1C1C1C;--ivory:#F9F5EE;--soft:#8A8A8A}
  *{box-sizing:border-box}
  body{margin:0;font-family:'DM Sans',system-ui,sans-serif;background:var(--ivory);color:var(--charcoal)}
  header{padding:28px 32px;border-bottom:1px solid rgba(28,28,28,.1);position:sticky;top:0;background:var(--ivory);z-index:5}
  header h1{font-family:'Cormorant Garamond',Georgia,serif;font-weight:400;margin:0;font-size:26px}
  header h1 span{color:var(--gold)}
  header p{margin:6px 0 0;color:var(--soft);font-size:13px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;padding:32px}
  .card{background:#fff;border:1px solid rgba(28,28,28,.1)}
  .thumb{width:100%;background:var(--charcoal);overflow:hidden}
  .thumb img{width:100%;height:100%;object-fit:cover}
  .body{padding:18px 20px}
  .sec{font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:var(--gold)}
  .body h3{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;margin:4px 0 16px;font-size:20px}
  .file{display:block;border:1px dashed rgba(28,28,28,.3);padding:12px;text-align:center;cursor:pointer;font-size:13px;transition:border-color .2s}
  .file:hover{border-color:var(--gold)}
  .file input{display:none}
  .status{font-size:12px;margin:10px 0 0;min-height:16px}
  .status.ok{color:#2f7d4f}.status.err{color:#b3392f}.status.load{color:var(--soft)}
</style></head>
<body>
  <header>
    <h1>Editor de fotos · Global <span>Hotel</span> Panamá</h1>
    <p>Sube una foto por posición. Se normaliza a JPEG (máx 2400px) y el build la optimiza sola. Recuerda reconstruir el sitio tras cambiar fotos.</p>
  </header>
  <div class="grid">${cards}</div>
<script>
  document.querySelectorAll('input[type=file]').forEach((inp) => {
    inp.addEventListener('change', async () => {
      const id = inp.dataset.slot;
      const st = document.getElementById('st-' + id);
      if (!inp.files || !inp.files[0]) return;
      st.className = 'status load'; st.textContent = 'Subiendo…';
      const fd = new FormData(); fd.append('photo', inp.files[0]);
      try {
        const r = await fetch('/api/upload/' + id, { method: 'POST', body: fd });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || 'Error');
        st.className = 'status ok'; st.textContent = 'Guardada (' + j.sizeKB + ' KB). Reconstruye el sitio para verla.';
        const img = inp.closest('.card').querySelector('.thumb img');
        img.style.display = ''; img.src = '/current/' + id + '?t=' + Date.now();
      } catch (e) {
        st.className = 'status err'; st.textContent = String(e.message || e);
      }
      inp.value = '';
    });
  });
</script>
</body></html>`);
});

app.listen(PORT, () => {
  console.log(`\n  ✎ Editor de fotos → http://localhost:${PORT}\n  Slots en: src/assets/images/slots/\n`);
});
