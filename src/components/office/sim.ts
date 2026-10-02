// Local, deterministic simulation of TilcAI operations. No network, no wallets, no funds.
// Amounts are integer hundredths of USDC ("cents") to avoid floating-point money.
import { roomAt, SPOTS } from "./layout";
import { findPath } from "./pathfinding";
import type { AgentInfo, Cell, EventKind, OfficeEvent, OfficeStats, OfficeStrings, ReasonCode, Role, RoomId, SellerKey, TaskKind } from "./types";

export const ROLE_COLORS: Record<Role, string> = {
  buyer: "#4C66FF",
  seller: "#FF79C6",
  policy: "#6F4CFF",
  budget: "#A994FF",
  guardian: "#FFA801",
  vault: "#66D8FF",
  receipts: "#4BCA81",
  barista: "#C5C4C6",
};

const SKINS = ["#F2C9A5", "#D9A27A", "#B9805A", "#8D5A3C", "#F5D5B8", "#6E452D"];
const HAIRS = ["#1B1626", "#3A2A20", "#5B3B24", "#141018", "#7A5A3A", "#2B2B38"];

const SELLERS: { key: SellerKey; min: number; max: number; weight: number }[] = [
  { key: "cinema", min: 800, max: 1200, weight: 3 },
  { key: "data", min: 50, max: 200, weight: 3 },
  { key: "risk", min: 5, max: 50, weight: 3 },
  { key: "travel", min: 1200, max: 3000, weight: 2 },
];

const POLICY = { perPaymentLimit: 2500, approvalThreshold: 1000, rootCap: 15000, buyerCap: 3000, period: 180 };

type Scenario = "normal" | "injection" | "duplicate" | "approval" | "purchase";
type Phase =
  | "idle" | "toSeller" | "quote" | "toCore" | "policy" | "denied" | "toApproval" | "approval"
  | "toVault" | "settle" | "toReceipts" | "receipt" | "toCafe" | "rest" | "toHome" | "wait";

interface Operation {
  seller: number;
  service: SellerKey;
  amount: number;
  cap: number;
  quote: number;
  hash: string;
  injected: boolean;
  forcedApprove: boolean;
  decision?: "ALLOW" | "DENY" | "REQUIRE_APPROVAL";
  reasons: ReasonCode[];
}

export interface Agent {
  id: number;
  role: Role;
  name: string;
  color: string;
  skin: string;
  hair: string;
  home: Cell;
  cell: Cell;
  px: number;
  py: number;
  path: Cell[];
  speed: number;
  walkPhase: number;
  moving: boolean;
  bubble: { text: string; until: number; born: number; tone: EventKind } | null;
  mark: { kind: "deny" | "allow" | "approval" | "pause"; until: number } | null;
  phase: Phase;
  timer: number;
  op: Operation | null;
  spot: string | null;
  ok: number;
  denied: number;
  leftCents: number;
  lastHash: string | null;
  task: TaskKind;
  sellerIndex?: number;
  onBreak?: boolean;
  retry?: (() => boolean) | null;
}

export interface Packet {
  fx: number; fy: number; tx: number; ty: number; born: number; dur: number; color: string;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function formatCents(cents: number, locale: "en" | "es"): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(Math.round(cents));
  const units = Math.floor(abs / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, locale === "es" ? "." : ",");
  const dec = String(abs % 100).padStart(2, "0");
  return `${sign}${units}${locale === "es" ? "," : "."}${dec}`;
}

const fill = (tpl: string, vars: Record<string, string | number>) => tpl.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));

const key = (c: Cell) => `${c.x},${c.y}`;

export class OfficeSim {
  agents: Agent[] = [];
  packets: Packet[] = [];
  time = 0;
  onEvent: ((e: OfficeEvent) => void) | null = null;

