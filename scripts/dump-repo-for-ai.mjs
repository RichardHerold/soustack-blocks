#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

const DEFAULT_MAX_FILE_KB = 512;
const DEFAULT_MAX_TOTAL_MB = 5;
const DEFAULT_OUT = 'soustack-injest-repo-pack.md';

const argv = process.argv.slice(2);
const options = {
  out: DEFAULT_OUT,
  maxFileKB: DEFAULT_MAX_FILE_KB,
  maxTotalMB: DEFAULT_MAX_TOTAL_MB,
};

for (let i = 0; i < argv.length; i += 1) {
  const arg = argv[i];
  if (arg === '--out') {
    options.out = argv[i + 1];
    i += 1;
  } else if (arg === '--maxFileKB') {
    options.maxFileKB = Number(argv[i + 1]);
    i += 1;
  } else if (arg === '--maxTotalMB') {
    options.maxTotalMB = Number(argv[i + 1]);
    i += 1;
  }
}

const repoRoot = process.cwd();
const repoName = path.basename(repoRoot);
const maxFileBytes = Math.max(0, Math.floor(options.maxFileKB * 1024));
const maxTotalBytes = Math.max(0, Math.floor(options.maxTotalMB * 1024 * 1024));

const OUTPUT_PATH = normalizePath(path.relative(repoRoot, path.resolve(repoRoot, options.out)));

const DEFAULT_IGNORED_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  '.next',
  'out',
  'coverage',
  '.turbo',
  '.cache',
  '.parcel-cache',
]);

const DEFAULT_IGNORED_FILES = new Set([
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'bun.lockb',
  'Cargo.lock',
]);

const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.ico',
  '.mp4', '.mp3', '.mov', '.avi', '.mkv', '.wav', '.flac', '.ogg',
  '.zip', '.tar', '.gz', '.tgz', '.rar', '.7z', '.bz2', '.xz',
  '.pdf', '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.exe', '.dll', '.so', '.dylib', '.bin', '.dat',
]);

function normalizePath(filePath) {
  return filePath.split(path.sep).join('/');
}

function readIgnoreFile(filePath) {
  return fs.readFile(filePath, 'utf8')
    .then((contents) => contents.split(/\r?\n/))
    .catch(() => []);
}

function globToRegExp(pattern) {
  let source = '';
  let i = 0;
  while (i < pattern.length) {
    const char = pattern[i];
    if (char === '*') {
      const next = pattern[i + 1];
      if (next === '*') {
        source += '.*';
        i += 2;
      } else {
        source += '[^/]*';
        i += 1;
      }
    } else if (char === '?') {
      source += '[^/]';
      i += 1;
    } else {
      source += char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      i += 1;
    }
  }
  return new RegExp(`^${source}$`);
}

function buildIgnoreMatchers(lines) {
  const matchers = [];
  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const isNegated = trimmed.startsWith('!');
    const pattern = isNegated ? trimmed.slice(1) : trimmed;
    const isDir = pattern.endsWith('/');
    const normalized = normalizePath(pattern.replace(/\/$/, ''));
    const anchored = normalized.startsWith('/');
    const body = anchored ? normalized.slice(1) : normalized;
    const regex = globToRegExp(body);
    matchers.push({
      isNegated,
      isDir,
      anchored,
      regex,
    });
  }
  return matchers;
}

function matchesIgnore(matchers, targetPath, isDir) {
  let ignored = false;
  for (const matcher of matchers) {
    if (matcher.isDir && !isDir) {
      continue;
    }
    if (matcher.anchored) {
      if (matcher.regex.test(targetPath)) {
        ignored = !matcher.isNegated;
      }
      continue;
    }
    if (matchesAnySegment(matcher.regex, targetPath)) {
      ignored = !matcher.isNegated;
    }
  }
  return ignored;
}

function matchesAnySegment(regex, targetPath) {
  const segments = targetPath.split('/');
  for (let i = 0; i < segments.length; i += 1) {
    const candidate = segments.slice(i).join('/');
    if (candidate && regex.test(candidate)) {
      return true;
    }
  }
  return false;
}

