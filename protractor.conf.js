const HtmlReporter = require('./libraries/protractor-html-reporter-2');
const jasmineReporters  = require('jasmine-reporters');
const fs = require('fs-extra');

exports.config = {
 // timeouts are very important, remember about it
  allScriptsTimeout: 1200000,

  // list of specs that you want to run during tests executions
  specs: [
   'tests/**/*.e2e-spec.ts'
  ],
  // here you define browsers that you want to involve into testing 
  multiCapabilities: [
    {
      browserName: 'chrome',
      shardTestFiles: false
    },
    {
      browserName: 'firefox',
      shardTestFiles: false
    }
  ],
  maxSessions: 1,
  directConnect: true,
  baseUrl: "http://localhost:4200/",
  framework: "jasmine2",
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 1200000,
    random: false, 
    isVerbose: true,
    print: function() {}
  },
  beforeLaunch: () => {
    // Before you run your tests you have to create empty directory
    const src = 'tests/reports/screenshots/';
    fs.emptyDir(src);
  },
  onPrepare: function() {
      browser.ignoreSynchronization = false;

      require("ts-node").register({
        project: "e2e/tsconfig.e2e.json"
      });

      const src = 'tests/reports/screenshots/';

      // here we add jasmine-reporter to generate xml file with tests results
      jasmine.getEnv().addReporter(
          new jasmineReporters.JUnitXmlReporter({
            savePath: 'tests/reports/',
            consolidate: true,
            consolidateAll: true,
            filePrefix: 'results'
          })
      );

      //here we add another, custom reporter to take screenshot when tests fails
      jasmine.getEnv().addReporter({
          specDone: result => {
            if (result.status == 'failed') {
                browser.getCapabilities().then((caps) => {
                    const browserName = caps.get('browserName');
                    browser.takeScreenshot().then((png) => {
                        const filename = src + browserName + '-' + result.fullName + '.png';
                        const stream = fs.createWriteStream(filename);
                        stream.write(new Buffer(png, 'base64'));
                        stream.end();
                    });
                });
              }
            } 
         }
      );
  },
  onComplete: function() {
    browser.getCapabilities().then((c) => {
      browser.getProcessedConfig().then(() => {
        const browserName = c.get("browserName");
        const browserVersion = c.get("browserVersion");
        const name = new Date().toISOString().replace(':', '_').replace('.', '_').split(':');
        const title = browserName + '_' + name[0];

        // here is configuration for our HTML report
        config = {
            reportTitle: title, // report title 
            outputPath: 'tests/reports/', // path to save report 
            outputFilename: title, // file title
            screenshotPath: './screenshots', // screenshots destination 
            testBrowser: browserName,
            browserVersion: browserVersion,
            modifiedSuiteName: false,
            screenshotsOnlyOnFailure: true
        };  

        // HTML reporter instance
        new HtmlReporter().from(resultPath + 'results.xml', config);
      });
   });
  }
};