  private rnd: () => number;
  private s: OfficeStrings;
  private reserved = new Map<string, number>();
  private forced: Scenario[] = [];
  private eventId = 0;
  private quoteSeq = 4412;
  private ledger = 812040;
  private receiptSeq = 91;
  private orderSeq = 3301;
  private settledHashes = new Set<string>();
  private lastSettledHash: string | null = null;
  private periodStart = 0;
  private stats = { rootLeft: POLICY.rootCap, volume: 0, decisions: 0, allow: 0, deny: 0, approvals: 0, settled: 0, paused: false, frozen: false };
  private staff: Record<string, Agent> = {};

  constructor(strings: OfficeStrings, seed = 11) {
    this.s = strings;
    this.rnd = mulberry32(seed);
    this.spawn();
  }

  // ------------------------------------------------------------------ setup
  private make(role: Role, name: string, home: Cell, speed = 2.3): Agent {
    const a: Agent = {
      id: this.agents.length, role, name, color: ROLE_COLORS[role],
      skin: SKINS[Math.floor(this.rnd() * SKINS.length)], hair: HAIRS[Math.floor(this.rnd() * HAIRS.length)],
      home, cell: { ...home }, px: home.x + 0.5, py: home.y + 0.5, path: [], speed, walkPhase: this.rnd() * 6,
      moving: false, bubble: null, mark: null, phase: "idle", timer: 0, op: null, spot: null,
      ok: 0, denied: 0, leftCents: POLICY.buyerCap, lastHash: null, task: "idle",
    };
    this.agents.push(a);
    return a;
  }

  private spawn() {
    const s = this.s;
    SPOTS.hubSeats.forEach((seat, i) => {
      const a = this.make("buyer", fill(s.buyerName, { name: s.buyers[i % s.buyers.length] }), seat, 2.2 + this.rnd() * 0.5);
      a.timer = 0.6 + i * 1.7 + this.rnd() * 1.2;
    });
    SELLERS.forEach((sel, i) => { const a = this.make("seller", s.sellers[sel.key], SPOTS.sellerSeats[i]); a.sellerIndex = i; });
    this.staff.policy = this.make("policy", s.staff.policy, SPOTS.coreStaff[0]);
    this.staff.verifier = this.make("policy", s.staff.verifier, SPOTS.coreStaff[1]);
    this.staff.identity = this.make("policy", s.staff.identity, SPOTS.coreStaff[2]);
    this.staff.budget = this.make("budget", s.staff.budget, SPOTS.budgetStaff);
    this.staff.guardian = this.make("guardian", s.staff.guardian, SPOTS.approvalStaff);
    this.staff.soroban = this.make("vault", s.staff.soroban, SPOTS.vaultStaff[0]);
    this.staff.relayer = this.make("vault", s.staff.relayer, SPOTS.vaultStaff[1]);
    this.staff.receipts = this.make("receipts", s.staff.receipts, SPOTS.receiptsStaff);
    this.staff.barista = this.make("barista", s.staff.barista, SPOTS.baristaSeat);
    for (const a of this.agents) if (a.role !== "buyer") a.timer = 20 + this.rnd() * 40;
  }

  // ------------------------------------------------------------------ public API
  getStats(): OfficeStats {
    return {
      rootCapCents: POLICY.rootCap,
      rootLeftCents: this.stats.rootLeft,
      volumeCents: this.stats.volume,
      decisions: this.stats.decisions,
      allow: this.stats.allow,
      deny: this.stats.deny,
      approvals: this.stats.approvals,
      settled: this.stats.settled,
      periodLeft: Math.max(0, POLICY.period - (this.time - this.periodStart)),
      mandatePaused: this.stats.paused,
      frozen: this.stats.frozen,
    };
  }

  agentInfo(id: number): AgentInfo | null {
    const a = this.agents[id];
    if (!a) return null;
    return { id: a.id, name: a.name, role: a.role, task: this.stats.frozen ? "frozen" : a.task, ok: a.ok, denied: a.denied, room: roomAt(a.px, a.py), amountCents: a.op?.amount ?? null, decision: a.op?.decision ?? null };
  }

