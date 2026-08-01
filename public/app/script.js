/* ============================================================
   Saurion Gaming · eFootball Player Training Guide
   script.js — state, rendering, interactivity, export/save
   ============================================================ */

/* ---------- 1. Default state (the "Reset" baseline) ---------- */
const PROG_MAX = 20; // max points per progression row

const DEFAULTS = {
  meta: {
    playerName: "Jude Bellingham",
    ovr: "107",
    position: "AMF",
    cardType: "Big Time England",
    club: "Real Madrid",
    playstyle: "Hole Player",
  },
  // Header meta pills — value can be a number or a string (WF / Injury are strings)
  info: [
    { key: "nationality", label: "Nationality", icon: "fa-flag", value: "England" },
    { key: "height", label: "Height", icon: "fa-ruler-vertical", value: "186 cm" },
    { key: "weight", label: "Weight", icon: "fa-weight-hanging", value: "75 kg" },
    { key: "age", label: "Age", icon: "fa-cake-candles", value: "23 years" },
    { key: "foot", label: "Strong Foot", icon: "fa-shoe-prints", value: "Right" },
    { key: "wfAcc", label: "WF Accuracy", icon: "fa-crosshairs", value: "High" },
    { key: "wfUse", label: "WF Usage", icon: "fa-repeat", value: "Medium" },
    { key: "injury", label: "Injury Resistance", icon: "fa-shield-heart", value: "Excellent" },
    { key: "levels", label: "Levels", icon: "fa-layer-group", value: "32" },
    { key: "form", label: "Form", icon: "fa-chart-line", value: "Standard" },
    { key: "last5", label: "Last 5 Weeks Form", icon: "fa-calendar-week", value: "C-C-B-A-C" },
  ],
  progression: [
    { key: "shooting", name: "Shooting", icon: "fa-futbol", value: 4 },
    { key: "passing", name: "Passing", icon: "fa-share-nodes", value: 8 },
    { key: "dribbling", name: "Dribbling", icon: "fa-shoe-prints", value: 12 },
    { key: "dexterity", name: "Dexterity", icon: "fa-hand-sparkles", value: 8 },
    { key: "lower", name: "Lower Body Strength", icon: "fa-person-running", value: 7 },
    { key: "aerial", name: "Aerial Strength", icon: "fa-arrow-up", value: 0 },
    { key: "defending", name: "Defending", icon: "fa-shield-halved", value: 0 },
    { key: "gk1", name: "GK 1", icon: "fa-hand", value: 0 },
    { key: "gk2", name: "GK 2", icon: "fa-hand-back-fist", value: 0 },
    { key: "gk3", name: "GK 3", icon: "fa-mitten", value: 0 },
  ],
  stats: {
    ATTACKING: [
      ["Offensive Awareness", 89, ""],
      ["Ball Control", 95, "+4"],
      ["Dribbling", 95, "+4"],
      ["Tight Possession", 96, "+4"],
      ["Low Pass", 92, "+4"],
      ["Lofted Pass", 87, "+1"],
      ["Finishing", 85, ""],
      ["Heading", 66, ""],
      ["Curl", 71, ""],
    ],
    DEFENDING: [
      ["Defensive Awareness", 75, ""],
      ["Tackling", 73, ""],
      ["Aggression", 80, "+3"],
      ["Defensive Engagement", 80, ""],
      ["GK Awareness", 41, ""],
      ["GK Catching", 41, ""],
      ["GK Parrying", 41, ""],
      ["GK Reflexes", 41, ""],
      ["GK Reach", 41, ""],
    ],
    PHYSICAL: [
      ["Speed", 92, ""],
      ["Acceleration", 90, "+3"],
      ["Kicking Power", 91, ""],
      ["Jumping", 71, ""],
      ["Physical Contact", 84, "+3"],
      ["Balance", 85, ""],
      ["Stamina", 94, "+3"],
    ],
  },
  progPoints: { used: "39", max: "200" },
  manager: 89,
  boosters: { b1: "Technique", b1b: "+4", b2: "Hard Worker", b2b: "+3" },
  inbuilt: [
    "Magnetic Feet",
    "Attacking Surge",
    "Double Touch",
    "Long-Range Curler",
    "Long Range Shooting",
    "First-time Shot",
    "One-touch Pass",
    "Through Passing",
    "Outside Curler",
    "Fighting Spirit",
  ],
  additional: ["Sole Control", "Marseille Turn", "Flip Flap", "Dipping Shot", "Heel Trick"],
  cardImage: "assets/images/player-card.png",
};

