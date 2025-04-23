const fs = require('fs');
const path = require('path');

// Mapping of extensions to folder names
const categories = {
  Images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
  Documents: ['.pdf', '.docx', '.doc', '.txt', '.xlsx', '.pptx'],
  Videos: ['.mp4', '.mkv', '.avi', '.mov'],
  Music: ['.mp3', '.wav', '.flac'],
};

function getCategory(ext) {
  for (const [category, extensions] of Object.entries(categories)) {
    if (extensions.includes(ext.toLowerCase())) {
      return category;
    }
  }
  return 'Others';
}

function organizeDirectory(dirPath) {
  try {
    const absolutePath = path.resolve(dirPath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Directory "${absolutePath}" does not exist.`);
    }

    const items = fs.readdirSync(absolutePath);
    items.forEach(item => {
      const itemPath = path.join(absolutePath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isFile()) {
        const ext = path.extname(item);
        const category = getCategory(ext);
        const categoryPath = path.join(absolutePath, category);

        if (!fs.existsSync(categoryPath)) {
          fs.mkdirSync(categoryPath);
        }

        const targetPath = path.join(categoryPath, item);
        fs.renameSync(itemPath, targetPath);
        console.log(`Moved: ${item} → ${category}/`);
      }
    });

    console.log('Organization complete.');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Usage: node organizer.js /path/to/target-directory
const targetDir = process.argv[2];
if (!targetDir) {
  console.log('Usage: node organizer.js <directory-path>');
} else {
  organizeDirectory(targetDir);
}