  command(cmd: "purchase" | "injection" | "duplicate" | "approval" | "togglePause" | "toggleKill") {
    const s = this.s;
    if (cmd === "togglePause") {
      this.stats.paused = !this.stats.paused;
      this.emit("system", this.stats.paused ? s.msg.paused : s.msg.resumed);
      this.staff.guardian.mark = { kind: this.stats.paused ? "pause" : "allow", until: this.time + 3 };
      this.say(this.staff.guardian, this.stats.paused ? s.msg.paused : s.msg.resumed, "system");
      return;
    }
    if (cmd === "toggleKill") {
      this.stats.frozen = !this.stats.frozen;
      this.emit("system", this.stats.frozen ? s.msg.kill : s.msg.revive);
      if (this.stats.frozen) this.say(this.staff.soroban, s.bubble.frozen, "deny", 4);
      return;
    }
    if (this.stats.frozen) return;
    this.forced.push(cmd);
    // Wake the idle buyer closest to starting.
    const idle = this.agents.filter((a) => a.role === "buyer" && a.phase === "idle").sort((a, b) => a.timer - b.timer)[0];
    if (idle) idle.timer = Math.min(idle.timer, 0.2);
  }

  update(dtRaw: number) {
    const dt = Math.min(dtRaw, 0.1);
    if (this.stats.frozen) {
      // Time keeps running for bubbles fading, but nobody moves or decides.
      this.time += dt;
      return;
    }
    this.time += dt;
    this.runTimers();
    if (this.time - this.periodStart >= POLICY.period) this.newPeriod();
    for (const a of this.agents) {
      this.move(a, dt);
      if (a.role === "buyer") this.buyerBrain(a, dt);
      else this.staffBrain(a, dt);
      if (a.bubble && a.bubble.until < this.time) a.bubble = null;
      if (a.mark && a.mark.until < this.time) a.mark = null;
    }
    this.packets = this.packets.filter((p) => this.time - p.born < p.dur);
  }

  // ------------------------------------------------------------------ helpers
  private emit(kind: EventKind, text: string) {
    this.onEvent?.({ id: ++this.eventId, kind, text, t: this.time });
  }

  private say(a: Agent, text: string, tone: EventKind, dur = 3.6) {
    a.bubble = { text, until: this.time + dur, born: this.time, tone };
  }

  private money(c: number) { return formatCents(c, this.s.locale); }

  private go(a: Agent, target: Cell): boolean {
    const p = findPath(a.cell, target);
    if (!p) return false;
    a.path = p;
    return true;
  }

  private reserve(a: Agent, options: readonly Cell[]): Cell | null {
    for (const c of options) {
      const k = key(c);
      const owner = this.reserved.get(k);
      if (owner === undefined || owner === a.id) {
        this.release(a);
        this.reserved.set(k, a.id);
        a.spot = k;
        return c;
      }
    }
    return null;
  }

  private release(a: Agent) {
    if (a.spot && this.reserved.get(a.spot) === a.id) this.reserved.delete(a.spot);
    a.spot = null;
  }

  private packet(from: Cell, to: Cell, color: string, dur = 1.3) {
    this.packets.push({ fx: from.x + 0.5, fy: from.y + 0.5, tx: to.x + 0.5, ty: to.y + 0.5, born: this.time, dur, color });
  }

  private move(a: Agent, dt: number) {
    if (!a.path.length) { a.moving = false; return; }
    a.moving = true;
    const next = a.path[0];
    const tx = next.x + 0.5, ty = next.y + 0.5;
    const dx = tx - a.px, dy = ty - a.py;
    const dist = Math.hypot(dx, dy);
    const step = a.speed * dt;
    a.walkPhase += dt * a.speed * 5.2;
    if (dist <= step) {
      a.px = tx; a.py = ty; a.cell = { ...next }; a.path.shift();
    } else {
      a.px += (dx / dist) * step; a.py += (dy / dist) * step;
    }
  }

