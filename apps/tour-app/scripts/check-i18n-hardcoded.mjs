import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const ROOT = process.cwd();
const TARGET_DIRS = ['app', 'components', 'features'];
const TARGET_EXTENSIONS = new Set(['.tsx']);
const ATTR_NAMES = new Set(['aria-label', 'placeholder', 'title', 'alt']);
const ALLOWED_TEXT = /^[-+*/0-9\s.,:;!?()[\]{}|/\\'"`~@#$%^&=_]*$/u;

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, {withFileTypes: true});
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.next') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, out);
      continue;
    }
    if (TARGET_EXTENSIONS.has(path.extname(entry.name))) {
      out.push(fullPath);
    }
  }
  return out;
}

function hasLetters(value) {
  return /\p{L}/u.test(value);
}

function shouldIgnoreText(value) {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (!hasLetters(trimmed)) return true;
  if (ALLOWED_TEXT.test(trimmed)) return true;
  return false;
}

function shouldIgnoreAttrValue(value) {
  if (!hasLetters(value)) return true;
  if (value.startsWith('http://') || value.startsWith('https://')) return true;
  return false;
}

function locOf(sourceFile, node) {
  const {line, character} = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return `${sourceFile.fileName}:${line + 1}:${character + 1}`;
}

function run() {
  const files = TARGET_DIRS.flatMap((dir) => walk(path.join(ROOT, dir)));
  const errors = [];

  for (const file of files) {
    const code = fs.readFileSync(file, 'utf8');
    const sourceFile = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

    function visit(node) {
      if (ts.isJsxText(node)) {
        const text = node.getText(sourceFile).replace(/\s+/g, ' ').trim();
        if (!shouldIgnoreText(text)) {
          errors.push(`${locOf(sourceFile, node)} - Hardcoded JSX text: "${text}"`);
        }
      }

      if (ts.isJsxAttribute(node)) {
        const attrName = node.name.getText(sourceFile);
        if (ATTR_NAMES.has(attrName) && node.initializer && ts.isStringLiteral(node.initializer)) {
          const value = node.initializer.text.trim();
          if (!shouldIgnoreAttrValue(value)) {
            errors.push(`${locOf(sourceFile, node)} - Hardcoded ${attrName}: "${value}"`);
          }
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }

  if (errors.length) {
    console.error('i18n check failed. Found hardcoded user-facing text:');
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log('i18n check passed.');
}

run();
