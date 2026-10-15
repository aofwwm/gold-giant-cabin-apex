import assert from "node:assert/strict";
import test from "node:test";
import { buildPlaceStory, formatOpeningHours, isGenericCopy } from "./travel-story.ts";

const EIFFEL_EXTRACT = "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower from 1887 to 1889.";
const CHAMP_EXTRACT = "The Champ de Mars is a large public greenspace in Paris, France, located between the Eiffel Tower and the École Militaire. The park is named after the Campus Martius in Rome.";

test("Eiffel copy is specific, scored, and not a database filler line", () => {
  const story = buildPlaceStory({
    name: "Eiffel Tower",
    displayName: "Eiffel Tower",
    category: "attraction",
    importance: "iconic",
    indoor: false,
    city: "Paris",
    description: "tower located on the Champ de Mars in Paris, France",
    extract: EIFFEL_EXTRACT,
    opening: "09:30-23:45; Jun 21-Sep 02: 09:00-00:45; Jul 14,Jul 15 off",
  }, ["Champ de Mars", "Trocadéro"]);
  assert.match(story.whyIconic, /wrought-iron|1887|1889/i);
  assert.doesNotMatch(`${story.whyIconic} ${story.whyGo} ${story.shortDescription}`, /open place list|private ranking|popular tourist/i);
  assert.equal(story.experienceProfile.views, 5);
  assert.equal(story.experienceProfile.architecture, 5);
  assert.ok((story.experienceProfile.romance ?? 0) >= 4);
  assert.equal(story.visitLabel, "1.5–2.5 hr");
  assert.deepEqual(story.nearbyCombos, ["Champ de Mars", "Trocadéro"]);
  assert.ok(story.bestFor.includes("First visit"));
  assert.equal(isGenericCopy(story.whyGo), false);
});

test("Champ de Mars reads as green space and views, not a foreign label", () => {
  const story = buildPlaceStory({
    name: "Champ de Mars",
    displayName: "Field of Mars",
    category: "park",
    importance: "major",
    indoor: false,
    city: "Paris",
    description: "public park in Paris, France",
    extract: CHAMP_EXTRACT,
  });
  assert.equal(story.experienceProfile.nature, 5);
  assert.ok((story.experienceProfile.views ?? 0) >= 4);
  assert.match(story.whyGo, /green space|view|walk/i);
  assert.doesNotMatch(story.whyGo, /战神广场/);
  assert.equal(story.experienceProfile.food, undefined);
});

test("opening hours are not dumped as raw OSM syntax", () => {
  const hours = formatOpeningHours("09:30-23:45; Jun 21-Sep 02: 09:00-00:45; Jul 14,Jul 15 off");
  assert.equal(hours.summary, "9:30 AM – 11:45 PM");
  assert.equal(hours.seasonal, true);
  assert.equal(formatOpeningHours("Tu-Su 10:00-17:00").summary, "Tue–Sun 10:00 AM – 5:00 PM");
});

test("a museum does not grow an empty nature score", () => {
  const story = buildPlaceStory({
    name: "Louvre Museum",
    category: "museum",
    importance: "iconic",
    indoor: true,
    description: "art museum in Paris",
    extract: "The Louvre, or the Louvre Museum, is a national art museum in Paris, France. It is the most-visited museum in the world.",
  });
  assert.equal(story.experienceProfile.culture, 5);
  assert.equal(story.experienceProfile.nature, undefined);
  assert.equal(story.visitLabel, "2–3 hr");
});
