const data = {
  Library:{floor:1,totalSeats:100,occupiedSeats:17,zones:[
    {zone:"Silent Zone",seats:[{id:"L1",booked:false,releaseAt:null},{id:"L2",booked:false,releaseAt:null},{id:"L3",booked:false,releaseAt:null},{id:"L4",booked:false,releaseAt:null},{id:"L5",booked:false,releaseAt:null}]},
    {zone:"Discussion Zone",seats:[{id:"L6",booked:false,releaseAt:null},{id:"L7",booked:false,releaseAt:null},{id:"L8",booked:false,releaseAt:null},{id:"L9",booked:false,releaseAt:null},{id:"L10",booked:false,releaseAt:null}]},
    {zone:"Computer Zone",seats:[{id:"L11",booked:false,releaseAt:null},{id:"L12",booked:false,releaseAt:null},{id:"L13",booked:false,releaseAt:null},{id:"L14",booked:false,releaseAt:null},{id:"L15",booked:false,releaseAt:null}]}
  ]},
  "Cafeteria":{floor:2,totalSeats:80,occupiedSeats:36,zones:[
    {zone:"Dining Zone",seats:[{id:"C1",booked:false,releaseAt:null},{id:"C2",booked:false,releaseAt:null},{id:"C3",booked:false,releaseAt:null},{id:"C4",booked:false,releaseAt:null},{id:"C5",booked:false,releaseAt:null}]},
    {zone:"Work Zone",seats:[{id:"C6",booked:false,releaseAt:null},{id:"C7",booked:false,releaseAt:null},{id:"C8",booked:false,releaseAt:null},{id:"C9",booked:false,releaseAt:null},{id:"C10",booked:false,releaseAt:null}]},
    {zone:"Social Zone",seats:[{id:"C11",booked:false,releaseAt:null},{id:"C12",booked:false,releaseAt:null},{id:"C13",booked:false,releaseAt:null},{id:"C14",booked:false,releaseAt:null},{id:"C15",booked:false,releaseAt:null}]}
  ]},
  "Study Hall":{floor:3,totalSeats:120,occupiedSeats:50,zones:[
    {zone:"Study Zone",seats:[{id:"S1",booked:false,releaseAt:null},{id:"S2",booked:false,releaseAt:null},{id:"S3",booked:false,releaseAt:null},{id:"S4",booked:false,releaseAt:null},{id:"S5",booked:false,releaseAt:null}]},
    {zone:"Meeting Zone",seats:[{id:"S6",booked:false,releaseAt:null},{id:"S7",booked:false,releaseAt:null},{id:"S8",booked:false,releaseAt:null},{id:"S9",booked:false,releaseAt:null},{id:"S10",booked:false,releaseAt:null}]},
    {zone:"Collaboration Zone",seats:[{id:"S11",booked:false,releaseAt:null},{id:"S12",booked:false,releaseAt:null},{id:"S13",booked:false,releaseAt:null},{id:"S14",booked:false,releaseAt:null},{id:"S15",booked:false,releaseAt:null}]}
  ]},
  "Student Central":{floor:4,totalSeats:120,occupiedSeats:90,zones:[
    {zone:"Tech Zone",seats:[{id:"E1",booked:false,releaseAt:null},{id:"E2",booked:false,releaseAt:null},{id:"E3",booked:false,releaseAt:null},{id:"E4",booked:false,releaseAt:null},{id:"E5",booked:false,releaseAt:null}]},
    {zone:"Activity Zone",seats:[{id:"E6",booked:false,releaseAt:null},{id:"E7",booked:false,releaseAt:null},{id:"E8",booked:false,releaseAt:null},{id:"E9",booked:false,releaseAt:null},{id:"E10",booked:false,releaseAt:null}]},
    {zone:"Mac Zone",seats:[{id:"E11",booked:false,releaseAt:null},{id:"E12",booked:false,releaseAt:null},{id:"E13",booked:false,releaseAt:null},{id:"E14",booked:false,releaseAt:null},{id:"E15",booked:false,releaseAt:null}]}
  ]}
};

const seatTimers = {};
let pendingBooking = null;
let selectedMinutes = null;

function getStatus(occ, total) {
  const p = occ / total;
  if (p < 0.4) return { label: "Available", cls: "available" };
  if (p < 0.75) return { label: "Moderate", cls: "moderate" };
  return { label: "Busy", cls: "busy" };
}

