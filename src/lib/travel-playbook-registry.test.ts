import assert from "node:assert/strict";
import test from "node:test";
import { adaptPlaybook, guardSourceCoverage, type PlaybookInput } from "./travel-playbook.ts";
import { STARTER_FACTS } from "./travel-playbook-facts.ts";
import { PLAYBOOKS } from "./travel-playbooks.ts";
import {
  bootstrapPopularPlaybooks,
  buildPlaybook,
  ensureTravelPlaybook,
  extractVoyageAreas,
  forgetPlaybook,
  listPlaybookCoverage,
  listPlaybooks,
  playbookBuildCount,
  playbookChildren,
  playbookGeminiCalls,
  resetPlaybookBuildCount,
  resetPlaybookRegistryForTests,
  setPlaybookReaders,
  validatePlaybook,
} from "./travel-playbook-registry.ts";

const trip = (destination: string, nights: number, extra: Partial<PlaybookInput> = {}): PlaybookInput => ({
  destination,
  nights,
  pace: "balanced",
  oneBase: true,
  interests: [],
  styles: ["comfort"],
  balance: "balanced",
  firstVisit: true,
  childAges: [],
  ...extra,
});

test.beforeEach(() => {
  resetPlaybookRegistryForTests();
});

test("curated seeds stay, and starters are built by the registry rather than a second hand-written list", () => {
  const seeded = bootstrapPopularPlaybooks(80);
  const ids = new Set(listPlaybooks().map((book) => book.id));
  for (const book of PLAYBOOKS) {
    assert.equal(ids.has(book.id), true);
    assert.equal(listPlaybooks().find((item) => item.id === book.id)?.status, "CURATED");
  }
  assert.equal(seeded.failed.length, 0);
  assert.ok(seeded.built.length >= 30);
  assert.equal(seeded.built.length, STARTER_FACTS.length);
  const again = bootstrapPopularPlaybooks(80);
  assert.equal(again.built.length, 0);
});

test("London is built once and the second request does not research again", async () => {
  assert.equal(listPlaybooks().some((book) => book.id === "london"), false);
  resetPlaybookBuildCount();
  const first = await ensureTravelPlaybook("London");
  assert.equal(first?.id, "london");
  assert.equal(first?.scope, "city");
  assert.equal(first?.status, "GENERATED");
  assert.notEqual(first?.sourceCoverage, "MULTI_OPERATOR_CONSENSUS");
  assert.equal(playbookBuildCount(), 1);
  assert.equal(playbookGeminiCalls(), 0);
  const second = await ensureTravelPlaybook("London");
  assert.equal(second?.id, "london");
  assert.equal(playbookBuildCount(), 1);
  assert.equal(playbookGeminiCalls(), 0);
  const plan = adaptPlaybook(trip("London", 5), listPlaybooks());
  assert.equal(plan?.id, "london");
  assert.ok(plan?.days.some((day) => day.areaName === "Windsor" && day.visitMode === "DAY_TRIP"));
  assert.equal(plan?.view.title, "Kairos Classic");
  assert.match(plan?.view.line ?? "", /established travel patterns/i);
  assert.equal(new Set(plan?.days.map((day) => day.stayName)).size, 1);
  const food = adaptPlaybook(trip("London", 5, { interests: ["food"] }), listPlaybooks());
  const family = adaptPlaybook(trip("London", 5, { childAges: [4] }), listPlaybooks());
  assert.equal(food?.id, "london");
  assert.equal(family?.id, "london");
  assert.equal(listPlaybooks().filter((book) => book.id === "london").length, 1);
  assert.notEqual(food?.view.version, family?.view.version);
});

test("Hokkaido is its own regional playbook, not the Japan classic", async () => {
  const book = await ensureTravelPlaybook("Hokkaido");
  assert.equal(book?.id, "hokkaido");
  assert.equal(book?.scope, "region");
  assert.equal(book?.parentId, "japan");
  const plan = adaptPlaybook(trip("Hokkaido", 7, { oneBase: false, balance: "nature", interests: ["nature"] }), listPlaybooks());
  assert.equal(plan?.id, "hokkaido");
  assert.notEqual(plan?.id, "japan");
  const stays = plan?.days.map((day) => day.stayName) ?? [];
  assert.ok(stays.includes("Sapporo"));
  assert.ok(stays.includes("Furano"));
  assert.equal(stays.includes("Tokyo"), false);
  assert.ok(plan?.days.some((day) => day.areaName === "Otaru"));
});

