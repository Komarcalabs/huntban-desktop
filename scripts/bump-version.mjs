import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const clientPath = path.join(process.cwd(), 'huntban-client');
const packageJsonPath = path.join(clientPath, 'package.json');
const tauriConfPath = path.join(clientPath, 'src-tauri', 'tauri.conf.json');

const bumpType = process.argv[2] || 'patch';

if (!['patch', 'minor', 'major'].includes(bumpType)) {
    console.error('Usage: node scripts/bump-version.mjs [patch|minor|major]');
    process.exit(1);
}

if (!fs.existsSync(clientPath)) {
    console.error('Error: huntban-client directory not found. Clone it first.');
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

// Read current versions
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf-8'));

const currentVersion = tauriConf.version || '0.1.0';
const nextVersion = bumpVersion(currentVersion, bumpType);

console.log(`Bumping version: ${currentVersion} -> ${nextVersion}`);

// Update files
packageJson.version = nextVersion;
tauriConf.version = nextVersion;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2));

console.log('✅ Updated package.json and tauri.conf.json');

// Git operations (in huntban-client if you want, but better if we tag huntban-desktop)
try {
    const tag = `v${nextVersion}`;
    console.log(`Creating git tag: ${tag}...`);
    // Note: This tags the huntban-client. You might also want to commit these changes.
    execSync(`git add package.json src-tauri/tauri.conf.json`, { cwd: clientPath });
    execSync(`git commit -m "chore: bump version to ${nextVersion}"`, { cwd: clientPath });

    // We should also tag the desktop repo for the pipeline to trigger
    execSync(`git add .`, { cwd: process.cwd() });
    execSync(`git commit -m "release: ${nextVersion}"`, { cwd: process.cwd() });
    execSync(`git tag ${tag}`, { cwd: process.cwd() });

    console.log(`🚀 Version bumped and tagged. Now run: git push origin main --tags`);
} catch (error) {
    console.error('Error during git operations:', error.message);
}
