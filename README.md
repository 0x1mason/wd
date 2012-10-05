# WD.js -- A light weight WebDriver/Se2 client for node.js

[![Build Status](https://secure.travis-ci.org/admc/wd.png?branch=master)](http://travis-ci.org/admc/wd)

## Update node to latest

http://nodejs.org/#download

## Install

<pre>
npm install wd
</pre>

## Authors

  - Adam Christian ([admc](http://github.com/admc))
  - Ruben Daniels ([javruben](https://github.com/javruben))
  - Peter Braden ([peterbraden](https://github.com/peterbraden))
  - Seb Vincent ([sebv](https://github.com/sebv))
  - Peter 'Pita' Martischka ([pita](https://github.com/Pita))
  - Jonathan Lipps ([jlipps](https://github.com/jlipps))
  - Phil Sarin ([pdsarin](https://github.com/pdsarin))
  - Mathieu Sabourin ([OniOni](https://github.com/OniOni))
  - Bjorn Tipling ([btipling](https://github.com/btipling))
  
## License

  * License - Apache 2: http://www.apache.org/licenses/LICENSE-2.0

## Usage

<pre>
): wd shell
> x = wd.remote() or wd.remote("ondemand.saucelabs.com", 80, "username", "apikey")

> x.init() or x.init({desired capabilities ovveride})
> x.get("http://www.url.com")
> x.eval("window.location.href", function(e, o) { console.log(o) })
> x.quit()
</pre>


## Writing a test!

<pre>
var webdriver = require('wd')
  , assert = require('assert');

var browser = webdriver.remote();

browser.on('status', function(info){
  console.log('\x1b[36m%s\x1b[0m', info);
});
browser.on('command', function(meth, path){
  console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
});

desired = {
  browserName:'chrome'
  , tags: ["examples"]
  , name: "This is an example test"
}

browser.init(desired, function() {
  browser.get("http://saucelabs.com/test/guinea-pig", function() {
    browser.title(function(err, title) {
      assert.ok(~title.indexOf('I am a page title - Sauce Labs'), 'Wrong title!');
      browser.elementById('submit', function(err, el) {
        browser.clickElement(el, function() {
          browser.eval("window.location.href", function(err, title) {
            assert.ok(~title.indexOf('#'), 'Wrong title!');
            browser.quit()
          })
        })
      })
    })
  })
})
</pre>

## Supported Methods

<table class="wikitable">
  <tbody>
    <tr>
      <td width="50%" style="border: 1px solid #ccc; padding: 5px;">
        <strong>JsonWireProtocol</strong>
      </td>
      <td width="50%" style="border: 1px solid #ccc; padding: 5px;">
        <strong>wd</strong>
      </td>
    </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/status">/status</a><br>
            Query the server's current status.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              status(cb) -&gt; cb(err, status)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session">/session</a><br>
            Create a new session.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              Initialize the browser: <br>
            
              init(desired, cb) -&gt; cb(err, sessionID)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/sessions">/sessions</a><br>
            Returns a list of the currently active sessions.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
          
            <p>
              
                sessions(cb) -&gt; cb(err, sessions)<br>
              
            </p>
          
            <p>
              
                Alternate strategy to get session capabilities from server session list: <br>
              
                altSessionCapabilities(cb) -&gt; cb(err, capabilities)<br>
              
            </p>
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId">/session/:sessionId</a><br>
            Retrieve the capabilities of the specified session.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              sessionCapabilities(cb) -&gt; cb(err, capabilities)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId">/session/:sessionId</a><br>
            Delete the session.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              Destroy the browser: <br>
            
              quit(cb) -&gt; cb(err)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/timeouts">/session/:sessionId/timeouts</a><br>
            Configure the amount of time that a particular type of operation can execute for before they are aborted and a |Timeout| error is returned to the client.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              setPageLoadTimeout(ms, cb) -&gt; cb(err)<br>
            
              (use setImplicitWaitTimeout and setAsyncScriptTimeout to set the other timeouts)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/timeouts/async_script">/session/:sessionId/timeouts/async_script</a><br>
            Set the amount of time, in milliseconds, that asynchronous scripts executed by /session/:sessionId/execute_async are permitted to run before they are aborted and a |Timeout| error is returned to the client.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              setAsyncScriptTimeout(ms, cb) -&gt; cb(err)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/timeouts/implicit_wait">/session/:sessionId/timeouts/implicit_wait</a><br>
            Set the amount of time the driver should wait when searching for elements.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              setAsyncScriptTimeout(ms, cb) -&gt; setImplicitWaitTimeout(ms, cb) -&gt; cb(err)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/window_handles">/session/:sessionId/window_handles</a><br>
            Retrieve the list of all window handles available to the session.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              windowHandles(cb) -&gt; cb(err, arrayOfHandles)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/url">/session/:sessionId/url</a><br>
            Retrieve the URL of the current page.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              url(cb) -&gt; cb(err, url)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/url">/session/:sessionId/url</a><br>
            Navigate to a new URL.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              Get a new url: <br>
            
              get(url,cb) -&gt; cb(err)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/forward">/session/:sessionId/forward</a><br>
            Navigate forwards in the browser history, if possible.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              forward(cb) -&gt; cb(err)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/back">/session/:sessionId/back</a><br>
            Navigate backwards in the browser history, if possible.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              back(cb) -&gt; cb(err)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/execute">/session/:sessionId/execute</a><br>
            Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
          
            <p>
              
                Evaluate expression (using execute): <br>
              
                eval(code, cb) -&gt; cb(err, value)<br>
              
            </p>
          
            <p>
              
                Evaluate expression (using safeExecute): <br>
              
                safeEval(code, cb) -&gt; cb(err, value)<br>
              
            </p>
          
            <p>
              
                Execute script: <br>
              
                execute(code, args, cb) -&gt; cb(err, value returned)<br>
              
                execute(code, cb) -&gt; cb(err, value returned)<br>
              
                args: script argument array (optional)<br>
              
                 <br>
              
            </p>
          
            <p>
              
                Execute script using eval(code): <br>
              
                safeExecute(code, args, cb) -&gt; cb(err, value returned)<br>
              
                safeExecute(code, cb) -&gt; cb(err, value returned)<br>
              
                args: script argument array (optional)<br>
              
                 <br>
              
            </p>
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/execute_async">/session/:sessionId/execute_async</a><br>
            Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
          
            <p>
              
                Execute async script: <br>
              
                executeAsync(code, args, cb) -&gt; cb(err, value returned)<br>
              
                executeAsync(code, cb) -&gt; cb(err, value returned)<br>
              
                args: script argument array (optional)<br>
              
                 <br>
              
            </p>
          
            <p>
              
                Execute async script using eval(code): <br>
              
                safeExecuteAsync(code, args, cb) -&gt; cb(err, value returned)<br>
              
                safeExecuteAsync(code, cb) -&gt; cb(err, value returned)<br>
              
                args: script argument array (optional)<br>
              
            </p>
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/window">/session/:sessionId/window</a><br>
            Change focus to another window.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              window(name, cb) -&gt; cb(err)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/window">/session/:sessionId/window</a><br>
            Close the current window.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              close(cb) -&gt; cb(err)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/cookie">/session/:sessionId/cookie</a><br>
            Retrieve all cookies visible to the current page.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              allCookies() -&gt; cb(err, cookies)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/cookie">/session/:sessionId/cookie</a><br>
            Set a cookie.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              setCookie(cookie, cb) -&gt; cb(err)<br>
            
              cookie example:  <br>
            
               {name:'fruit', value:'apple'}<br>
            
              Optional cookie fields: <br>
            
               path, domain, secure, expiry<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/cookie">/session/:sessionId/cookie</a><br>
            Delete all cookies visible to the current page.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              deleteAllCookies(cb) -&gt; cb(err)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            DELETE <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/cookie/:name">/session/:sessionId/cookie/:name</a><br>
            Delete the cookie with the given name.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              deleteCookie(name, cb) -&gt; cb(err)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/title">/session/:sessionId/title</a><br>
            Get the current page title.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              title(cb) -&gt; cb(err, title)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element">/session/:sessionId/element</a><br>
            Search for an element on the page, starting from the document root.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
          
            <p>
              
                element(using, value, cb) -&gt; cb(err, element)<br>
              
            </p>
          
            <p>
              
                elementByClassName(value, cb) -&gt; cb(err, element)<br>
              
                elementByCssSelector(value, cb) -&gt; cb(err, element)<br>
              
                elementById(value, cb) -&gt; cb(err, element)<br>
              
                elementByName(value, cb) -&gt; cb(err, element)<br>
              
                elementByLinkText(value, cb) -&gt; cb(err, element)<br>
              
                elementByPartialLinkText(value, cb) -&gt; cb(err, element)<br>
              
                elementByTagName(value, cb) -&gt; cb(err, element)<br>
              
                elementByXPath(value, cb) -&gt; cb(err, element)<br>
              
                elementByCss(value, cb) -&gt; cb(err, element)<br>
              
            </p>
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/active">/session/:sessionId/element/active</a><br>
            Get the element on the page that currently has focus.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              active(cb) -&gt; cb(err, element)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/click">/session/:sessionId/element/:id/click</a><br>
            Click on an element.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              clickElement(element, cb) -&gt; cb(err)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/text">/session/:sessionId/element/:id/text</a><br>
            Returns the visible text for the element.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
          
            <p>
              
                text(element, cb) -&gt; (err, text)<br>
              
                element: specific element, 'body', or undefined<br>
              
            </p>
          
            <p>
              
                Check if text is present: <br>
              
                textPresent(searchText, element, cb) -&gt; (err, boolean)<br>
              
                element: specific element, 'body', or undefined<br>
              
                 <br>
              
            </p>
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/value">/session/:sessionId/element/:id/value</a><br>
            Send a sequence of key strokes to an element.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              Type keys (all keys are up at the end of command): <br>
            
              type(element, keys, cb) -&gt; cb(err)<br>
            
              special key map: wd.SPECIAL_KEYS (see lib/special-keys.js)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/keys">/session/:sessionId/keys</a><br>
            Send a sequence of key strokes to the active element.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              Press keys (keys may still be down at the end of command): <br>
            
              keys(keys, cb) -&gt; cb(err)<br>
            
              special key map: wd.SPECIAL_KEYS (see lib/special-keys.js)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/clear">/session/:sessionId/element/:id/clear</a><br>
            Clear a TEXTAREA or text INPUT element's value.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              clear(element, cb) -&gt; cb(err)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            GET <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/attribute/:name">/session/:sessionId/element/:id/attribute/:name</a><br>
            Get the value of an element's attribute.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
          
            <p>
              
                getAttribute(element, attrName, cb) -&gt; cb(err, value)<br>
              
            </p>
          
            <p>
              
                Get element value (in value attribute): <br>
              
                getValue(element, cb) -&gt; cb(err, value)<br>
              
            </p>
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/accept_alert">/session/:sessionId/accept_alert</a><br>
            Accepts the currently displayed alert dialog.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              acceptAlert(cb) -&gt; cb(err)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/dismiss_alert">/session/:sessionId/dismiss_alert</a><br>
            Dismisses the currently displayed alert dialog.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              dismissAlert(cb) -&gt; cb(err)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/moveto">/session/:sessionId/moveto</a><br>
            Move the mouse by an offset of the specificed element.
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              Move to element, xoffset and y offset are optional: <br>
            
              moveTo(element, xoffset, yoffset, cb) -&gt; cb(err)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/click">/session/:sessionId/click</a><br>
            Click any mouse button (at the coordinates set by the last moveto command).
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              Click on current element: <br>
            
              click(button, cb) -&gt; cb(err)<br>
            
              Buttons: {left: 0, middle: 1 , right: 2}<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/buttondown">/session/:sessionId/buttondown</a><br>
            Click and hold the left mouse button (at the coordinates set by the last moveto command).
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              buttonDown(cb) -&gt; cb(err)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/buttonup">/session/:sessionId/buttonup</a><br>
            Releases the mouse button previously held (where the mouse is currently at).
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              buttonUp(cb) -&gt; cb(err)<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
            POST <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/doubleclick">/session/:sessionId/doubleclick</a><br>
            Double-clicks at the current mouse coordinates (set by moveto).
          
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              doubleclick(cb) -&gt; cb(err) <br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            EXTRA
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              Waits for JavaScript condition to be true (polling within wd client): <br>
            
              waitForCondition(conditionExpr, timeout, pollFreq, cb) -&gt; cb(err, boolean)<br>
            
              waitForCondition(conditionExpr, timeout, cb) -&gt; cb(err, boolean)<br>
            
              waitForCondition(conditionExpr, cb) -&gt; cb(err, boolean)<br>
            
              conditionExpr: condition expression, should return a boolean<br>
            
              timeout: timeout (optional, default: 1000) <br>
            
              pollFreq: pooling frequency (optional, default: 100)<br>
            
              return true if condition satisfied, error otherwise.<br>
            
          
          
        </td>
      </tr>
    
      <tr>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            EXTRA
          
        </td>
        <td style="border: 1px solid #ccc; padding: 5px;">
          
          
            
              Waits for JavaScript condition to be true (async script polling within browser): <br>
            
              waitForConditionInBrowser(conditionExpr, timeout, pollFreq, cb) -&gt; cb(err, boolean)<br>
            
              waitForConditionInBrowser(conditionExpr, timeout, cb) -&gt; cb(err, boolean)<br>
            
              waitForConditionInBrowser(conditionExpr, cb) -&gt; cb(err, boolean)<br>
            
              conditionExpr: condition expression, should return a boolean<br>
            
              timeout: timeout (optional, default: 1000) <br>
            
              pollFreq: pooling frequency (optional, default: 100)<br>
            
              return true if condition satisfied, error otherwise.<br>
            
          
          
        </td>
      </tr>
      
  </tbody>
</table>


### Full JsonWireProtocol mapping:

[full mapping](https://github.com/sebv/wd/blob/master/doc/jsonwiremap-all.md)

## More docs!
<pre>
WD is simply implementing the Selenium JsonWireProtocol, for more details see the official docs:
 - <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol">http://code.google.com/p/selenium/wiki/JsonWireProtocol</a>
</pre>

## Run the tests!
<pre>
  - Run the selenium server with chromedriver: 
      java -jar selenium-server-standalone-2.21.0.jar -Dwebdriver.chrome.driver=&lt;PATH&gt;/chromedriver
  - cd wd
  - npm install .
  - make test
  - look at the results!
</pre>

## Run the tests on Sauce Labs cloud!
<pre>
  - cd wd
  - npm install .
  - make test_saucelabs
</pre>

## Test Coverage

[test coverage](http://admc.io/wd/coverage.html)