test("Barcelona is a city playbook with a Montserrat day", async () => {
  const plan = adaptPlaybook(trip("Barcelona", 4), listPlaybooks().concat());
  const book = await ensureTravelPlaybook("Barcelona");
  assert.equal(book?.scope, "city");
  const next = adaptPlaybook(trip("Barcelona", 4), listPlaybooks());
  assert.equal(next?.id, "barcelona");
  assert.ok(next?.days.some((day) => /Sagrada|Gothic|Eixample/i.test(day.areaName)));
  assert.ok(next?.days.some((day) => day.areaName === "Montserrat" && day.visitMode !== "STAY"));
  assert.equal(plan, null);
});

test("Bali uses more than one base", async () => {
  await ensureTravelPlaybook("Bali");
  const plan = adaptPlaybook(trip("Bali", 6), listPlaybooks());
  const stays = [...new Set(plan?.days.map((day) => day.stayName))];
  assert.ok(stays.includes("Ubud"));
  assert.ok(stays.includes("Seminyak"));
  assert.equal(plan?.scope, "island");
  assert.ok((plan?.days.length ?? 0) >= 4);
});

test("New Zealand South Island is a road, and it does not collapse into the country book", async () => {
  await ensureTravelPlaybook("New Zealand");
  await ensureTravelPlaybook("New Zealand South Island");
  const plan = adaptPlaybook(trip("New Zealand South Island", 10, { oneBase: false, balance: "nature" }), listPlaybooks());
  assert.equal(plan?.id, "nz-south-island");
  assert.equal(plan?.scope, "road");
  const stays = [...new Set(plan?.days.map((day) => day.stayName))];
  assert.ok(stays.length >= 3);
  assert.ok(stays.includes("Christchurch"));
  assert.ok(stays.includes("Queenstown"));
  assert.equal(stays.includes("Auckland"), false);
});

test("Austria, Czech Republic, and Hungary compose without a stored combination", async () => {
  await ensureTravelPlaybook("Austria");
  await ensureTravelPlaybook("Czech Republic");
  await ensureTravelPlaybook("Hungary");
  assert.equal(listPlaybooks().some((book) => /austria.*czech|czech.*hungary/i.test(book.id)), false);
  const plan = adaptPlaybook(trip("Austria, Czech Republic, Hungary", 10, { oneBase: false }), listPlaybooks());
  assert.equal(plan?.scope, "multi");
  const stays = plan?.days.map((day) => day.stayName) ?? [];
  const at = (name: string) => stays.indexOf(name);
  assert.ok(at("Prague") >= 0);
  assert.ok(at("Prague") < at("Vienna"));
  assert.ok(at("Vienna") < at("Budapest"));
});

test("a long-tail destination is built from remaining sources when an operator source throws", async () => {
  setPlaybookReaders({
    operators: async () => {
      throw new Error("operator down");
    },
    openGuides: async () => ({
      areas: [
        { name: "Ljubljana", section: "city" },
        { name: "Lake Bled", section: "day-trip" },
        { name: "Julian Alps", section: "region" },
      ],
      sources: [
        {
          name: "Wikivoyage Slovenia",
          sourceType: "wikivoyage",
          sourceUrl: "https://en.wikivoyage.org/wiki/Slovenia",
          stops: ["Ljubljana", "Lake Bled", "Julian Alps"],
          facts: ["Open-guide place names only."],
        },
        {
          name: "Wikipedia Slovenia",
          sourceType: "wikipedia",
          sourceUrl: "https://en.wikipedia.org/wiki/Slovenia",
          stops: ["Ljubljana", "Lake Bled"],
          facts: ["Identity only. Article text is not stored."],
        },
      ],
    }),
    locate: async (name) => {
      const points: Record<string, { latitude: number; longitude: number }> = {
        Ljubljana: { latitude: 46.0569, longitude: 14.5058 },
        "Lake Bled": { latitude: 46.362, longitude: 14.094 },
        "Julian Alps": { latitude: 46.38, longitude: 13.84 },
      };
      return points[name] ?? null;
    },
  });
  const book = await ensureTravelPlaybook("Slovenia", { latitude: 46.0569, longitude: 14.5058, countryCode: "SI", scope: "country" });
  assert.ok(book);
  assert.equal(book?.status, "PROVISIONAL");
  assert.equal(book?.sourceCoverage, "OPEN_GUIDE_ONLY");
  assert.notEqual(book?.sourceCoverage, "MULTI_OPERATOR_CONSENSUS");
  assert.match(book?.warnings?.join(" ") ?? "", /unavailable/i);
  assert.ok(book?.nodes.some((node) => node.name === "Ljubljana"));
  assert.ok(book?.nodes.some((node) => node.name === "Lake Bled"));
  const plan = adaptPlaybook(trip("Slovenia", 7, { oneBase: false }), listPlaybooks());
  assert.equal(plan?.id, "slovenia");
  assert.notEqual(plan, null);
  const again = await ensureTravelPlaybook("Slovenia");
  assert.equal(again?.id, book?.id);
  assert.equal(playbookGeminiCalls(), 0);
});

