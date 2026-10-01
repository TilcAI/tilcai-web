import assert from "node:assert/strict";
import test from "node:test";
import {
  businessAction, businessProblems, businesses, publicBusinesses,
  type BusinessActionKind, type BusinessConnection, type BusinessProfile,
} from "../src/lib/content/businesses.ts";
import { previewBusinesses } from "../src/lib/content/businesses.preview.ts";

const base: BusinessProfile = {
  id: "b-1", slug: "b-1", name: "Example", category: "digital", serviceSummaryKey: "exampleDigital",
  relationship: "participant", connection: "planned", publicationApproved: true, mediaApproved: false,
  action: "profile", profileHref: "/businesses/b-1",
};
const kind = (over: Partial<BusinessProfile>) => businessAction({ ...base, ...over }).kind;

test("only approved, non-fixture profiles reach the public grid", () => {
  const list: BusinessProfile[] = [
    { ...base, id: "approved" },
    { ...base, id: "unapproved", publicationApproved: false },
    { ...base, id: "fixture", previewOnly: true },
    { ...base, id: "fixture-unapproved", previewOnly: true, publicationApproved: false },
  ];
  assert.deepEqual(publicBusinesses(list).map((b) => b.id), ["approved"]);
});

test("design fixtures can never be published, even if mistakenly listed in the public registry", () => {
  assert.ok(previewBusinesses.length >= 4);
  assert.deepEqual(publicBusinesses(previewBusinesses), []);
  for (const fixture of previewBusinesses) {
    assert.equal(fixture.previewOnly, true);
    assert.equal(fixture.publicationApproved, false);
    assert.equal(fixture.mediaApproved, false);
    assert.deepEqual(businessProblems(fixture), [], fixture.id);
  }
  assert.deepEqual(publicBusinesses([...businesses, ...previewBusinesses]).filter((b) => b.previewOnly), []);
});

test("the public registry is consistent: unique ids and slugs, no fixtures, no data problems", () => {
  assert.equal(new Set(businesses.map((b) => b.id)).size, businesses.length);
  assert.equal(new Set(businesses.map((b) => b.slug)).size, businesses.length);
  for (const business of businesses) {
    assert.notEqual(business.previewOnly, true, `${business.id} is a fixture`);
    assert.deepEqual(businessProblems(business), [], business.id);
  }
});

test("'Buy' is offered only with a live connection, a validated purchase flow and a destination", () => {
  const connections: BusinessConnection[] = ["planned", "pilot", "testnet", "live"];
  const actions: BusinessActionKind[] = ["profile", "scenario", "inquiry", "purchase"];
  const flags = [true, false, undefined];
  const hrefs = ["/buy", undefined] as const;
  let purchases = 0;
  for (const connection of connections) for (const action of actions) for (const flow of flags)
    for (const inquiry of flags) for (const purchaseHref of hrefs) for (const inquiryHref of hrefs) {
      const result = businessAction({
        ...base, connection, action, purchaseFlowOperational: flow, inquiryOperational: inquiry,
        purchaseHref, inquiryHref, scenarioHref: "#demo",
      });
      if (result.kind === "purchase") {
        purchases += 1;
        assert.equal(connection, "live");
        assert.equal(action, "purchase");
        assert.equal(flow, true);
        assert.equal(result.href, "/buy");
      }
    }
  assert.ok(purchases > 0, "the purchase case itself must be reachable");
});

test("a requested action degrades toward the profile and never upgrades", () => {
  const ready = { purchaseHref: "/buy", inquiryHref: "/ask", scenarioHref: "#demo" } as const;
  // Everything operational: the requested action wins.
  const live = { ...ready, connection: "live" as const, purchaseFlowOperational: true, inquiryOperational: true };
  assert.equal(kind({ ...live, action: "purchase" }), "purchase");
  assert.equal(kind({ ...live, action: "inquiry" }), "inquiry");
  assert.equal(kind({ ...live, action: "scenario" }), "scenario");
  assert.equal(kind({ ...live, action: "profile" }), "profile", "a profile request is never upgraded");
  // Purchase requested but the flow is not validated: the best working option is offered instead.
  assert.equal(kind({ ...live, purchaseFlowOperational: false, action: "purchase" }), "inquiry");
  assert.equal(kind({ ...live, purchaseFlowOperational: false, inquiryOperational: false, action: "purchase" }), "scenario");
  assert.equal(kind({ ...live, purchaseFlowOperational: false, inquiryOperational: false, scenarioHref: undefined, action: "purchase" }), "profile");
  // An inquiry needs more than a planned connection.
  assert.equal(kind({ ...ready, connection: "planned", inquiryOperational: true, action: "inquiry" }), "scenario");
  // A requested action without its destination falls back instead of rendering a dead link.
  assert.equal(kind({ ...live, inquiryHref: undefined, action: "inquiry" }), "scenario");
  assert.equal(businessAction({ ...base, action: "scenario" }).href, "/businesses/b-1");
});

test("every preview fixture shows the intended case and none offers 'Buy'", () => {
  assert.deepEqual(previewBusinesses.map((b) => businessAction(b).kind), ["profile", "scenario", "scenario", "inquiry"]);
});

test("business data problems are reported", () => {
  const problems = (over: Partial<BusinessProfile>) => businessProblems({ ...base, ...over });
  assert.deepEqual(problems({}), []);
  assert.match(problems({ slug: "Bad Slug" }).join(), /slug/);
  assert.match(problems({ name: "  " }).join(), /name/);
  assert.match(problems({ profileHref: "//evil.example" as never }).join(), /profileHref/);
  assert.match(problems({ scenarioHref: "javascript:alert(1)" as never }).join(), /scenarioHref/);
  assert.match(problems({ mediaApproved: true }).join(), /logo or banner is missing/);
  assert.match(problems({ logoAsset: "/assets/businesses/a.webp" }).join(), /without mediaApproved/);
  assert.match(problems({ mediaApproved: true, logoAsset: "/x/a.webp", bannerAsset: "/assets/businesses/b.webp" }).join(), /\/assets\/businesses\//);
  assert.match(problems({ connection: "pilot", purchaseFlowOperational: true }).join(), /live connection/);
  assert.match(problems({ previewOnly: true }).join(), /fixture cannot be approved/);
  assert.deepEqual(problems({ mediaApproved: true, logoAsset: "/assets/businesses/a.webp", bannerAsset: "/assets/businesses/b.webp" }), []);
});