  private newPeriod() {
    this.periodStart = this.time;
    this.stats.rootLeft = POLICY.rootCap;
    for (const a of this.agents) if (a.role === "buyer") a.leftCents = POLICY.buyerCap;
    this.emit("system", fill(this.s.msg.period, { cap: this.money(POLICY.rootCap) }));
  }

  // ------------------------------------------------------------------ staff
  private staffBrain(a: Agent, dt: number) {
    if (a.moving) return;
    // Occasional coffee breaks for a few staff roles keep the floor alive.
    const canBreak = a.role === "seller" || a === this.staff.verifier || a === this.staff.identity || a === this.staff.receipts;
    if (!canBreak) return;
    a.timer -= dt;
    if (a.timer > 0) return;
    if (a.onBreak) {
      if (a.cell.x !== a.home.x || a.cell.y !== a.home.y) { this.release(a); this.go(a, a.home); a.task = "walking"; }
      a.onBreak = false; a.task = "idle"; a.timer = 40 + this.rnd() * 50;
      return;
    }
    const onBreak = this.agents.filter((o) => o.onBreak).length;
    if (onBreak >= 2) { a.timer = 15; return; }
    const spot = this.reserve(a, [...SPOTS.cafeRest].sort(() => this.rnd() - 0.5));
    if (spot && this.go(a, spot)) {
      a.onBreak = true; a.task = "resting"; a.timer = 9 + this.rnd() * 8;
      if (this.rnd() < 0.5) this.say(a, this.s.bubble.rest, "system", 2.6);
    } else a.timer = 20;
  }

  // ------------------------------------------------------------------ buyers
  private pickScenario(): { scenario: Scenario; forced: boolean } {
    if (this.forced.length) return { scenario: this.forced.shift()!, forced: true };
    const r = this.rnd();
    if (r < 0.06) return { scenario: "injection", forced: false };
    if (r < 0.11 && this.lastSettledHash) return { scenario: "duplicate", forced: false };
    return { scenario: "normal", forced: false };
  }

  private startOperation(a: Agent): boolean {
    const { scenario, forced } = this.pickScenario();
    let sellerIdx: number;
    if (scenario === "approval") sellerIdx = 3;
    else if (scenario === "purchase") sellerIdx = 2;
    else {
      const total = SELLERS.reduce((t, s) => t + s.weight, 0);
      let r = this.rnd() * total; sellerIdx = 0;
      for (let i = 0; i < SELLERS.length; i++) { r -= SELLERS[i].weight; if (r <= 0) { sellerIdx = i; break; } }
    }
    const visit = SPOTS.sellerVisit[sellerIdx];
    if (this.reserved.has(key(visit))) { if (forced) this.forced.unshift(scenario); return false; }
    const sel = SELLERS[sellerIdx];
    let amount = Math.round((sel.min + this.rnd() * (sel.max - sel.min)) / 5) * 5;
    if (scenario === "approval") amount = Math.round((1200 + this.rnd() * 900) / 5) * 5;
    if (scenario === "purchase") amount = 5;
    const quote = this.quoteSeq++;
    let hash = `${a.id}:${sellerIdx}:${quote}`;
    if (scenario === "duplicate") hash = a.lastHash ?? this.lastSettledHash ?? hash;
    const cap = Math.ceil((amount * 1.2) / 100) * 100;
    a.op = { seller: sellerIdx, service: sel.key, amount, cap, quote, hash, injected: scenario === "injection", forcedApprove: scenario === "approval", reasons: [] };
    this.reserve(a, [visit]);
    this.go(a, visit);
    a.phase = "toSeller"; a.task = "walking";
    const vars = { buyer: a.name, seller: this.s.sellers[sel.key], service: this.s.services[sel.key], cap: this.money(cap) };
    this.emit("intent", fill(this.s.msg.intent, vars));
    this.say(a, fill(this.s.bubble.intent, vars), "intent", 3);
    return true;
  }

