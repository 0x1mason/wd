require('colors');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd;
try {
  wd = require('wd');
} catch( err ) {
  wd = require('../../lib/main');
}

chai.promisifyWith(wd.buildPromisify());

var browser = wd.promiseChainRemote();

// optional extra logging
//browser._debugPromise();
browser.on('status', function(info) {
  console.log(info.cyan);
});
browser.on('command', function(meth, path, data) {
  console.log(' > ' + meth.yellow, path.grey, data || '');
});

/* jshint evil: true */
browser
  .init({browserName:'firefox'})
  .get("http://admc.io/wd/test-pages/guinea-pig.html")
  .title()
    .should.become('I am a page title - Sauce Labs')
  .elementById('i am a link')
  .click()
  .eval("window.location.href")
    .should.eventually.include('guinea-pig2')
  .fin(function() { return browser.quit(); })
  .quit()
  .done();
