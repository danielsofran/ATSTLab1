// import { generate } from 'multiple-cucumber-html-reporter';

// TODO: fix errors
const { generate } = require('multiple-cucumber-html-reporter');
import * as fs from 'fs';
import * as path from 'path';

function generateReport() {
  const reportsPath = path.join(process.cwd(), 'reports');
  const jsonReportPath = path.join(reportsPath, 'cucumber-report.json');

  console.log('📊 Starting report generation...');
  console.log(`🔍 Looking for JSON report at: ${jsonReportPath}`);

  if (!fs.existsSync(jsonReportPath)) {
    console.error('❌ Cucumber JSON report not found!');
    console.log('💡 Please run tests first using: npm test');
    process.exit(1);
  }

  try {
    const jsonData = fs.readFileSync(jsonReportPath, 'utf8');
    const parsedData = JSON.parse(jsonData);

    console.log('✅ JSON parsed successfully');
    console.log('📊 Data type:', typeof parsedData);
    console.log('🔢 Is array?:', Array.isArray(parsedData));

    // Ensure the reports directory exists
    if (!fs.existsSync(reportsPath)) {
      fs.mkdirSync(reportsPath, { recursive: true });
    }

    // Generate the report
    generate({
      jsonDir: reportsPath,
      reportPath: path.join(reportsPath, 'cucumber-html-report'),
      openReportInBrowser: false,
      saveCollectedJSON: false,
      disableLog: false,
      pageTitle: 'Magento Test Automation Report',
      reportName: 'Magento E2E Test Results',
      displayDuration: true,
      displayReportTime: true,
      customData: {
        title: 'Run Information',
        data: [
          { label: 'Project', value: 'Magento Playwright Automation' },
          { label: 'Execution Start', value: new Date().toLocaleString() },
          { label: 'Node.js Version', value: process.version },
          { label: 'Platform', value: `${process.platform} (${process.arch})` }
        ]
      },
      metadata: {
        app: {
          name: 'Magento Demo Store',
          version: '2.4.5'
        },
        browser: {
          name: 'chromium',
          version: 'latest'
        },
        device: 'Local Test Machine',
        platform: {
          name: process.platform === 'win32' ? 'Windows' :
            process.platform === 'darwin' ? 'macOS' : 'Linux',
          version: process.arch
        }
      }
    });

    console.log('✅ HTML report generated successfully!');
    console.log(`📊 Open the report: ${path.join(reportsPath, 'cucumber-html-report', 'index.html')}`);

  } catch (error: any) {
    console.error('❌ Error generating report:', error);

    // Additional debug info
    if (error.message.includes('map is not a function')) {
      console.log('\n🔧 TROUBLESHOOTING:');
      console.log('The JSON report format might be incorrect.');
      console.log('This usually happens when:');
      console.log('1. No tests were executed');
      console.log('2. The cucumber JSON formatter output format changed');
      console.log('3. The report file contains an empty array or object');

      // Let's check the actual content
      const jsonData = fs.readFileSync(jsonReportPath, 'utf8');
      console.log('\n📄 JSON file content preview:');
      console.log(jsonData.substring(0, 1000) + '...');
    }

    process.exit(1);
  }
}

generateReport();