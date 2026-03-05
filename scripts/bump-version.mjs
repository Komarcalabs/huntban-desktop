import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const packageJsonPath = path.join(process.cwd(), 'package.json');
const bumpType = process.argv[2] || 'patch';

if (!['patch', 'minor', 'major'].includes(bumpType)) {
    console.error('Usage: node scripts/bump-version.mjs [patch|minor|major]');
    process.exit(1);
}

function bumpVersion(version, type) {
    let [major, minor, patch] = version.split('.').map(Number);
    if (type === 'major') major++;
    if (type === 'minor') minor++;
    if (type === 'patch') patch++;
    if (type !== 'patch') patch = 0;
    if (type === 'major') minor = 0;
    return `${major}.${minor}.${patch}`;
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const currentVersion = packageJson.version || '0.1.0';
const nextVersion = bumpVersion(currentVersion, bumpType);

console.log(`Bumping version: ${currentVersion} -> ${nextVersion}`);

packageJson.version = nextVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('✅ Updated package.json in huntban-desktop');

try {
    const tag = `v${nextVersion}`;
    console.log(`Creating git tag: ${tag}...`);
    execSync(`git add package.json`, { cwd: process.cwd() });
    execSync(`git commit -m "release: ${nextVersion}"`, { cwd: process.cwd() });
    execSync(`git tag ${tag}`, { cwd: process.cwd() });

    console.log(`🚀 Version bumped and tagged. Now run: git push origin main --tags`);
} catch (error) {
    console.error('Error during git operations:', error.message);
}
