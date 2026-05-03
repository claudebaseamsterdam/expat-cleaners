import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CUSTOM_QUOTE_THRESHOLD_SQM,
  calculateDuration,
  formatDurationBreakdown,
  parseSqm,
  selectDeepCleanPackage,
  selectMovePackage,
  selectPackageId,
} from "./pricing.ts";

// ----------------------------------------------------------------------------
// Brief-required edge cases
// ----------------------------------------------------------------------------

test("studio at 30m²: 0-bed studio still gets 2h floor", () => {
  const r = calculateDuration({
    sqm: 30,
    bedrooms: 0,
    bathrooms: 1,
    homeType: "studio",
  });
  assert.deepEqual(r, { kind: "estimate", hours: 2 });
});

test("1-bed at 65m² is the floor: exactly 2h", () => {
  const r = calculateDuration({
    sqm: 65,
    bedrooms: 1,
    bathrooms: 1,
    homeType: "apartment",
  });
  assert.deepEqual(r, { kind: "estimate", hours: 2 });
});

test("1-bed at 80m²: one tier up the ladder, 2.5h", () => {
  const r = calculateDuration({
    sqm: 80,
    bedrooms: 1,
    bathrooms: 1,
    homeType: "apartment",
  });
  assert.deepEqual(r, { kind: "estimate", hours: 2.5 });
});

test("3-bed/2-bath at 70m²: bed/bath beats m²", () => {
  // m² ladder for 70m² → 2.5h
  // bed/bath = 2 + 0.5 × (2 + 1) = 3.5h
  // final = max(2.5, 3.5) = 3.5h
  const r = calculateDuration({
    sqm: 70,
    bedrooms: 3,
    bathrooms: 2,
    homeType: "apartment",
  });
  assert.deepEqual(r, { kind: "estimate", hours: 3.5 });
});

test("5-bed at 250m²: routes to custom quote", () => {
  const r = calculateDuration({
    sqm: 250,
    bedrooms: 5,
    bathrooms: 3,
    homeType: "house",
  });
  assert.deepEqual(r, { kind: "custom-quote" });
});

test("deep clean overrides a sub-3h estimate", () => {
  // 1-bed at 50m² without service min → 2h.
  // Deep clean has serviceMinHours: 3 → final 3h.
  const r = calculateDuration({
    sqm: 50,
    bedrooms: 1,
    bathrooms: 1,
    homeType: "apartment",
    serviceMinHours: 3,
  });
  assert.deepEqual(r, { kind: "estimate", hours: 3 });
});

// ----------------------------------------------------------------------------
// Boundary cases on the m² ladder
// ----------------------------------------------------------------------------

test("ladder boundaries: each tier transition is exact", () => {
  const at = (sqm: number) =>
    (
      calculateDuration({
        sqm,
        bedrooms: 1,
        bathrooms: 1,
        homeType: "apartment",
      }) as { kind: "estimate"; hours: number }
    ).hours;
  // ≤65 → 2.0
  assert.equal(at(40), 2);
  assert.equal(at(65), 2);
  // 66-80 → 2.5
  assert.equal(at(66), 2.5);
  assert.equal(at(80), 2.5);
  // 81-95 → 3.0
  assert.equal(at(81), 3);
  assert.equal(at(95), 3);
  // 96-110 → 3.5
  assert.equal(at(96), 3.5);
  assert.equal(at(110), 3.5);
  // 111-125 → 4.0
  assert.equal(at(111), 4);
  assert.equal(at(125), 4);
  // 126-140 → 4.5
  assert.equal(at(126), 4.5);
  assert.equal(at(140), 4.5);
  // 141-155 → 5.0
  assert.equal(at(141), 5);
  assert.equal(at(155), 5);
});

test("custom-quote threshold is exactly 156", () => {
  assert.equal(CUSTOM_QUOTE_THRESHOLD_SQM, 156);
  assert.deepEqual(
    calculateDuration({
      sqm: 155,
      bedrooms: 1,
      bathrooms: 1,
      homeType: "house",
    }),
    { kind: "estimate", hours: 5 },
  );
  assert.deepEqual(
    calculateDuration({
      sqm: 156,
      bedrooms: 1,
      bathrooms: 1,
      homeType: "house",
    }),
    { kind: "custom-quote" },
  );
});

// ----------------------------------------------------------------------------
// Missing / invalid sqm: bed/bath logic alone
// ----------------------------------------------------------------------------

test("missing sqm: bed/bath alone, 1-bed/1-bath gives the 2h floor", () => {
  const r = calculateDuration({
    sqm: null,
    bedrooms: 1,
    bathrooms: 1,
    homeType: "apartment",
  });
  assert.deepEqual(r, { kind: "estimate", hours: 2 });
});

test("missing sqm: 4-bed/3-bath gives 2 + 0.5×(3+2) = 4.5h", () => {
  const r = calculateDuration({
    sqm: null,
    bedrooms: 4,
    bathrooms: 3,
    homeType: "house",
  });
  assert.deepEqual(r, { kind: "estimate", hours: 4.5 });
});

test("missing sqm: studio gets 2h via the type override", () => {
  const r = calculateDuration({
    sqm: null,
    bedrooms: 0,
    bathrooms: 1,
    homeType: "studio",
  });
  assert.deepEqual(r, { kind: "estimate", hours: 2 });
});

test("zero or negative sqm is treated as missing", () => {
  const a = calculateDuration({
    sqm: 0,
    bedrooms: 1,
    bathrooms: 1,
    homeType: "apartment",
  });
  const b = calculateDuration({
    sqm: -10,
    bedrooms: 1,
    bathrooms: 1,
    homeType: "apartment",
  });
  assert.deepEqual(a, { kind: "estimate", hours: 2 });
  assert.deepEqual(b, { kind: "estimate", hours: 2 });
});

