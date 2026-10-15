import assert from "node:assert/strict";
import test from "node:test";
import {
  commercialNameMatch,
  commonsFileTitle,
  isDirectImageUrl,
  isPermittedPhotoUrl,
  photoFromImageInfo,
  scoreCommonsFile,
  searchPhotoOk,
  strongIdentityMatch,
} from "./travel-photo.ts";

const TOKUSPARQL = "http://commons.wikimedia.org/wiki/Special:FilePath/View%20of%20Tokugawa%20Art%20Museum%20%281%29%2C%20Tokugawa-cho%20Higashi%20Ward%20Nagoya%202021.jpg";

test("a Wikidata file path is decoded once, not encoded again", () => {
  assert.equal(
    commonsFileTitle(TOKUSPARQL),
    "File:View of Tokugawa Art Museum (1), Tokugawa-cho Higashi Ward Nagoya 2021.jpg",
  );
  const popped = TOKUSPARQL.split("/").pop() ?? "";
  const broken = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(popped)}?width=640`;
  assert.equal(broken.includes("%2520"), true);
  assert.equal(commonsFileTitle(broken), "File:View of Tokugawa Art Museum (1), Tokugawa-cho Higashi Ward Nagoya 2021.jpg");
  assert.equal(isDirectImageUrl(broken), false);
  assert.equal(isDirectImageUrl("https://commons.wikimedia.org/wiki/Special:FilePath/View.jpg"), false);
});

test("a French Wikipedia file page is still a Commons file", () => {
  assert.equal(
    commonsFileTitle("https://fr.wikipedia.org/wiki/Fichier:Tour_Eiffel_Wikimedia_Commons.jpg"),
    "File:Tour Eiffel Wikimedia Commons.jpg",
  );
  assert.equal(commonsFileTitle("https://commons.wikimedia.org/wiki/Category:Eiffel_Tower"), "");
});

test("only real Wikimedia image hosts can be used as an img src", () => {
  assert.equal(isDirectImageUrl("https://upload.wikimedia.org/wikipedia/commons/f/f3/View.jpg"), true);
  assert.equal(isDirectImageUrl("https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/View.jpg/960px-View.jpg"), true);
  assert.equal(isDirectImageUrl("https://commons.wikimedia.org/wiki/File:View.jpg"), false);
  assert.equal(isDirectImageUrl("http://upload.wikimedia.org/wikipedia/commons/a.jpg"), false);
});

test("commons ranking prefers a building exterior over a logo or map", () => {
  const exterior = scoreCommonsFile("File:View of Tokugawa Art Museum exterior.jpg", 960, 640, "image/jpeg");
  const logo = scoreCommonsFile("File:Tokugawa Art Museum logo.svg", 200, 200, "image/svg+xml");
  const map = scoreCommonsFile("File:Location map of the museum.png", 400, 300, "image/png");
  assert.ok(exterior > logo);
  assert.ok(exterior > map);
  assert.ok(logo < 0);
});

test("commons search requires a strong identity match", () => {
  assert.equal(strongIdentityMatch("Tokugawa Art Museum", "File:View of Tokugawa Art Museum (1).jpg"), true);
  assert.equal(strongIdentityMatch("Merlion", "File:Merlion statue Singapore.jpg"), true);
  assert.equal(strongIdentityMatch("Gardens by the Bay", "File:Gardens by the Bay supertrees.jpg"), true);
  assert.equal(strongIdentityMatch("Northwind Xylophone Footbridge", "File:Random subway map of Tokyo.jpg"), false);
  assert.equal(searchPhotoOk("Louvre Museum", "File:Centaur & Cupid, Louvre Museum.jpg"), false);
  assert.equal(searchPhotoOk("Louvre Museum", "File:Louvre Museum courtyard at night.jpg"), true);
});

test("licence text is copied from Commons metadata and never invented", () => {
  const photo = photoFromImageInfo("wikidata_image", {
    title: "File:View of Tokugawa Art Museum (1), Tokugawa-cho Higashi Ward Nagoya 2021.jpg",
    imageinfo: [{
      thumburl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/View.jpg/960px-View.jpg?utm_source=commons&utm_campaign=imageinfo",
      thumbwidth: 960,
      thumbheight: 640,
      url: "https://upload.wikimedia.org/wikipedia/commons/f/f3/View.jpg?utm_source=commons",
      descriptionurl: "https://commons.wikimedia.org/wiki/File:View.jpg",
      mime: "image/jpeg",
      width: 1500,
      height: 1000,
      extmetadata: {
        LicenseShortName: { value: "CC BY-SA 4.0" },
        LicenseUrl: { value: "https://creativecommons.org/licenses/by-sa/4.0" },
        Artist: { value: "<a href=\"https://commons.wikimedia.org/wiki/User:Tomio344456\">Tomio344456</a>" },
        AttributionRequired: { value: "true" },
      },
    }],
  });
  assert.ok(photo);
  assert.equal(photo?.license, "CC BY-SA 4.0");
  assert.equal(photo?.creator, "Tomio344456");
  assert.equal(photo?.attributionRequired, true);
  assert.equal(photo?.thumbnailUrl.includes("utm_"), false);
  assert.equal(photo?.width, 960);
  const bare = photoFromImageInfo("wikidata_image", {
    title: "File:Bare.jpg",
    imageinfo: [{
      thumburl: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Bare.jpg",
      url: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Bare.jpg",
      descriptionurl: "https://commons.wikimedia.org/wiki/File:Bare.jpg",
      mime: "image/jpeg",
    }],
  });
  assert.equal(bare?.license, "");
  assert.equal(bare?.creator, "");
  assert.equal(bare?.attributionRequired, true);
});

test("commercial names match only when they are the same venue", () => {
  assert.equal(commercialNameMatch("丸八寿司", "丸八寿司"), true);
  assert.equal(commercialNameMatch("BSD鍋", "BSD 鍋"), true);
  assert.equal(commercialNameMatch("Maruhachi Sushi", "maruhachi sushi"), true);
  assert.equal(commercialNameMatch("丸八寿司", "Maruhachi Sushi"), false);
  assert.equal(commercialNameMatch("寿司", "丸八寿司"), false);
  assert.equal(commercialNameMatch("Cafe", "Cafe de Something Else"), false);
});

test("permitted photo hosts are the configured sources only", () => {
  assert.equal(isPermittedPhotoUrl("https://s3-media0.fl.yelpcdn.com/bphoto/abc/o.jpg"), true);
  assert.equal(isPermittedPhotoUrl("https://fastly.4sqi.net/img/general/300x300/abc.jpg"), true);
  assert.equal(isPermittedPhotoUrl("https://images.mapillary.com/abc.jpg"), true);
  assert.equal(isPermittedPhotoUrl("https://panoramax.osm.tw/api/pictures/abc/thumb.jpg"), true);
  assert.equal(isPermittedPhotoUrl("https://upload.wikimedia.org/wikipedia/commons/a/a0/View.jpg"), true);
  assert.equal(isPermittedPhotoUrl("http://s3-media0.fl.yelpcdn.com/a.jpg"), false);
  assert.equal(isPermittedPhotoUrl("https://commons.wikimedia.org/wiki/Special:FilePath/View.jpg"), false);
  assert.equal(isPermittedPhotoUrl("https://maps.googleapis.com/maps/api/place/photo"), false);
  assert.equal(isPermittedPhotoUrl("https://example.com/restaurant.jpg"), false);
});