function renderCards() {
  const grid = document.getElementById("cardsGrid");
  grid.innerHTML = "";
  Object.entries(data).forEach(([name, info]) => {
    const s = getStatus(info.occupiedSeats, info.totalSeats);
    const pct = Math.round((info.occupiedSeats / info.totalSeats) * 100);
    const barCls = s.cls === "available" ? "low" : s.cls === "moderate" ? "medium" : "high";
    const c = document.createElement("div");
    c.className = "place-card";
    c.innerHTML = `
      <div class="card-header">
        <div class="card-title">${name}</div>
        <div class="card-floor">Floor: ${info.floor}</div>
      </div>
      <div class="card-stats">
        <div class="stat-row"><span>Total Seats</span><span>${info.totalSeats}</span></div>
        <div class="stat-row"><span>Occupied Seats</span><span>${info.occupiedSeats}</span></div>
      </div>
      <div class="cap-bar-wrap"><div class="cap-bar-fill ${barCls}" style="width:${pct}%"></div></div>
      <button class="status-btn ${s.cls}" onclick="openZonePopup('${name}')">${s.label}</button>
      <button class="zones-btn" onclick="openZonePopup('${name}')">View Zones</button>
    `;
    grid.appendChild(c);
  });
}

function openZonePopup(place) {
  document.getElementById("popupTitle").innerText = place + " — Zones";
  const list = document.getElementById("zoneList");
  list.innerHTML = "";
  data[place].zones.forEach(z => {
    const avail = z.seats.filter(s => !s.booked).length;
    const div = document.createElement("div");
    div.className = "zone-card";
    div.innerHTML = `
      <div>
        <h3>${z.zone}</h3>
        <p class="zone-avail">Available: <strong>${avail}</strong> / ${z.seats.length} seats</p>
      </div>
      <button class="view-seats-btn" onclick="showSeats('${place}','${z.zone}')">View Seats</button>
    `;
    list.appendChild(div);
  });
  document.getElementById("zonePopup").classList.add("active");
}
function closeZonePopup() { document.getElementById("zonePopup").classList.remove("active"); }

function showSeats(place, zone) {
  document.getElementById("seatTitle").innerText = zone + " — Seats";
  const wrap = document.getElementById("seatGrid");
  wrap.innerHTML = "<div class='seat-grid'></div>";
  const sg = wrap.querySelector(".seat-grid");
  const z = data[place].zones.find(z => z.zone === zone);

  z.seats.forEach(seat => {
    const c = document.createElement("div");
    c.className = "seat-card" + (seat.booked ? " blocked-seat" : "");
    c.id = "seat-card-" + seat.id;

    let timerHtml = "";
    if (seat.booked && seat.releaseAt) {
      timerHtml = `<div class="seat-timer" id="timer-${seat.id}">${getRemaining(seat.releaseAt)}</div>`;
    }

    c.innerHTML = `
      <div class="seat-icon">${seat.booked ? "🚫" : "🪑"}</div>
      <div class="seat-label">Seat ${seat.id}</div>
      ${timerHtml}
      ${seat.booked
        ? '<button class="book-btn blocked-btn" disabled>Blocked</button>'
        : `<button class="book-btn" onclick="openTimePopup('${place}','${zone}','${seat.id}')">Book</button>`}
    `;
    sg.appendChild(c);

    if (seat.booked && seat.releaseAt) {
      startCountdownDisplay(seat.id, seat.releaseAt);
    }
  });

  document.getElementById("zonePopup").classList.remove("active");
  document.getElementById("seatPopup").classList.add("active");
}
function closeSeatPopup() { document.getElementById("seatPopup").classList.remove("active"); }

function getRemaining(releaseAt) {
  const diff = releaseAt - Date.now();
  if (diff <= 0) return "Releasing...";
  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (m >= 60) { const h = Math.floor(m / 60); const rm = m % 60; return rm > 0 ? `${h}h ${rm}m left` : `${h}h left`; }
  return `${m}m ${s}s left`;
}

function startCountdownDisplay(seatId, releaseAt) {
  if (seatTimers[seatId]) clearInterval(seatTimers[seatId]);
  seatTimers[seatId] = setInterval(() => {
    const t = document.getElementById("timer-" + seatId);
    if (!t) { clearInterval(seatTimers[seatId]); return; }
    t.textContent = getRemaining(releaseAt);
    if (Date.now() >= releaseAt) { clearInterval(seatTimers[seatId]); releaseSeat(seatId); }
  }, 1000);
}

function releaseSeat(seatId) {
  for (const [place, info] of Object.entries(data)) {
    for (const zone of info.zones) {
      const seat = zone.seats.find(s => s.id === seatId);
      if (seat && seat.booked) {
        seat.booked = false;
        seat.releaseAt = null;
        info.occupiedSeats = Math.max(0, info.occupiedSeats - 1);
        renderCards();
        const seatPopup = document.getElementById("seatPopup");
        if (seatPopup.classList.contains("active")) showSeats(place, zone.zone);
        return;
      }
    }
  }
}

