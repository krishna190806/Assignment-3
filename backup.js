const fs = require('fs');
const path = require('path');
const archiver = require('archiver'); // install with: npm install archiver

const logFilePath = path.join(__dirname, 'backup-log.txt');

function log(message) {
  fs.appendFileSync(logFilePath, `[${new Date().toISOString()}] ${message}\n`);
}

function copyRecursive(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const items = fs.readdirSync(srcDir);
  for (const item of items) {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else if (stat.isFile()) {
      fs.copyFileSync(srcPath, destPath);
      log(`Copied: ${srcPath} → ${destPath} | Size: ${stat.size} bytes`);
    }
  }
}

function createZip(folderPath, outputZipPath) {
  const output = fs.createWriteStream(outputZipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    log(`Backup compressed into: ${outputZipPath} (${archive.pointer()} total bytes)`);
  });

  archive.on('error', err => { throw err; });

  archive.pipe(output);
  archive.directory(folderPath, false);
  archive.finalize();
}

function backup(sourceDir, shouldZip = false) {
  try {
    const absSource = path.resolve(sourceDir);
    if (!fs.existsSync(absSource)) {
      throw new Error(`Source directory "${absSource}" does not exist.`);
    }

    const backupDir = path.join(__dirname, 'backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    copyRecursive(absSource, backupDir);
    console.log('Backup completed.');
    log('Backup completed.');

    if (shouldZip) {
      const zipPath = path.join(__dirname, 'backup.zip');
      createZip(backupDir, zipPath);
    }

  } catch (err) {
    console.error('Error:', err.message);
    log(`Error: ${err.message}`);
  }
}

// Usage: node backup.js <source-path> [--zip]
const args = process.argv.slice(2);
if (!args[0]) {
  console.log('Usage: node backup.js <source-directory> [--zip]');
} else {
  const shouldZip = args.includes('--zip');
  backup(args[0], shouldZip);
}
