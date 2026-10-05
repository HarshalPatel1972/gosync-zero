// The scripted day behind the "One day, no signal" story. Pure data and pure
// functions of the clock, so the scroll position fully determines what is on
// screen and the timeline can't drift out of sync with the visuals.
//
// Times are minutes after 07:00.

export const DAY_START = 0; // 07:00
export const DAY_END = 750; // 19:30

const at = (hh, mm) => (hh - 7) * 60 + mm;

export function clockLabel(t) {
  const minutes = Math.round(t) + 7 * 60;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Signal strength (0 to 4 bars) through the day: full 4G in town, nothing in
// the villages, a few seconds of 2G at a bus stop.
const SIGNAL = [
  { from: at(7, 0), to: at(8, 10), bars: 4 },
  { from: at(8, 10), to: at(8, 20), bars: 3 },
  { from: at(8, 20), to: at(8, 30), bars: 1 },
  { from: at(8, 30), to: at(11, 38), bars: 0 },
  { from: at(11, 38), to: at(11, 44), bars: 1 }, // bus stop
  { from: at(11, 44), to: at(14, 40), bars: 0 },
  { from: at(14, 40), to: at(14, 50), bars: 2 }, // hill above Kheda
  { from: at(14, 50), to: at(18, 20), bars: 0 },
  { from: at(18, 20), to: at(18, 30), bars: 2 },
  { from: at(18, 30), to: at(19, 30), bars: 4 },
];

export const SIGNAL_SEGMENTS = SIGNAL;

export function signalAt(t) {
  const seg = SIGNAL.find((s) => t >= s.from && t < s.to);
  return seg ? seg.bars : 4;
}

// Earliest moment at or after t when there is any signal: when a write made at
// t reaches the server.
export function nextConnection(t) {
  if (signalAt(t) > 0) return t;
  const seg = SIGNAL.find((s) => s.from > t && s.bars > 0);
  return seg ? seg.from : Infinity;
}

export const PLACES = [
  { at: at(7, 0), name: "Town" },
  { at: at(9, 0), name: "Rampur" },
  { at: at(11, 38), name: "Bus stop" },
  { at: at(12, 30), name: "Kheda", row: 1 },
  { at: at(18, 20), name: "Town" },
];

// 23 household visits. Each is saved on the phone at `at` and reaches the
// server at the next moment with signal.
const NAMES = [
  "Meena Kumari", "Rekha Yadav", "Geeta Bai", "Asha Verma", "Kamini Patel", "Lata Devi",
  "Pushpa Rani", "Savitri Bai", "Radha Singh", "Usha Meena", "Sunita Devi", "Kiran Gupta",
  "Anita Joshi", "Shanti Bai", "Laxmi Rawat", "Nirmala Devi", "Poonam Sahu", "Sarita Bai",
  "Mamta Rao", "Babita Jain", "Sushila Devi", "Kamla Bai", "Rukmini Das",
];
const VISIT_TIMES = [
  at(9, 20), at(9, 35), at(9, 55), at(10, 10), at(10, 25), at(10, 40), at(10, 55), at(11, 15),
  at(12, 0), at(12, 20), at(12, 40), at(13, 0), at(13, 45), at(14, 5), at(14, 25),
  at(15, 10), at(15, 25), at(15, 40), at(16, 0), at(16, 15), at(17, 20), at(17, 40), at(18, 0),
];
export const VISITS = VISIT_TIMES.map((time, i) => ({
  id: i + 1,
  name: NAMES[i],
  house: 3 + i * 2,
  at: time,
  syncedAt: nextConnection(time),
}));

// The concurrent edit: house of Sunita Devi (visit 11).
export const CONFLICT = {
  name: "Sunita Devi",
  house: VISITS[10].house,
  supervisorEditAt: at(13, 5), // office corrects the phone number
  workerEditAt: at(13, 20), // offline in Kheda: records TT-2 vaccine
  mergedAt: nextConnection(at(13, 20)),
};

// The app is closed (battery 3%) and reopened later.
export const APP_CLOSED = { from: at(16, 30), to: at(17, 10) };

// Story beats: the caption shown for each stretch of the day.
export const BEATS = [
  {
    at: at(7, 40),
    title: "07:40 · Leaving town",
    body: "Kamla is a community health worker. Today: 23 household visits across two villages, most of them with no signal at all. Her app loads once, here, on town 4G.",
  },
  {
    at: at(9, 15),
    title: "Rampur · no signal",
    body: "Each visit saves instantly on the phone. No spinner, no retry button. Visits waiting to be sent sit in an outbox on the device.",
    usually: "Forms that refuse to submit, or entries lost when the page reloads.",
  },
  {
    at: at(11, 38),
    title: "Bus stop · 2G for six minutes",
    body: "Enough. Only the 8 new visits travel, a few kilobytes, and the district office sees them before the bus leaves.",
    usually: "A full re-upload that times out, or duplicates when the retry fires twice.",
  },
  {
    at: at(13, 5),
    title: "Same house, two people",
    body: "At the office, the supervisor corrects Sunita Devi's phone number. In Kheda, offline, Kamla records her second tetanus dose. Neither knows about the other.",
  },
  {
    at: at(14, 40),
    title: "Merged, not overwritten",
    body: "Different fields, different people: both changes survive. The phone and the server end up with exactly the same record.",
    usually: "Whoever syncs last silently erases the other person's change.",
  },
  {
    at: at(16, 30),
    title: "Battery 3% · app closed",
    body: "Five visits are still waiting. Closing the app, a reboot, a crash: the outbox lives in the phone's storage, not in memory.",
    usually: "Unsent work lives in memory and dies with the app.",
  },
  {
    at: at(18, 30),
    title: "Back in town",
    body: "Everything sends on its own. 23 visits, none lost, none duplicated. The server is one small program on the district office's own machine.",
  },
];

export function beatAt(t) {
  let current = BEATS[0];
  for (const b of BEATS) if (t >= b.at) current = b;
  return current;
}

// Everything visible at clock time t.
export function stateAt(t) {
  const recorded = VISITS.filter((v) => v.at <= t);
  const onServer = recorded.filter((v) => v.syncedAt <= t);
  const appOpen = !(t >= APP_CLOSED.from && t < APP_CLOSED.to);
  const bars = signalAt(t);
  // A sync burst is visible for a few minutes after each connection begins.
  const syncing = recorded.some((v) => v.syncedAt <= t && t - v.syncedAt < 4 && v.syncedAt > v.at);
  return {
    clock: clockLabel(t),
    bars,
    online: bars > 0,
    appOpen,
    recorded,
    onServer,
    outbox: recorded.length - onServer.length,
    syncing,
    supervisorEdited: t >= CONFLICT.supervisorEditAt,
    workerEdited: t >= CONFLICT.workerEditAt,
    merged: t >= CONFLICT.mergedAt,
    beat: beatAt(t),
  };
}