function openTimePopup(place, zone, seatId) {
  pendingBooking = { place, zone, seatId };
  selectedMinutes = null;
  document.getElementById("bookingSeatId").textContent = "Seat " + seatId;
  document.getElementById("bookingSeatLoc").textContent = place + " · " + zone;
  document.getElementById("confirmBookBtn").disabled = true;
  document.getElementById("durationNote").textContent = "Choose a duration above";
  document.getElementById("customTimeWrap").style.display = "none";
  document.getElementById("customTimeInput").value = "";
  document.querySelectorAll(".time-slot").forEach(el => el.classList.remove("selected"));
  document.getElementById("seatPopup").classList.remove("active");
  document.getElementById("timePopup").classList.add("active");
}
function closeTimePopup() {
  document.getElementById("timePopup").classList.remove("active");
  if (pendingBooking) showSeats(pendingBooking.place, pendingBooking.zone);
}

function selectDuration(minutes, el) {
  document.querySelectorAll(".time-slot").forEach(e => e.classList.remove("selected"));
  el.classList.add("selected");
  if (minutes === 0) {
    selectedMinutes = null;
    document.getElementById("customTimeWrap").style.display = "block";
    document.getElementById("confirmBookBtn").disabled = true;
    document.getElementById("durationNote").textContent = "Pick an end time";
  } else {
    selectedMinutes = minutes;
    document.getElementById("customTimeWrap").style.display = "none";
    document.getElementById("confirmBookBtn").disabled = false;
    const end = new Date(Date.now() + minutes * 60000);
    document.getElementById("durationNote").textContent =
      `Releases at ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
}

function onCustomTime() {
  const val = document.getElementById("customTimeInput").value;
  if (!val) return;
  const now = new Date();
  const [h, m] = val.split(":").map(Number);
  const end = new Date(now);
  end.setHours(h, m, 0, 0);
  if (end <= now) end.setDate(end.getDate() + 1);
  selectedMinutes = (end - now) / 60000;
  document.getElementById("confirmBookBtn").disabled = false;
  document.getElementById("durationNote").textContent =
    `Releases at ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function confirmBooking() {
  if (!pendingBooking || !selectedMinutes) return;
  const { place, zone, seatId } = pendingBooking;
  const z = data[place].zones.find(z => z.zone === zone);
  const seat = z.seats.find(s => s.id === seatId);
  const releaseAt = Date.now() + Math.round(selectedMinutes) * 60000;
  seat.booked = true;
  seat.releaseAt = releaseAt;
  data[place].occupiedSeats++;
  renderCards();
  setTimeout(() => releaseSeat(seatId), releaseAt - Date.now() + 200);
  document.getElementById("timePopup").classList.remove("active");
  showSeats(place, zone);
}

["zonePopup", "seatPopup", "timePopup"].forEach(id => {
  document.getElementById(id).addEventListener("click", e => {
    if (e.target === e.currentTarget) {
      if (id === "zonePopup") closeZonePopup();
      else if (id === "seatPopup") closeSeatPopup();
      else closeTimePopup();
    }
  });
});


// ── CAMPUS MAP ──
function openCampusMap() {
  updateMapDots();
  document.getElementById("campusMapPopup").classList.add("active");
}

function closeCampusMap() {
  document.getElementById("campusMapPopup").classList.remove("active");
}

function updateMapDots() {
  // Map display names to data keys
  const mapping = {
    "Library":         "Library",
    "Computer Lab":    "Computer Lab",
    "Student Central": "Student Central",  // not in data but graceful fallback
    "Study Hall":      "Study Hall"
  };

  Object.entries(mapping).forEach(([label, key]) => {
    const dot = document.getElementById("map-dot-" + label);
    if (!dot) return;
    const info = data[key];
    if (!info) return;
    const s = getStatus(info.occupiedSeats, info.totalSeats);
    const colors = { available: "#2d8a2d", moderate: "#e8970a", busy: "#cc3333" };
    dot.setAttribute("fill", colors[s.cls] || "#2d8a2d");
  });
}

function handleMapClick(placeName) {
  if (!data[placeName]) return;
  closeCampusMap();
  openZonePopup(placeName);
}

document.getElementById("campusMapPopup").addEventListener("click", e => {
  if (e.target === e.currentTarget) closeCampusMap();
});

renderCards();
