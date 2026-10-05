#!/usr/bin/env node

// Every client reads its own manifest, so a release has to raise the version in all of them.

import { readFile } from "node:fs/promises"

const manifests = ["plugin.json", ".claude-plugin/plugin.json", ".cursor-plugin/plugin.json", "server.json"]

const versions = await Promise.all(
	manifests.map(async path => {
		const manifest = JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), "utf8"))
		return { path, version: manifest.version }
	})
)

const expected = versions[0].version
const mismatched = versions.filter(entry => entry.version !== expected)

if (mismatched.length > 0) {
	for (const entry of versions) console.error(`${entry.path}: ${entry.version}`)
	console.error(`\nEvery manifest must have version ${expected}.`)
	process.exit(1)
}

console.log(`All manifests are at version ${expected}.`)