let state = structuredClone(DEFAULTS);

/* ---------- 2. Small helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
/** Shrink-wrap an input to exactly its text width. */
function autosize(inp) {
  const cs = getComputedStyle(inp);
  const span = document.createElement("span");
  span.style.cssText = `position:absolute;visibility:hidden;white-space:pre;font:${cs.font};letter-spacing:${cs.letterSpacing}`;
  span.textContent = inp.value || " ";
  document.body.appendChild(span);
  const extra =
    parseFloat(cs.paddingLeft) +
    parseFloat(cs.paddingRight) +
    parseFloat(cs.borderLeftWidth) +
    parseFloat(cs.borderRightWidth);
  inp.style.width = Math.ceil(span.offsetWidth + extra) + 2 + "px";
  span.remove();
}

/** Colour class for a stat value. */
const valueClass = (v) =>
  v >= 90 ? "v-cyan" : v >= 80 ? "v-green" : v >= 70 ? "v-yellow" : v >= 60 ? "v-orange" : "v-red";

/* ---------- 3. Header meta pills ---------- */
function renderMeta() {
  const wrap = $("#headerMeta");
  wrap.innerHTML = "";
  state.info.forEach((item) => {
    const node = el("div", "meta");
    node.innerHTML = `
      <i class="fa-solid ${item.icon}"></i>
      <span class="meta__body">
        <span class="meta__label">${item.label}</span>
        <input class="edit" value="${item.value}" />
      </span>`;
    node.querySelector("input").addEventListener("input", (e) => (item.value = e.target.value));
    wrap.appendChild(node);
  });
}

/* ---------- 4. Progression rows ---------- */
function renderProgression() {
  const wrap = $("#progression");
  wrap.innerHTML = "";
  state.progression.forEach((row) => {
    const node = el("div", "prow");
    node.innerHTML = `
      <span class="prow__icon"><i class="fa-solid ${row.icon}"></i></span>
      <span class="prow__name">${row.name}</span>
      <span class="prow__ctrl">
        <button class="step" data-step="-1" aria-label="Decrease">−</button>
        <input class="edit prow__num" value="${row.value}" inputmode="numeric" />
        <button class="step" data-step="1" aria-label="Increase">+</button>
      </span>
      <input class="prow__slider" type="range" min="0" max="${PROG_MAX}" value="${row.value}" />`;

    const num = node.querySelector(".prow__num");
    const slider = node.querySelector(".prow__slider");

    const apply = (v) => {
      row.value = Math.max(0, Math.min(PROG_MAX, Number(v) || 0));
      num.value = row.value;
      slider.value = row.value;
      slider.style.setProperty("--p", (row.value / PROG_MAX) * 100 + "%");
    };
    num.addEventListener("input", (e) => apply(e.target.value));
    slider.addEventListener("input", (e) => apply(e.target.value));
    node
      .querySelectorAll(".step")
      .forEach((b) =>
        b.addEventListener("click", () => apply(row.value + Number(b.dataset.step)))
      );

    wrap.appendChild(node);
    apply(row.value);
  });
}
/* Progression points pill — fully manual, independent of the rows below. */
function renderProgPoints() {
  [["progUsed", "used"], ["progMax", "max"]].forEach(([id, key]) => {
    const node = document.getElementById(id);
    if (!node) return;
    node.value = state.progPoints[key];
    node.oninput = (e) => (state.progPoints[key] = e.target.value);
  });
}

/* ---------- 5. Statistics ---------- */
function renderStats() {
  const wrap = $("#stats");
  wrap.innerHTML = "";
  const groups = Object.entries(state.stats);
  const maxRows = Math.max(...groups.map(([, rows]) => rows.length));

  groups.forEach(([group, rows]) => {
    const g = el("div", "sgroup");
    g.appendChild(el("h3", "sgroup__title", group));
    const list = el("div", "sgroup__rows");

    rows.forEach((row) => {
      const node = el("div", "srow");
      const statClass = valueClass(row[1]);
      const modClass = row[2] ? `srow__mod ${statClass}` : "srow__mod srow__mod--empty";
      node.innerHTML = `
        <span class="srow__name">${row[0]}</span>
        <span class="${modClass}">${row[2] || "+0"}</span>
        <input class="edit srow__val ${statClass}" value="${row[1]}" inputmode="numeric" />`;
      const input = node.querySelector(".srow__val");
      const modifier = node.querySelector(".srow__mod");
      input.addEventListener("input", (e) => {
        const v = Math.max(0, Math.min(99, Number(e.target.value) || 0));
        row[1] = v;
        const nextClass = valueClass(v);
        input.className = `edit srow__val ${nextClass}`;
        if (modifier) {
          modifier.className = row[2] ? `srow__mod ${nextClass}` : "srow__mod srow__mod--empty";
        }
      });
      list.appendChild(node);
    });

    while (list.children.length < maxRows) {
      const filler = el("div", "srow srow--spacer");
      filler.innerHTML = `<span class="srow__name">&nbsp;</span><span class="srow__mod srow__mod--empty">+0</span><span class="srow__val"></span>`;
      list.appendChild(filler);
    }

    g.appendChild(list);
    wrap.appendChild(g);
  });
}

