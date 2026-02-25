import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';

const urls = [
  { name: 'Home', url: 'http://localhost:3000' },
  { name: 'Dashboard', url: 'http://localhost:3000/dashboard' },
  { name: 'Data Management', url: 'http://localhost:3000/data-management' },
];

const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
  },
};

async function runLighthouse(url, name) {
  console.log(`\n🔍 Running Lighthouse audit for: ${name}`);
  console.log(`   URL: ${url}`);
  
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'error',
    output: 'html',
    port: chrome.port,
  };

  try {
    const runnerResult = await lighthouse(url, options, config);

    // Extract scores
    const { lhr } = runnerResult;
    const scores = {
      performance: Math.round(lhr.categories.performance.score * 100),
      accessibility: Math.round(lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
      seo: Math.round(lhr.categories.seo.score * 100),
    };

    // Print scores
    console.log(`\n   ✅ Results for ${name}:`);
    console.log(`   📊 Performance:     ${scores.performance}/100`);
    console.log(`   ♿ Accessibility:   ${scores.accessibility}/100`);
    console.log(`   ✨ Best Practices:  ${scores.bestPractices}/100`);
    console.log(`   🔍 SEO:             ${scores.seo}/100`);

    // Save report
    const reportDir = path.join(process.cwd(), 'lighthouse-reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportPath = path.join(reportDir, `${name.toLowerCase().replace(/\s+/g, '-')}-report.html`);
    fs.writeFileSync(reportPath, runnerResult.report);
    console.log(`   📄 Report saved: ${reportPath}`);

    return scores;
  } catch (error) {
    console.error(`   ❌ Error running Lighthouse for ${name}:`, error.message);
    return null;
  } finally {
    await chrome.kill();
  }
}

async function main() {
  console.log('🚀 Starting Lighthouse Audit...\n');
  console.log('⏳ This may take a few minutes...\n');

  const results = [];

  for (const { name, url } of urls) {
    const scores = await runLighthouse(url, name);
    if (scores) {
      results.push({ name, ...scores });
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 LIGHTHOUSE AUDIT SUMMARY');
  console.log('='.repeat(60));

  results.forEach(({ name, performance, accessibility, bestPractices, seo }) => {
    console.log(`\n${name}:`);
    console.log(`  Performance:     ${performance}/100 ${getEmoji(performance)}`);
    console.log(`  Accessibility:   ${accessibility}/100 ${getEmoji(accessibility)}`);
    console.log(`  Best Practices:  ${bestPractices}/100 ${getEmoji(bestPractices)}`);
    console.log(`  SEO:             ${seo}/100 ${getEmoji(seo)}`);
    console.log(`  Average:         ${Math.round((performance + accessibility + bestPractices + seo) / 4)}/100`);
  });

  // Calculate overall average
  const overallAvg = Math.round(
    results.reduce((sum, r) => sum + r.performance + r.accessibility + r.bestPractices + r.seo, 0) /
    (results.length * 4)
  );

  console.log('\n' + '='.repeat(60));
  console.log(`🎯 OVERALL AVERAGE SCORE: ${overallAvg}/100 ${getEmoji(overallAvg)}`);
  console.log('='.repeat(60));

  console.log('\n✅ Audit complete! Check lighthouse-reports/ for detailed reports.\n');
}

function getEmoji(score) {
  if (score >= 90) return '🟢';
  if (score >= 50) return '🟡';
  return '🔴';
}

main().catch(console.error);