function isBinaryExtension(filePath) {
  return BINARY_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function isLikelyText(buffer) {
  if (buffer.includes(0)) {
    return false;
  }
  try {
    const decoder = new TextDecoder('utf-8', { fatal: true });
    decoder.decode(buffer);
    return true;
  } catch {
    return false;
  }
}

async function collectIgnoreMatchers() {
  const gitIgnoreLines = await readIgnoreFile(path.join(repoRoot, '.gitignore'));
  const repoPackIgnoreLines = await readIgnoreFile(path.join(repoRoot, '.repo-pack-ignore'));
  const matchers = buildIgnoreMatchers([...gitIgnoreLines, ...repoPackIgnoreLines]);
  return matchers;
}

async function walkRepo(matchers) {
  const included = [];
  const skipped = [];
  let totalBytes = 0;

  async function walk(currentDir) {
    let entries;
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch (error) {
      skipped.push({
        path: normalizePath(path.relative(repoRoot, currentDir)) || '.',
        reason: `read error: ${error.message}`,
      });
      return;
    }

    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = normalizePath(path.relative(repoRoot, fullPath));
      if (!relativePath) {
        continue;
      }

      if (entry.isDirectory()) {
        if (DEFAULT_IGNORED_DIRS.has(entry.name)) {
          skipped.push({ path: relativePath + '/', reason: 'ignored directory' });
          continue;
        }
        if (matchesIgnore(matchers, relativePath, true)) {
          skipped.push({ path: relativePath + '/', reason: 'ignored by pattern' });
          continue;
        }
        await walk(fullPath);
        continue;
      }

      if (entry.isFile()) {
        if (relativePath === OUTPUT_PATH) {
          skipped.push({ path: relativePath, reason: 'output file' });
          continue;
        }
        if (DEFAULT_IGNORED_FILES.has(entry.name)) {
          skipped.push({ path: relativePath, reason: 'lock file' });
          continue;
        }
        if (isBinaryExtension(entry.name)) {
          skipped.push({ path: relativePath, reason: 'binary extension' });
          continue;
        }
        if (matchesIgnore(matchers, relativePath, false)) {
          skipped.push({ path: relativePath, reason: 'ignored by pattern' });
          continue;
        }

        let stat;
        try {
          stat = await fs.stat(fullPath);
        } catch (error) {
          skipped.push({ path: relativePath, reason: `stat error: ${error.message}` });
          continue;
        }

        if (stat.size > maxFileBytes) {
          skipped.push({ path: relativePath, reason: `exceeds maxFileKB (${options.maxFileKB})` });
          continue;
        }

        if (totalBytes + stat.size > maxTotalBytes) {
          skipped.push({ path: relativePath, reason: `exceeds maxTotalMB (${options.maxTotalMB})` });
          continue;
        }

        let buffer;
        try {
          buffer = await fs.readFile(fullPath);
        } catch (error) {
          skipped.push({ path: relativePath, reason: `read error: ${error.message}` });
          continue;
        }

        if (!isLikelyText(buffer)) {
          skipped.push({ path: relativePath, reason: 'non-text or non-utf8' });
          continue;
        }

        const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
        const content = buffer.toString('utf8');
        included.push({
          path: relativePath,
          bytes: stat.size,
          sha256,
          content,
        });
        totalBytes += stat.size;
      }
    }
  }

  await walk(repoRoot);

  included.sort((a, b) => a.path.localeCompare(b.path));

  return { included, skipped, totalBytes };
}

function getGitMetadata() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
  } catch {
    return null;
  }
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    const sha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    const commitTimeIso = execSync('git show -s --format=%cI HEAD', { encoding: 'utf8' }).trim();
    const dirty = execSync('git status --porcelain', { encoding: 'utf8' }).trim().length > 0;
    return { branch, sha, dirty, commitTimeIso };
  } catch {
    return null;
  }
}

async function main() {
  const ignoreMatchers = await collectIgnoreMatchers();
  const { included, skipped, totalBytes } = await walkRepo(ignoreMatchers);
  const gitMetadata = getGitMetadata();
  const sourceDateEpoch = process.env.SOURCE_DATE_EPOCH;
  const parsedEpoch = sourceDateEpoch ? Number(sourceDateEpoch) : null;
  const generatedAt = Number.isFinite(parsedEpoch)
    ? new Date(parsedEpoch * 1000).toISOString()
    : gitMetadata?.commitTimeIso || new Date(0).toISOString();

  const lines = [];
  lines.push(`# Repo Pack: ${repoName}`);
  lines.push(`Generated: ${generatedAt}`);
  if (gitMetadata) {
    lines.push(`Git: branch=${gitMetadata.branch} sha=${gitMetadata.sha} dirty=${gitMetadata.dirty}`);
  }
  lines.push(`Limits: maxFileKB=${options.maxFileKB}, maxTotalMB=${options.maxTotalMB}`);
  lines.push('');
  lines.push('## File Tree (paths)');
  lines.push('```text');
  for (const file of included) {
    lines.push(file.path);
  }
  lines.push('```');
  lines.push('');
  lines.push('Files (contents)');
  lines.push('');

  for (const file of included) {
    lines.push(`FILE: ${file.path}`);
    lines.push(`\t• bytes: ${file.bytes}`);
    lines.push(`\t• sha256: ${file.sha256}`);
    lines.push('');
    lines.push(file.content);
    if (!file.content.endsWith('\n')) {
      lines.push('');
    }
  }

  lines.push('Summary');
  lines.push('');
  lines.push(`Included files: ${included.length}`);
  lines.push(`Skipped files: ${skipped.length}`);
  lines.push(`Total included bytes: ${totalBytes}`);
  lines.push('');
  lines.push('Skipped (top reasons)');

  const sortedSkipped = [...skipped].sort((a, b) => a.path.localeCompare(b.path));
  if (sortedSkipped.length === 0) {
    lines.push('\t• none');
  } else {
    for (const entry of sortedSkipped) {
      lines.push(`\t• ${entry.path}: ${entry.reason}`);
    }
  }

  lines.push('');

  try {
    await fs.writeFile(path.join(repoRoot, options.out), lines.join('\n'), 'utf8');
  } catch (error) {
    console.error(`Failed to write output: ${error.message}`);
    process.exitCode = 1;
  }
}

main();