  private evaluate(a: Agent, op: Operation) {
    const reasons: ReasonCode[] = [];
    if (this.stats.paused) reasons.push("MANDATE_PAUSED");
    if (op.injected) reasons.push("PAYEE_NOT_ALLOWED");
    if (op.amount > POLICY.perPaymentLimit) reasons.push("PER_PAYMENT_LIMIT_EXCEEDED");
    if (this.settledHashes.has(op.hash)) reasons.push("DUPLICATE_PAYMENT_INTENT");
    if (!reasons.length && (op.amount > a.leftCents || op.amount > this.stats.rootLeft)) reasons.push("BUDGET_EXCEEDED");
    op.reasons = reasons;
    op.decision = reasons.length ? "DENY" : op.amount > POLICY.approvalThreshold ? "REQUIRE_APPROVAL" : "ALLOW";
  }

  private hold(a: Agent, op: Operation) {
    a.leftCents -= op.amount;
    this.stats.rootLeft -= op.amount;
    const text = fill(this.s.msg.hold, { amount: this.money(op.amount), left: this.money(this.stats.rootLeft) });
    this.emit("allow", text);
    this.say(this.staff.budget, fill(this.s.bubble.hold, { amount: this.money(op.amount) }), "allow", 3);
  }

  private deny(a: Agent, op: Operation, byPolicy = true) {
    this.stats.deny++;
    a.denied++;
    const reasons = op.reasons.map((r) => this.s.reasons[r]).join(" · ");
    a.mark = { kind: "deny", until: this.time + 2.8 };
    if (byPolicy) this.emit("deny", fill(this.s.msg.deny, { buyer: a.name, reasons }));
    this.packet(SPOTS.coreVisit[1], SPOTS.receiptsStaff, "#ED4A6D");
    const rid = `rc_${String(this.receiptSeq++).padStart(4, "0")}`;
    const t = this.time;
    setTimeoutSim(this, t + 1.3, () => {
      this.emit("receipt", fill(this.s.msg.receiptDeny, { rid, buyer: a.name, reason: this.s.reasons[op.reasons[0]] }));
      this.say(this.staff.receipts, fill(this.s.bubble.receipt, { rid }), "receipt", 2.6);
    });
  }

  private goHome(a: Agent, rest = false) {
    this.release(a);
    if (rest) {
      const spot = this.reserve(a, [...SPOTS.cafeRest].sort(() => this.rnd() - 0.5));
      if (spot && this.go(a, spot)) { a.phase = "toCafe"; a.task = "walking"; return; }
    }
    this.go(a, a.home);
    a.phase = "toHome"; a.task = "walking";
  }

