import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    setupNodeEvents(on) {
      on('before:browser:launch', (browser, launchOptions) => {
        console.log('XXXXXXXXXXX', launchOptions);
        if (browser.name === 'chromium') {
          const newArgs = launchOptions.filter(
            (launchOptions) => launchOptions !== '--disable-gpu',
          );
          newArgs.push('--ignore-gpu-blacklist');
          return newArgs;
        }

        return launchOptions;
      });
    },
  },
});
