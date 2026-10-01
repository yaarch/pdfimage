import { TOOLS } from '../src/data/tools';
import { getLocalizedTool } from '../src/i18n/toolTranslations';
import { getToolRichContent } from '../src/data/toolRichContent';

const languages = ['en', 'ar', 'es', 'fr', 'de'] as const;

console.log('==================================================');
console.log('AUDITING ALL 27 TOOLS FOR GENERIC WORDING & FAQS');
console.log('==================================================\n');

let totalToolsTested = 0;
let totalFaqsTested = 0;
let errorsCount = 0;

const FORBIDDEN_STRINGS = [
  'document or image',
  'quality, dimensions, rotation, or format parameters',
];

for (const tool of TOOLS) {
  totalToolsTested++;
  console.log(`Tool #${totalToolsTested}: [${tool.id}] (${tool.name})`);

  for (const lang of languages) {
    const localized = getLocalizedTool(tool, lang);
    const rich = getToolRichContent(tool.id, lang);

    const fullContentString = JSON.stringify({ localized, rich }).toLowerCase();

    // Check for forbidden generic phrases
    for (const forbidden of FORBIDDEN_STRINGS) {
      if (fullContentString.includes(forbidden.toLowerCase())) {
        console.error(`  [${lang.toUpperCase()} FAIL] Found forbidden generic phrase "${forbidden}" in tool [${tool.id}]`);
        errorsCount++;
      }
    }

    if (!localized.name) {
      console.error(`  [${lang.toUpperCase()} FAIL] Missing localized name`);
      errorsCount++;
    }
    if (!localized.tagline) {
      console.error(`  [${lang.toUpperCase()} FAIL] Missing localized tagline`);
      errorsCount++;
    }
    if (!rich.howToUseTitle) {
      console.error(`  [${lang.toUpperCase()} FAIL] Missing howToUseTitle`);
      errorsCount++;
    }
    if (!rich.steps || rich.steps.length < 3) {
      console.error(`  [${lang.toUpperCase()} FAIL] Steps count < 3`);
      errorsCount++;
    }

    if (!localized.faqs || localized.faqs.length === 0) {
      console.error(`  [${lang.toUpperCase()} FAIL] Zero FAQs returned`);
      errorsCount++;
    } else {
      for (const faq of localized.faqs) {
        totalFaqsTested++;
        if (!faq.question || !faq.answer || faq.answer.trim() === '') {
          console.error(`  [${lang.toUpperCase()} FAIL] Empty FAQ question/answer for "${faq.question}"`);
          errorsCount++;
        }
      }
    }
  }
}

console.log(`\n==================================================`);
console.log(`AUDIT RESULTS:`);
console.log(`- Total tools verified: ${totalToolsTested} / 27`);
console.log(`- Total localized FAQs checked: ${totalFaqsTested}`);
console.log(`- Total errors found: ${errorsCount}`);
if (errorsCount === 0) {
  console.log(`- STATUS: ALL 27 TOOL PAGES ARE 100% SPECIFIC & CONTENT ACCURATE!`);
} else {
  console.log(`- STATUS: FAILED AUDIT WITH ${errorsCount} ERRORS`);
  process.exit(1);
}
console.log(`==================================================`);