/* ---------- 6. Skills ---------- */
function renderSkills() {
  const inb = $("#inbuiltSkills");
  inb.innerHTML = "";
  state.inbuilt.forEach((name, i) => {
    // First two inbuilt skills get the special animated highlight
    const node = el("div", "skill" + (i < 2 ? " skill--special" : ""));
    node.innerHTML = `<i class="fa-solid ${i < 2 ? "fa-crown" : "fa-bolt-lightning"}"></i>
      <input class="edit" value="${name}" />`;
    node
      .querySelector("input")
      .addEventListener("input", (e) => (state.inbuilt[i] = e.target.value));
    inb.appendChild(node);
  });

  const add = $("#additionalSkills");
  add.innerHTML = "";
  state.additional.forEach((name, i) => {
    const li = el("li", "skill");
    li.innerHTML = `<input class="edit" value="${name}" />`;
    li.querySelector("input").addEventListener(
      "input",
      (e) => (state.additional[i] = e.target.value)
    );
    add.appendChild(li);
  });
}

/* ---------- 7. Manager + boosters ---------- */
function renderManager() {
  const input = $("#mgrValue");
  const bar = $("#mgrBar");
  const apply = (v) => {
    state.manager = Math.max(0, Math.min(99, Number(v) || 0));
    bar.style.width = state.manager + "%";
  };
  input.value = state.manager;
  input.oninput = (e) => apply(e.target.value);
  apply(state.manager);
}
function renderBoosters() {
  const map = { booster1: "b1", booster1Bonus: "b1b", booster2: "b2", booster2Bonus: "b2b" };
  Object.entries(map).forEach(([id, key]) => {
    const sel = document.getElementById(id);
    sel.value = state.boosters[key];
    sel.onchange = (e) => (state.boosters[key] = e.target.value);
  });
}

/* ---------- 8. Header text fields + card image ---------- */
function renderHeaderFields() {
  Object.keys(state.meta).forEach((key) => {
    const node = document.getElementById(key);
    if (!node) return;
    node.value = state.meta[key];
    if (node.classList.contains("chip")) autosize(node);
    node.oninput = (e) => {
      state.meta[key] = e.target.value;
      if (node.classList.contains("chip")) autosize(node);
    };
  });
}
function renderCardImage() {
  $("#cardImage").src = state.cardImage;
}
$("#cardUpload").addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.cardImage = reader.result;
    renderCardImage();
  };
  reader.readAsDataURL(file);
});

/* ---------- 9. Render all ---------- */
function renderAll() {
  renderHeaderFields();
  renderMeta();
  renderProgression();
  renderStats();
  renderSkills();
  renderManager();
  renderBoosters();
  renderProgPoints();
  renderCardImage();
}
renderAll();
// Re-measure the shrink-wrapped chips once the web fonts have loaded.
if (document.fonts?.ready) document.fonts.ready.then(() => renderHeaderFields());