// ----------------------------------------------------------------------------
// Service-min interaction
// ----------------------------------------------------------------------------

test("after-builders 4h min beats a 2.5h ladder result", () => {
  const r = calculateDuration({
    sqm: 75,
    bedrooms: 1,
    bathrooms: 1,
    homeType: "apartment",
    serviceMinHours: 4,
  });
  assert.deepEqual(r, { kind: "estimate", hours: 4 });
});

test("service min does not reduce a higher estimate", () => {
  // 4-bed/2-bath at 100m²: ladder=3.5, bedbath=2 + 0.5×(3+1)=4. max=4.
  // serviceMin=3 must not pull it down.
  const r = calculateDuration({
    sqm: 100,
    bedrooms: 4,
    bathrooms: 2,
    homeType: "apartment",
    serviceMinHours: 3,
  });
  assert.deepEqual(r, { kind: "estimate", hours: 4 });
});

// ----------------------------------------------------------------------------
// formatDurationBreakdown
// ----------------------------------------------------------------------------

test("breakdown includes all three segments when sqm present", () => {
  const s = formatDurationBreakdown({
    hours: 2.5,
    sqm: 80,
    bedrooms: 1,
    bathrooms: 1,
    homeType: "apartment",
  });
  assert.equal(s, "2.5h estimate · 80m² · 1 bed / 1 bath");
});

test("breakdown drops sqm segment when missing", () => {
  const s = formatDurationBreakdown({
    hours: 3,
    sqm: null,
    bedrooms: 2,
    bathrooms: 1,
    homeType: "apartment",
  });
  assert.equal(s, "3h estimate · 2 bed / 1 bath");
});

test("breakdown reads 'studio' instead of '0 bed' for studios", () => {
  const s = formatDurationBreakdown({
    hours: 2,
    sqm: 30,
    bedrooms: 0,
    bathrooms: 1,
    homeType: "studio",
  });
  assert.equal(s, "2h estimate · 30m² · studio · 1 bath");
});

// ----------------------------------------------------------------------------
// parseSqm
// ----------------------------------------------------------------------------

test("parseSqm: empty / whitespace / non-numeric → null", () => {
  assert.equal(parseSqm(""), null);
  assert.equal(parseSqm("   "), null);
  assert.equal(parseSqm("abc"), null);
  assert.equal(parseSqm(null), null);
  assert.equal(parseSqm(undefined), null);
});

test("parseSqm: parses simple integers", () => {
  assert.equal(parseSqm("80"), 80);
  assert.equal(parseSqm("  120 "), 120);
});

test("parseSqm: zero / negatives → null", () => {
  assert.equal(parseSqm("0"), null);
  assert.equal(parseSqm("-5"), null);
});

// ----------------------------------------------------------------------------
// Phase 4.7 — package tier selection
// ----------------------------------------------------------------------------

test("selectPackageId: sqm boundaries (sqm wins when present)", () => {
  // Pick a bedroom count that would WANT a different tier so we can
  // see sqm taking precedence.
  assert.equal(selectPackageId(30, 4), "studio");
  assert.equal(selectPackageId(49, 4), "studio");
  assert.equal(selectPackageId(50, 4), "apartment");
  assert.equal(selectPackageId(79, 4), "apartment");
  assert.equal(selectPackageId(80, 1), "family");
  assert.equal(selectPackageId(119, 1), "family");
  assert.equal(selectPackageId(120, 1), "large");
  assert.equal(selectPackageId(250, 1), "large");
});

test("selectPackageId: bedroom fallback when sqm missing", () => {
  assert.equal(selectPackageId(null, 0), "studio");
  assert.equal(selectPackageId(null, 1), "studio");
  assert.equal(selectPackageId(null, 2), "apartment");
  assert.equal(selectPackageId(null, 3), "family");
  assert.equal(selectPackageId(null, 4), "large");
  assert.equal(selectPackageId(null, 8), "large");
});

test("selectPackageId: invalid sqm (zero / undefined) falls back to bedrooms", () => {
  assert.equal(selectPackageId(0, 3), "family");
  assert.equal(selectPackageId(undefined, 2), "apartment");
});

test("selectDeepCleanPackage: returns the live package object with price", () => {
  const studio = selectDeepCleanPackage(30, 1);
  assert.equal(studio.id, "studio");
  assert.equal(studio.price, 225);
  const apartment = selectDeepCleanPackage(65, 2);
  assert.equal(apartment.id, "apartment");
  assert.equal(apartment.price, 295);
  const family = selectDeepCleanPackage(100, 3);
  assert.equal(family.id, "family");
  assert.equal(family.price, 395);
});

test("selectDeepCleanPackage: large tier returns customQuote payload", () => {
  const large = selectDeepCleanPackage(180, 1);
  assert.equal(large.id, "large");
  assert.equal(large.price, null);
  assert.equal(large.customQuote, true);
  // fromPrice carries the WhatsApp anchor for the custom-quote CTA.
  assert.equal(large.fromPrice, 495);
});

test("selectMovePackage: returns the live package object with price", () => {
  const studio = selectMovePackage(40, 1);
  assert.equal(studio.id, "studio");
  assert.equal(studio.price, 395);
  const apartment = selectMovePackage(70, 2);
  assert.equal(apartment.id, "apartment");
  assert.equal(apartment.price, 495);
  const family = selectMovePackage(100, 3);
  assert.equal(family.id, "family");
  assert.equal(family.price, 625);
});

test("selectMovePackage: large tier returns customQuote payload", () => {
  const large = selectMovePackage(140, 4);
  assert.equal(large.id, "large");
  assert.equal(large.price, null);
  assert.equal(large.customQuote, true);
  assert.equal(large.fromPrice, 750);
});
