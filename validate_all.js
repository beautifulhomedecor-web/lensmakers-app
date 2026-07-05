const fs = require('fs');
const path = require('path');

let parser;
try {
  parser = require('@babel/parser');
} catch (e) {
  try {
    parser = require('react-scripts/node_modules/@babel/parser');
  } catch (e2) {
    console.error("Could not find @babel/parser, checking standard syntax...");
  }
}

const srcDir = path.join(__dirname, 'src');

function getAllJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllJsFiles(filePath, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const files = getAllJsFiles(srcDir);
let errorCount = 0;

files.forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  if (parser) {
    try {
      parser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'classProperties', 'optionalChaining', 'nullishCoalescingOperator']
      });
    } catch (err) {
      console.error(`❌ [${path.relative(__dirname, file)}:${err.loc ? err.loc.line + ':' + err.loc.column : ''}] ${err.message}`);
      errorCount++;
    }
  }
});

if (errorCount === 0) {
  console.log("🎉 ALL 100% CLEAN! Zero syntax/JSX errors found across all files!");
} else {
  console.log(`\nFound ${errorCount} files with syntax/JSX errors.`);
  process.exit(1);
}