test("with no guide and no operator, a resolved centre still plans and does not claim consensus", async () => {
  setPlaybookReaders({
    operators: async () => null,
    openGuides: async () => null,
  });
  const book = await ensureTravelPlaybook("Slovenia", { latitude: 46.0569, longitude: 14.5058, countryCode: "SI", scope: "country" });
  assert.equal(book?.status, "PROVISIONAL");
  assert.equal(book?.confidence, "low");
  assert.equal(book?.sourceCoverage, "GEOGRAPHY_ONLY");
  const plan = adaptPlaybook(trip("Slovenia", 7), listPlaybooks());
  assert.ok(plan);
  assert.equal(plan?.view.title, "Kairos Curated");
  assert.match(plan?.view.line ?? "", /best destination information currently available/i);
});

test("Kyoto is derived from Japan without becoming the Tokyo classic", async () => {
  const book = await ensureTravelPlaybook("Kyoto");
  assert.equal(book?.id, "kyoto");
  assert.equal(book?.parentId, "japan");
  assert.ok(book?.nodes.some((node) => node.name === "Nara"));
  assert.equal(book?.nodes.some((node) => node.name === "Tokyo"), false);
  const plan = adaptPlaybook(trip("Kyoto", 5), listPlaybooks());
  assert.equal(plan?.days.every((day) => day.stayName === "Kyoto"), true);
  assert.ok(plan?.days.some((day) => day.areaName === "Nara"));
});

test("founder coverage and review do not invent operator consensus", async () => {
  bootstrapPopularPlaybooks(80);
  const coverage = listPlaybookCoverage();
  assert.match(coverage, /Destination \| Scope \| Status \| Confidence \| Sources \| Verified/);
  assert.match(coverage, /Japan \| country \| CURATED/);
  assert.match(coverage, /London \| city \| GENERATED/);
  assert.match(coverage, /Hokkaido \| region \| GENERATED/);
  const japan = listPlaybooks().find((book) => book.id === "japan");
  const sheet = (await buildPlaybook("Japan")).sheet;
  assert.match(sheet, /Scope: country/);
  assert.match(sheet, /Confidence: medium/);
  assert.match(sheet, /Source coverage: OPEN_GUIDE_ONLY/);
  assert.match(sheet, /Sources:/);
  assert.doesNotMatch(sheet, /MULTI_OPERATOR_CONSENSUS/);
  assert.equal(guardSourceCoverage(japan?.references ?? [], "MULTI_OPERATOR_CONSENSUS"), "OPEN_GUIDE_ONLY");
  const portugal = await buildPlaybook("Portugal");
  assert.equal(portugal.built, true);
  assert.match(portugal.sheet, /Lisbon/);
  assert.match(portugal.sheet, /Scope: country/);
  assert.equal(playbookGeminiCalls(), 0);
  const children = playbookChildren("japan").map((book) => book.id);
  assert.ok(children.includes("hokkaido"));
  assert.ok(children.includes("tokyo"));
  assert.ok(children.includes("nagoya"));
});

test("a playbook that points at a missing place is rejected", () => {
  const broken = structuredClone(PLAYBOOKS[0]);
  broken.bands[0].days[0].node = "missing-place";
  const result = validatePlaybook(broken);
  assert.equal(result.ok, false);
});

test("wikivoyage headings become place names and the page body is not kept", () => {
  const areas = extractVoyageAreas(`
== Understand ==
This paragraph must not become a stop. [[Ignore Me]]
== Regions ==
* [[Alentejo]]
* [[Algarve]]
== Cities ==
* [[Lisbon]]
* [[Porto|Oporto]]
== Other destinations ==
* [[Sintra]]
== Day trips ==
* [[Cascais]]
`);
  assert.deepEqual(areas.map((area) => area.name), ["Alentejo", "Algarve", "Lisbon", "Oporto", "Sintra", "Cascais"]);
  assert.equal(areas.some((area) => area.name === "Ignore Me"), false);
});

test("forgetting a generated playbook allows one rebuild and does not delete a curated seed", async () => {
  await ensureTravelPlaybook("London");
  forgetPlaybook("london");
  assert.equal(listPlaybooks().some((book) => book.id === "london"), false);
  resetPlaybookBuildCount();
  await ensureTravelPlaybook("London");
  assert.equal(playbookBuildCount(), 1);
  forgetPlaybook("japan");
  assert.equal(listPlaybooks().some((book) => book.id === "japan"), true);
});
