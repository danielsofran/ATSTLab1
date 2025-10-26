import * as path from 'path';
import AdmZip from 'adm-zip';

const zipper = new AdmZip();
const cucumberReportsPath = path.join(__dirname, 'cucumber-report');
const playwrightReportsPath = path.join(__dirname, 'playwright-report');
const srcPath = path.join(__dirname, 'src');
const featuresPath = path.join(__dirname, 'src', 'tests', 'features');

// folders
zipper.addLocalFolder(cucumberReportsPath, 'cucumber-report');
zipper.addLocalFolder(playwrightReportsPath, 'playwright-report');
zipper.addLocalFolder(srcPath, 'src');
zipper.addLocalFolder(featuresPath, 'features');
// add files
zipper.addLocalFile('cucumber.json')
zipper.addLocalFile('package.json')
zipper.addLocalFile('package-lock.json')
zipper.addLocalFile('tsconfig.json')
zipper.addLocalFile('playwright.config.ts')

// build zip
const zipName = 'SofranDanielClipaGeaninaSerbanPaula_UI_1.zip'
zipper.writeZip(zipName)
