/* global sauceJobTitle, mergeDesired, midwayUrl, Express */

require('../helpers/setup');

describe('api-nav ' + env.ENV_DESC, function() {
  this.timeout(env.TIMEOUT);

  var browser;
  var allPassed = true;
  var express = new Express( __dirname + '/assets' );

  before(function() {
    express.start();
    browser = wd.promiseChainRemote(env.REMOTE_CONFIG);
    var sauceExtra = {
      name: sauceJobTitle(this.runnable().parent.title),
      tags: ['midway']
    };
    return browser
      .configureLogging()
      .init(mergeDesired(env.DESIRED, env.SAUCE? sauceExtra : null ));
  });

  beforeEach(function() {
    return browser.get( midwayUrl(
      this.currentTest.parent.title,
      this.currentTest.title));
  });

  afterEach(function() {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });

  after(function() {
    express.stop();
    return browser
      .quit().then(function() {
        if(env.SAUCE) { return(browser.sauceJobStatus(allPassed)); }
      });
  });

  if(!env.SAUCE){ // page timeout seems to be disabled in sauce
    it('browser.setPageLoadTimeout', function() {
      var defaultTimeout = (env.DESIRED.browserName === 'firefox')? -1 : env.BASE_TIME_UNIT;
      return browser
        .setPageLoadTimeout(env.BASE_TIME_UNIT / 2)
        .setPageLoadTimeout(env.BASE_TIME_UNIT / 2)
        .get( env.MIDWAY_ROOT_URL + '/test-page')
        .setPageLoadTimeout(defaultTimeout);
    });
  }

  express.partials['browser.get'] =
    '<div name="theDiv">Hello World!</div>';
  it('browser.get', function() {
    return browser.text().
      should.eventually.include('Hello World!');
  });

  it('browser.url', function() {
    return browser
      .url().should.eventually.include("http://")
      .url().should.eventually.include("test-page");
  });

  it('browser.refresh', function() {
    return browser.refresh();
  });

  it('back/forward', function() {
    return browser.url().then(function(url) {
      return browser
        .get( url + '&thePage=2')
        .url().should.eventually.include("&thePage=2")
        .back()
        .url().should.eventually.not.include("&thePage=2")
        .forward()
        .url().should.eventually.include("&thePage=2");
    });
  });

  express.partials['browser.setImplicitWaitTimeout'] =
    '<div id="setWaitTimeout"></div>';
  it('browser.setImplicitWaitTimeout', function() {
    return browser
      // return error 7 when timeout set to 0
      .setImplicitWaitTimeout(0)
      .execute(
        'setTimeout(function() {\n' +
        '$("#setWaitTimeout").html("<div class=\\"child\\">a child</div>");\n' +
        '}, arguments[0]);', [env.BASE_TIME_UNIT])
      .elementByCss('#setWaitTimeout .child').should.be.rejectedWith(/status\: 7/)
      .setImplicitWaitTimeout(2 * env.BASE_TIME_UNIT)
      .elementByCss('#setWaitTimeout .child')
      .setImplicitWaitTimeout(0);
  });

  express.partials['browser.clickElement'] =
    '<div id="theDiv"><a href="#">not clicked</a></div>\n';
  it('browser.clickElement', function() {
    return browser
      .execute(
        'jQuery( function() {\n' +
        ' a = $(\'#theDiv a\');\n' +
        ' a.click(function() {\n' +
        '   a.html(\'clicked\');\n' +
        '   return false;\n' +
        ' });\n' +
        '});\n'
      )
      .elementByCss("#theDiv a").then(function(el) {
        return browser
          .text(el).should.become("not clicked")
          .clickElement(el)
          .text(el).should.become("clicked")
          ;
      });
  });

  express.partials['browser.moveTo'] =
    '<div id="theDiv">\n' +
    '  <a class="a1" href="#">a1</a><br>\n' +
    '  <a class="a2" href="#">a2</a><br>\n' +
    '  <div class="current"></div>\n' +
    '</div>\n';
  it('browser.moveTo', function() {
    return browser
      .execute(
        'jQuery( function() {\n' +
        ' a1 = $(\'#theDiv .a1\');\n' +
        ' a2 = $(\'#theDiv .a2\');\n' +
        ' current = $(\'#theDiv .current\');\n' +
        ' a1.hover(function() {\n' +
        '   current.html(\'a1\');\n' +
        ' });\n' +
        ' a2.hover(function() {\n' +
        '   current.html(\'a2\');\n' +
        ' });\n' +
        '});\n'
      )
      .elementByCss('#theDiv .current').text().should.become('')
      .elementByCss('#theDiv .a1').then(function(a1) {
        return browser
          .moveTo(a1)
          .elementByCss('#theDiv .current').text().should.become('a1');
      })
      .elementByCss('#theDiv .a2').then(function(a2) {
        return browser
          .moveTo(a2)
          .elementByCss('#theDiv .current').text().should.become('a2');
      })
       .elementByCss('#theDiv .a1').then(function(a1) {
        return browser
          .moveTo(a1)
          .elementByCss('#theDiv .current').text().should.become('a1');
      });
     // todo: add moveTo to element
  });

  express.partials['browser.buttonDown/browser.buttonUp'] =
    '<div id="theDiv"><a>hold me</a><div class="res"></div></div>\n';
  it('browser.buttonDown/browser.buttonUp', function() {
    return browser
      .execute(
        'jQuery( function() {\n' +
        ' a = $(\'#theDiv a\');\n' +
        ' res = $(\'#theDiv .res\');\n' +
        ' current = $(\'#theDiv .current\');\n' +
        ' a.mousedown(function() {\n' +
        '   res.html(\'button down\');\n' +
        ' });\n' +
        ' a.mouseup(function() {\n' +
        '   res.html(\'button up\');\n' +
        ' });\n' +
        '});\n'
      )
      .elementByCss('#theDiv .res').text().should.become('')
      .elementByCss('#theDiv a').then(function(el) {
        return browser
          .moveTo(el)
          .buttonDown()
          .elementByCss('#theDiv .res').text().should.become('button down')
          .buttonUp()
          .elementByCss('#theDiv .res').text().should.become('button up')
          .moveTo(el)
          .buttonDown(0)
          .elementByCss('#theDiv .res').text().should.become('button down')
          .buttonUp(0)
          .elementByCss('#theDiv .res').text().should.become('button up');
      });
  });

  express.partials['browser.click'] =
    '<div id="theDiv">\n' +
    '  <div class="numOfClicks">not clicked</div>\n' +
    '  <div class="buttonNumber">not clicked</div>\n' +
    '</div>\n';
  it('browser.click', function() {
    return browser
      .execute(
        'jQuery( function() {\n' +
        ' var numOfClick = 0;\n' +
        ' numOfClicksDiv = $(\'#theDiv .numOfClicks\');\n' +
        ' buttonNumberDiv = $(\'#theDiv .buttonNumber\');\n' +
        ' current = $(\'#theDiv .current\');\n' +
        ' numOfClicksDiv.mousedown(function(eventObj) {\n' +
        '   var button = eventObj.button;\n' +
        '   if(button === undefined) {button="default";}\n' +
        '   numOfClick++;\n' +
        '   numOfClicksDiv.html("clicked " + numOfClick);\n' +
        '   buttonNumberDiv.html(button);\n' +
        '   return false;\n' +
        ' });\n' +
        '});\n'
      )
      .elementByCss('#theDiv .numOfClicks').text().should.become('not clicked')
      .elementByCss('#theDiv .buttonNumber').text().should.become('not clicked')
      .elementByCss('#theDiv .numOfClicks').then(function(el) {
        return browser
          .moveTo(el)
          .click(0)
          .elementByCss('#theDiv .numOfClicks').text()
            .should.become('clicked 1')
          .elementByCss('#theDiv .buttonNumber').text()
            .should.become('0')
          .then(function() {
            if(!env.SAUCE){ // sauce complains when button is missing
              browser
                .click()
                .elementByCss('#theDiv .numOfClicks').text()
                  .should.become('clicked 2')
                .elementByCss('#theDiv .buttonNumber').text()
                  .should.become('0');
            }
          });
      });
  });

  express.partials['browser.doubleclick'] =
    '<div id="theDiv">\n' +
    '  <div>not clicked</div>\n' +
    '</div>\n';
  it('browser.doubleclick', function() {
    return browser
      .execute(
        'jQuery( function() {\n' +
        ' div = $(\'#theDiv div\');\n' +
        ' div.dblclick(function() {\n' +
        '   div.html("doubleclicked");\n' +
        ' });\n' +
        '});\n'
      )
      .elementByCss('#theDiv div').text().should.become('not clicked')
      .elementByCss('#theDiv div').then(function(div) {
        return browser
          .moveTo(div)
          .doubleclick()
          .elementByCss('#theDiv div').text().should.become('doubleclicked');
      });
  });

  express.partials['browser.type'] =
    '<div id="theDiv"><input type="text"></div>\n';
  it('browser.type', function() {
    var altKey = wd.SPECIAL_KEYS.Alt;
    var nullKey = wd.SPECIAL_KEYS.NULL;
    return browser
      .elementByCss("#theDiv input").then(function(el) {
        return browser
          .getValue(el).should.become('')
          .type(el, 'Hello')
          .getValue(el).should.become('Hello')
          .type(el, [altKey, nullKey, " World"])
          .getValue(el).should.become('Hello World')
          .type(el, "\n")
          .getValue(el).should.become('Hello World');
      })
      .elementByCss("#theDiv input")
        .type(" World").getValue().should.become('Hello World World');
  });

  express.partials['browser.keys'] =
    '<div id="theDiv"><input type="text"></div>\n';
  it('browser.keys', function() {
    var altKey = wd.SPECIAL_KEYS.Alt;
    var nullKey = wd.SPECIAL_KEYS.NULL;
    return browser
      .elementByCss("#theDiv input").then(function(el) {
        return browser
          .getValue(el).should.become('')
          .clickElement(el)
          .keys('Hello')
          .getValue(el).should.become('Hello')
          .clickElement(el).keys([altKey, nullKey, " World"])
          .getValue(el).should.become('Hello World')
          .clickElement(el).keys("\n")
          .getValue(el).should.become('Hello World')
          ;
      });
      // todo: rename the keys method
  });

  express.partials['browser.clear'] =
    '<div id="theDiv">\n' +
    '  <input type="text" value="not cleared">\n' +
    '</div>\n';
  it('browser.clear', function() {
    return browser
      .elementByCss("#theDiv input").then(function(el) {
        return browser
          .getValue(el).should.become('not cleared')
          .clear(el)
          .getValue(el).should.become('');
      })
      .elementByCss("#theDiv input").type("not cleared")
      .getValue().should.become('not cleared')
      .elementByCss("#theDiv input").clear().getValue().should.become('');
  });

  it('browser.title', function() {
    return browser.title().should.eventually.include("WD Tests");
  });

  express.partials['browser.acceptAlert'] =
    '<div id="theDiv"><a>click me</a></div>\n';
  it('browser.acceptAlert', function() {
    return browser
      .execute(
        'jQuery( function() {\n' +
        ' a = $(\'#theDiv a\');\n' +
        ' a.click(function() {\n' +
        '   alert("coffee is running out");\n' +
        '   return false;\n' +
        ' });\n' +
        '});\n'
      )
      .elementByCss("#theDiv a").click()
      .acceptAlert();
  });

  express.partials['browser.dismissAlert'] =
    '<div id="theDiv"><a>click me</a></div>\n';
  it('browser.dismissAlert @skip-chrome', function() {
    return browser
      .execute(
        'jQuery( function() {\n' +
        ' a = $(\'#theDiv a\');\n' +
        ' a.click(function() {\n' +
        '   alert("coffee is running out");\n' +
        '   return false;\n' +
        ' });\n' +
        '});\n'
      )
      .elementByCss("#theDiv a").click()
      .dismissAlert();
  });

  express.partials['browser.active'] =
    '<div id="theDiv">\n' +
    '  <input class="i1" type="text" value="input 1">\n' +
    '  <input class="i2" type="text" value="input 2">\n' +
    '</div>\n';
  it('browser.active', function() {
    return browser
      .elementByCss("#theDiv .i1").click()
      .active().getValue().should.become("input 1")
      .elementByCss("#theDiv .i2").click()
      .active().getValue().should.become("input 2");
  });

  express.partials['browser.isVisible'] =
    '<div id="theDiv">\n' +
    '  <a href="#">a1</a>\n' +
    '</div>\n';
  it('browser.isVisible', function() {
    return browser
      .elementByCss("#theDiv a").then(function(el) {
        return browser
          .isVisible(el).should.eventually.be.ok;
      })
      .elementByCss("#theDiv a").isVisible().should.eventually.be.ok
      .isVisible("css selector", "#theDiv a").should.eventually.be.ok
      .execute('$("#theDiv a").hide();')
      .elementByCss("#theDiv a").isVisible().should.eventually.not.be.ok
      .isVisible("css selector", "#theDiv a").should.eventually.not.be.ok;
  });

  express.partials['browser.isDisplayed'] =
    '<div id="theDiv">\n' +
    '  <input class="displayed" type="text" value="Hello">\n' +
    '  <input class="hidden" type="hidden" value="Hello">\n' +
    '</div>\n';
  it('browser.isDisplayed', function() {
    return browser
      .elementByCss('#theDiv .displayed').then(function(el) {
        return browser.isDisplayed(el).should.eventually.be.ok;
      })
      .elementByCss('#theDiv .hidden').then(function(el) {
        return browser.isDisplayed(el).should.eventually.not.be.ok;
      })
      .elementByCss('#theDiv .displayed').isDisplayed().should.eventually.be.ok
      .elementByCss('#theDiv .hidden').isDisplayed().should.eventually.not.be.ok;
  });

  express.partials['browser.isEnabled'] =
    '<div id="theDiv">\n' +
    '  <input class="enabled" type="text" value="Hello">\n' +
    '  <input class="disabled" type="text" value="Hello" disabled>\n' +
    '</div>\n';
  it('browser.isEnabled', function() {
    return browser
      .elementByCss('#theDiv .enabled').then(function(el) {
        return browser.isEnabled(el).should.eventually.be.ok;
      })
      .elementByCss('#theDiv .disabled').then(function(el) {
        return browser.isEnabled(el).should.eventually.not.be.ok;
      })
      .elementByCss('#theDiv .enabled').isEnabled().should.eventually.be.ok
      .elementByCss('#theDiv .disabled').isEnabled().should.eventually.not.be.ok;
  });

});