  private buyerBrain(a: Agent, dt: number) {
    if (a.moving) return;
    const s = this.s;
    const op = a.op;
    switch (a.phase) {
      case "idle":
        a.task = "idle";
        a.timer -= dt;
        if (a.timer <= 0) { if (!this.startOperation(a)) a.timer = 1 + this.rnd() * 2; }
        return;
      case "toSeller": {
        if (!op) return;
        a.phase = "quote"; a.task = "quoting"; a.timer = 2.2;
        const seller = this.agents.find((x) => x.sellerIndex === op.seller)!;
        const vars = { seller: s.sellers[op.service], quote: op.quote, amount: this.money(op.amount) };
        this.emit("quote", fill(s.msg.quote, vars));
        this.say(seller, fill(s.bubble.quote, vars), "quote", 3.2);
        return;
      }
      case "quote":
        a.timer -= dt;
        if (a.timer > 0 || !op) return;
        if (op.injected) {
          // The manipulated response asks for a different payee and a larger amount.
          op.amount = 4000;
          this.emit("deny", fill(s.msg.injection, { buyer: a.name }));
          this.say(a, s.bubble.injection, "deny", 2.6);
        }
        if (this.settledHashes.has(op.hash)) {
          this.emit("deny", fill(s.msg.duplicate, { buyer: a.name }));
          this.say(a, s.bubble.duplicate, "deny", 2.6);
        }
        this.waitThen(a, () => {
          if (!this.reserve(a, SPOTS.coreVisit)) return false;
          this.go(a, this.reservedCell(a));
          a.phase = "toCore"; a.task = "walking";
          return true;
        });
        return;
      case "toCore":
        if (!op) return;
        a.phase = "policy"; a.task = "policy"; a.timer = 2.3;
        this.evaluate(a, op);
        this.stats.decisions++;
        this.say(this.staff.policy, fill(s.bubble[op.decision === "ALLOW" ? "allow" : op.decision === "DENY" ? "deny" : "approvalReq"], { buyer: a.name, amount: this.money(op.amount) }), op.decision === "DENY" ? "deny" : op.decision === "ALLOW" ? "allow" : "approval", 3);
        return;
      case "policy":
        a.timer -= dt;
        if (a.timer > 0 || !op) return;
        if (op.decision === "DENY") {
          this.deny(a, op);
          a.phase = "denied"; a.timer = 1.6;
          return;
        }
        if (op.decision === "REQUIRE_APPROVAL") {
          this.stats.approvals++;
          this.emit("approval", fill(s.msg.approvalReq, { buyer: a.name, amount: this.money(op.amount), threshold: this.money(POLICY.approvalThreshold) }));
          a.mark = { kind: "approval", until: this.time + 2.5 };
          this.waitThen(a, () => {
            if (!this.reserve(a, SPOTS.approvalVisit)) return false;
            this.go(a, this.reservedCell(a));
            a.phase = "toApproval"; a.task = "walking";
            return true;
          });
          return;
        }
        this.stats.allow++;
        this.emit("allow", fill(s.msg.allow, { buyer: a.name, amount: this.money(op.amount) }));
        this.packet(SPOTS.coreVisit[1], SPOTS.receiptsStaff, "#4BCA81");
        this.hold(a, op);
        this.toVault(a);
        return;
      case "denied":
        a.timer -= dt;
        if (a.timer > 0) return;
        a.op = null;
        this.goHome(a, false);
        return;
      case "toApproval":
        if (!op) return;
        a.phase = "approval"; a.task = "approval"; a.timer = 2.6;
        this.say(this.staff.guardian, fill(s.bubble.approvalReq, { buyer: a.name, amount: this.money(op.amount) }), "approval", 2.4);
        return;
      case "approval": {
        a.timer -= dt;
        if (a.timer > 0 || !op) return;
        const approve = op.forcedApprove || this.rnd() < 0.85;
        if (!approve) {
          op.reasons = ["HUMAN_REJECTED"]; op.decision = "DENY";
          this.emit("deny", fill(s.msg.rejected, { buyer: a.name }));
          this.say(this.staff.guardian, s.bubble.rejected, "deny", 2.6);
          this.deny(a, op, false);
          a.phase = "denied"; a.timer = 1.4;
          return;
        }
        this.stats.allow++;
        this.emit("approval", fill(s.msg.approved, { buyer: a.name, amount: this.money(op.amount) }));
        this.say(this.staff.guardian, s.bubble.approved, "allow", 2.4);
        this.hold(a, op);
        this.toVault(a);
        return;
      }
      case "toVault":
        if (!op) return;
        a.phase = "settle"; a.task = "settling"; a.timer = 2.4;
        this.ledger += 1 + Math.floor(this.rnd() * 7);
        this.emit("x402", fill(s.msg.x402, { ledger: this.ledger.toLocaleString(s.locale === "es" ? "es-BO" : "en-US"), amount: this.money(op.amount) }));
        this.say(this.staff.soroban, fill(s.bubble.x402, { amount: this.money(op.amount) }), "x402", 2.8);
        return;
      case "settle": {
        a.timer -= dt;
        if (a.timer > 0 || !op) return;
        const tx = Array.from({ length: 4 }, () => Math.floor(this.rnd() * 16).toString(16)).join("") + "…" + Array.from({ length: 4 }, () => Math.floor(this.rnd() * 16).toString(16)).join("");
        this.stats.volume += op.amount; this.stats.settled++;
        this.settledHashes.add(op.hash); this.lastSettledHash = op.hash; a.lastHash = op.hash;
        this.emit("x402", fill(s.msg.settled, { tx, amount: this.money(op.amount) }));
        a.mark = { kind: "allow", until: this.time + 2.2 };
        this.packet(SPOTS.vaultStaff[1], SPOTS.sellerSeats[op.seller], "#66D8FF", 1.8);
        this.waitThen(a, () => {
          if (!this.reserve(a, SPOTS.receiptsVisit)) return false;
          this.go(a, this.reservedCell(a));
          a.phase = "toReceipts"; a.task = "walking";
          return true;
        });
        return;
      }
      case "toReceipts": {
        if (!op) return;
        a.phase = "receipt"; a.task = "receipt"; a.timer = 1.8;
        const rid = `rc_${String(this.receiptSeq++).padStart(4, "0")}`;
        const order = `ord_${this.orderSeq++}`;
        this.emit("receipt", fill(s.msg.receipt, { rid, buyer: a.name, amount: this.money(op.amount) }));
        this.say(this.staff.receipts, fill(s.bubble.receipt, { rid }), "receipt", 2.6);
        const seller = this.agents.find((x) => x.sellerIndex === op.seller)!;
        const t = this.time;
        setTimeoutSim(this, t + 1.2, () => {
          this.emit("receipt", fill(s.msg.delivery, { seller: s.sellers[op.service], order }));
          this.say(seller, fill(s.bubble.delivery, { order }), "receipt", 2.6);
        });
        return;
      }
      case "receipt":
        a.timer -= dt;
        if (a.timer > 0) return;
        a.ok++;
        a.op = null;
        this.goHome(a, this.rnd() < 0.3);
        return;
      case "toCafe":
        a.phase = "rest"; a.task = "resting"; a.timer = 5 + this.rnd() * 6;
        if (this.rnd() < 0.4) this.say(a, s.bubble.rest, "system", 2.4);
        return;
      case "rest":
        a.timer -= dt;
        if (a.timer > 0) return;
        this.goHome(a, false);
        return;
      case "wait":
        a.timer -= dt;
        if (a.timer > 0) return;
        if (a.retry?.()) a.retry = null; else a.timer = 0.6;
        return;
      case "toHome":
        this.release(a);
        a.phase = "idle"; a.task = "idle"; a.timer = 2.5 + this.rnd() * 6;
        return;
    }
  }

  private toVault(a: Agent) {
    // Wait where we are until a signer is free.
    this.waitThen(a, () => {
      if (!this.reserve(a, SPOTS.vaultVisit)) return false;
      this.go(a, this.reservedCell(a));
      a.phase = "toVault"; a.task = "walking";
      return true;
    });
  }

  private waitThen(a: Agent, attempt: () => boolean) {
    if (attempt()) return;
    a.phase = "wait"; a.retry = attempt; a.timer = 0.6;
  }

  private reservedCell(a: Agent): Cell {
    const [x, y] = (a.spot ?? `${a.cell.x},${a.cell.y}`).split(",").map(Number);
    return { x, y };
  }

  /** Simulation-time timers (frozen together with the simulation). */
  timers: { at: number; fn: () => void }[] = [];
  runTimers() {
    const due = this.timers.filter((t) => t.at <= this.time);
    if (!due.length) return;
    this.timers = this.timers.filter((t) => t.at > this.time);
    for (const t of due) t.fn();
  }

  roomOf(a: Agent): RoomId | null { return roomAt(a.px, a.py); }
}

function setTimeoutSim(sim: OfficeSim, at: number, fn: () => void) {
  sim.timers.push({ at, fn });
}
