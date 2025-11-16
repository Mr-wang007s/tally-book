const fs = require('fs');
const path = require('path');

const zhCNPath = path.join(__dirname, 'src/i18n/locales/zh-CN.json');
const enPath = path.join(__dirname, 'src/i18n/locales/en.json');

const zhCN = JSON.parse(fs.readFileSync(zhCNPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

const zhKeys = getAllKeys(zhCN);
const enKeys = getAllKeys(en);

const zhSet = new Set(zhKeys);
const enSet = new Set(enKeys);

const missingInEn = zhKeys.filter(k => !enSet.has(k));
const missingInZh = enKeys.filter(k => !zhSet.has(k));

console.log('Translation Key Validation Report');
console.log('=================================\n');
console.log(`Total keys in zh-CN: ${zhKeys.length}`);
console.log(`Total keys in en: ${enKeys.length}`);
console.log('');

if (missingInEn.length > 0) {
  console.log('❌ Keys missing in en.json:');
  missingInEn.forEach(k => console.log(`  - ${k}`));
  console.log('');
}

if (missingInZh.length > 0) {
  console.log('❌ Keys missing in zh-CN.json:');
  missingInZh.forEach(k => console.log(`  - ${k}`));
  console.log('');
}

if (missingInEn.length === 0 && missingInZh.length === 0) {
  console.log('✅ All translation keys match!');
  console.log('');
  console.log('Sample keys:');
  zhKeys.slice(0, 10).forEach(k => console.log(`  - ${k}`));
  if (zhKeys.length > 10) {
    console.log(`  ... and ${zhKeys.length - 10} more`);
  }
  process.exit(0);
} else {
  console.log('❌ Translation keys do not match!');
  process.exit(1);
}