/* ---------- 10. Export as PNG (1:1 square, whole dashboard) ---------- */
async function exportPNG() {
  const target = $("#dashboard");
  if (!target) return;
  if (typeof window.html2canvas !== "function") {
    alert("Export failed because the image library could not be loaded.");
    return;
  }

  document.body.classList.add("exporting");
  let shot;
  try {
    shot = await window.html2canvas(target, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      onclone: (doc) => {
        // html2canvas mis-renders form controls (text clipped / baseline off),
        // so swap every input & select for a plain span with the same styling.
        doc.querySelectorAll("input, select").forEach((node) => {
          if (node.type === "file") {
            node.style.visibility = "hidden";
            return;
          }
          // Range sliders render badly — draw a static bar with the same fill.
          if (node.type === "range") {
            const pct = (Number(node.value) / Number(node.max || 100)) * 100;
            const bar = doc.createElement("span");
            bar.className = "bar expbar";
            bar.innerHTML = `<span class="bar__fill" style="width:${pct}%"></span>`;
            node.replaceWith(bar);
            return;
          }

          const span = doc.createElement("span");
          span.className = node.className + " exp";
          span.textContent = node.value;
          const cs = getComputedStyle(node);
          const isNumeric = /edit--num|progpill__num|prow__num|srow__val|edit--ovr|edit--pos|chip/.test(node.className);
          const isBoosterValue = node.id === "booster1Bonus" || node.id === "booster2Bonus";
          span.style.display = "inline-flex";
          span.style.alignItems = "center";
          span.style.justifyContent = isNumeric || isBoosterValue ? "center" : "flex-start";
          span.style.textAlign = isNumeric || isBoosterValue ? "center" : "left";
          span.style.width = cs.width;
          span.style.height = cs.height;
          span.style.minWidth = cs.width;
          span.style.padding = cs.padding;
          span.style.font = cs.font;
          span.style.color = cs.color;
          span.style.lineHeight = cs.height;
          node.replaceWith(span);
        });
      },
    });
  } catch (err) {
    console.error("Export failed", err);
    alert("Export failed. Please refresh and try again.");
    return;
  } finally {
    document.body.classList.remove("exporting");
  }

  // Compose onto a square canvas so the export is always 1:1 and complete
  const pad = Math.round(Math.max(shot.width, shot.height) * 0.02);
  const side = Math.max(shot.width, shot.height) + pad * 2;
  const square = document.createElement("canvas");
  square.width = square.height = side;
  const ctx = square.getContext("2d");

  const bg = new Image();
  bg.src = "assets/images/bg-banner.png";
  await new Promise((resolve, reject) => {
    bg.onload = resolve;
    bg.onerror = reject;
  });

  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(bg, 0, 0, side, side);
  const glow = ctx.createRadialGradient(side * 0.25, side * 0.18, 0, side * 0.25, side * 0.18, side * 0.7);
  glow.addColorStop(0, "rgba(139, 61, 255, 0.25)");
  glow.addColorStop(0.55, "rgba(0, 232, 255, 0.12)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, side, side);
  ctx.restore();

  ctx.drawImage(shot, (side - shot.width) / 2, (side - shot.height) / 2);

  const a = document.createElement("a");
  a.download = `${(state.meta.playerName || "player").replace(/\s+/g, "-")}-saurion-gaming.png`;
  a.href = square.toDataURL("image/png");
  a.click();
}
$("#btnExport").addEventListener("click", exportPNG);

/* ---------- 11. Save / Load JSON ---------- */
$("#btnSave").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${(state.meta.playerName || "player").replace(/\s+/g, "-")}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
});
$("#loadJson").addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      state = { ...structuredClone(DEFAULTS), ...JSON.parse(reader.result) };
      renderAll();
    } catch {
      alert("That file isn't a valid player JSON.");
    }
  };
  reader.readAsText(file);
});

/* ---------- 12. Reset ---------- */
$("#btnReset").addEventListener("click", () => {
  state = structuredClone(DEFAULTS);
  renderAll();
});

/* ---------- 13. Keyboard shortcuts (E / S / R) ---------- */
document.addEventListener("keydown", (e) => {
  if (/input|select|textarea/i.test(document.activeElement.tagName)) return;
  if (e.key.toLowerCase() === "e") exportPNG();
  if (e.key.toLowerCase() === "s") $("#btnSave").click();
  if (e.key.toLowerCase() === "r") $("#btnReset").click();
});

/* ---------- 14. Mouse-follow glow + card tilt ---------- */
const glow = $("#cursorGlow");
window.addEventListener("pointermove", (e) => {
  glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
});
document.querySelectorAll(".tilt").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
  });
  card.addEventListener("pointerleave", () => (card.style.transform = ""));
});

/* ---------- 15. Particle background ---------- */
(function particles() {
  const canvas = $("#particles");
  const ctx = canvas.getContext("2d");
  let dots = [];
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    dots = Array.from({ length: Math.min(90, Math.round(canvas.width / 18)) }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      c: Math.random() > 0.5 ? "0,232,255" : "139,61,255",
    }));
  };
  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach((d) => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
      if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${d.c},0.5)`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  };
  window.addEventListener("resize", resize);
  resize();
  tick();
})();
