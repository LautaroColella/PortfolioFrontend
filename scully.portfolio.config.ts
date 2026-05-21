import { ScullyConfig } from '@scullyio/scully';
import '@scullyio/scully-plugin-puppeteer';

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'portfolio',
  distFolder: './dist/portfolio',
  outDir: './dist/portfolio',

  puppeteerLaunchOptions: {
    executablePath: process.env['CHROME_BIN'],
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },

  defaultPostRenderers: [],
  routes: {},
};