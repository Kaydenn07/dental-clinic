#!/usr/bin/env node
/**
 * ============================================================================
 *  MEDIA SETUP — turns the clinic's raw files into web-ready site imagery
 * ============================================================================
 *  Run:  npm run media:setup
 *
 *  Put the clinic's original files in `media-source/` (gitignored) using the
 *  names listed in INPUT below, then run the script. It writes optimised,
 *  correctly-cropped files into `public/media/…` and reports what it produced.
 *  `src/content/media.ts` already points at those output paths, so the site
 *  picks the photographs up with no further editing.
 *
 *  The script is idempotent: running it again just re-derives the outputs.
 *  It never invents imagery — if an input is missing, its output is skipped and
 *  the site keeps showing the labelled placeholder instead.
 *
 *  Crops are defined as fractions of the source (x, y, width, height) so they
 *  are resolution-independent. Adjust `CROP` if a framing needs nudging.
 * ============================================================================
 */

import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, extname, basename } from "node:path";

import sharp from "sharp";

const ROOT = process.cwd();
const SOURCE_DIR = join(ROOT, "media-source");
const OUT_DIR = join(ROOT, "public", "media");

/* ------------------------------------------------------------------ config -- */

/** Where to look for each source file (first match wins). */
const INPUT = {
  /** The radio-studio photograph containing Dr. Messaouda Bouamara. */
  radio: ["doctor/radio-station.*", "radio-station.*", "doctor.*"],
  /** A studio still from the television appearance. */
  tv: ["appearances/nabd-el-seha.*", "tv.*", "appearance.*"],
  /** Before/after case sheets, in the order they should appear on the site. */
  results: [
    "results/case-01.*",
    "results/case-02.*",
    "results/case-03.*",
    "results/case-04.*",
  ],
  /** Clinic interior photographs (optional). */
  facility: ["facility/*.*"],
};

/**
 * Crop boxes as { left, top, width, height } fractions of the source.
 *
 * `radioDoctor` targets the right-hand person in the radio-station photograph —
 * the clinic confirmed that Dr. Messaouda Bouamara is the person on the right
 * (cream striped jacket, white headscarf). It is a framing crop only: nothing
 * about her appearance is altered or generated.
 */
const CROP = {
  radioDoctor: { left: 0.485, top: 0.02, width: 0.5, height: 0.72 },
  /** Trims the printed promotional band from the clinic's case sheets. */
  resultSheet: { left: 0, top: 0, width: 1, height: 0.74 },
};

const DOCTOR_PORTRAIT = { width: 1200, height: 1500 }; // 4:5
const RESULT_MAX = { width: 1600 };
const TV_MAX = { width: 1920 };

/* ------------------------------------------------------------------ helpers -- */

function filesMatching(pattern) {
  const [dir, name] = pattern.includes("/") ? pattern.split("/") : ["", pattern];
  const target = dir ? join(SOURCE_DIR, dir) : SOURCE_DIR;
  if (!existsSync(target)) return [];

  const prefix = name.replace(/\.\*$/, "");
  const wildcard = name.endsWith(".*");
  const entries = readdirSync(target);

  const matches = entries
    .filter((entry) => statSync(join(target, entry)).isFile())
    .filter((entry) => {
      if (wildcard) return basename(entry, extname(entry)).startsWith(prefix.replace(/\.$/, ""));
      return entry === name;
    })
    .map((entry) => join(target, entry));

  return matches;
}

function firstMatch(patterns) {
  for (const pattern of patterns) {
    const matches = filesMatching(pattern);
    if (matches.length > 0) return matches[0];
  }
  return null;
}

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

/** Converts a fractional crop box to sharp's integer region options. */
async function cropRegion(file, box) {
  const meta = await sharp(file).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;

  return {
    left: Math.max(0, Math.round(box.left * width)),
    top: Math.max(0, Math.round(box.top * height)),
    width: Math.min(width, Math.round(box.width * width)),
    height: Math.min(height, Math.round(box.height * height)),
  };
}

const results = [];

function report(label, path, note = "") {
  results.push({ label, path, note });
}

/* ------------------------------------------------------------------- tasks -- */

async function buildDoctorPortrait() {
  const source = firstMatch(INPUT.radio);
  if (!source) return;

  const out = join(OUT_DIR, "doctor", "dr-bouamara.jpg");
  ensureDir(join(OUT_DIR, "doctor"));

  const region = await cropRegion(source, CROP.radioDoctor);

  await sharp(source)
    .extract(region)
    .resize(DOCTOR_PORTRAIT.width, DOCTOR_PORTRAIT.height, {
      fit: "cover",
      position: "top",
    })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(out);

  report("Doctor portrait", out, `cropped from ${basename(source)} (framing only)`);
}

async function buildAppearanceStill() {
  const source = firstMatch(INPUT.tv);
  if (!source) return;

  const out = join(OUT_DIR, "appearances", "nabd-el-seha.jpg");
  ensureDir(join(OUT_DIR, "appearances"));

  await sharp(source)
    .resize({ width: TV_MAX.width, withoutEnlargement: true })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(out);

  report("TV appearance still", out);
}

async function buildResults() {
  ensureDir(join(OUT_DIR, "results"));

  let index = 0;
  for (const pattern of INPUT.results) {
    const source = firstMatch([pattern]);
    if (!source) continue;

    index += 1;
    const id = String(index).padStart(2, "0");
    const out = join(OUT_DIR, "results", `case-${id}.jpg`);

    const region = await cropRegion(source, CROP.resultSheet);

    await sharp(source)
      .extract(region)
      .resize({ width: RESULT_MAX.width, withoutEnlargement: true })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(out);

    report(`Results case ${id}`, out, "promotional band trimmed");
  }

  if (index === 0) return;
}

async function buildFacility() {
  const dir = join(SOURCE_DIR, "facility");
  if (!existsSync(dir)) return;

  const files = readdirSync(dir).filter((entry) =>
    statSync(join(dir, entry)).isFile(),
  );
  if (files.length === 0) return;

  ensureDir(join(OUT_DIR, "facility"));

  for (const file of files) {
    const out = join(OUT_DIR, "facility", `${basename(file, extname(file))}.jpg`);
    await sharp(join(dir, file))
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(out);
    report("Facility photo", out);
  }
}

/* -------------------------------------------------------------------- main -- */

async function main() {
  if (!existsSync(SOURCE_DIR)) {
    console.log(
      `\nNo ${basename(SOURCE_DIR)}/ folder found.\n\n` +
        "Create it and add the clinic's original files, for example:\n" +
        "  media-source/doctor/radio-station.jpg\n" +
        "  media-source/appearances/nabd-el-seha.jpg\n" +
        "  media-source/results/case-01.jpg … case-04.jpg\n" +
        "  media-source/facility/reception.jpg\n\n" +
        "Then run `npm run media:setup` again.\n",
    );
    return;
  }

  await buildDoctorPortrait();
  await buildAppearanceStill();
  await buildResults();
  await buildFacility();

  if (results.length === 0) {
    console.log("\nNo usable source files were found in media-source/.\n");
    return;
  }

  console.log("\nGenerated:\n");
  for (const item of results) {
    console.log(`  ✓ ${item.label.padEnd(20)} ${item.path.replace(ROOT + "/", "")}${item.note ? `  (${item.note})` : ""}`);
  }

  console.log(
    "\nNext: set the matching paths in src/content/media.ts if they differ, " +
      "then run `npm run build`.\n",
  );
}

main().catch((error) => {
  console.error("\nmedia:setup failed:", error.message, "\n");
  process.exitCode = 1;
});
