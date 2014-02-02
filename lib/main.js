var url = require('url'),
    SPECIAL_KEYS = require('./utils/special-keys'),
    Webdriver = require('./core/webdriver'),
    AsyncWebdriver = require('./async/webdriver-async'),
    helpers = require('./utils/helpers'),
    deprecator = helpers.deprecator,
    config = require('./core/config'),
    _ = require('./utils/lodash'),
    Q = require('q'),
    commands = require('./commands/webdriver-commands'),
    coreAsserters = require('./core/asserters'),
    predefinedAsserters = require('./utils/predefined-asserters');

function buildConfigUrl(remoteWdConfig)
{
  var configUrl = _(remoteWdConfig).clone();

  // for backward compatibility
  if (configUrl.host && (configUrl.host.indexOf(':') < 0) && configUrl.port)
  {
    configUrl.hostname = configUrl.host;
    delete configUrl.host;
  }

  // for backward compatibility
  if (configUrl.username) {
    configUrl.user = configUrl.username;
    delete configUrl.username;
  }

  // for backward compatibility
  if (configUrl.accessKey) {
    configUrl.pwd = configUrl.accessKey;
    delete configUrl.accessKey;
  }

  // for backward compatibility
  if (configUrl.https) {
    configUrl.protocol = 'https:';
    delete configUrl.https;
  }

  // for backward compatibility
  if (configUrl.path) {
    configUrl.pathname = configUrl.path;
    delete configUrl.path;
  }

  // setting auth from user/password
  if (configUrl.user && configUrl.pwd) {
    configUrl.auth = configUrl.user + ':' + configUrl.pwd;
    delete configUrl.user;
    delete configUrl.pwd;
  }

  _.defaults(configUrl, {
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: '4444',
    pathname: '/wd/hub'
  });

  // strip any trailing slashes from pathname
  var parsed = url.parse(url.format(configUrl), true);
  if (parsed.pathname[parsed.pathname.length - 1] === '/') {
    parsed.pathname = parsed.pathname.slice(0, parsed.pathname.length - 1);
  }
  return parsed;
}

// parses server parameters
var parseRemoteWdConfig = function (args) {
  var config;
  if ((typeof args[0]) === 'object') {
    if (args[0].href && args[0].format) {
      // was constructed with url.parse, so we don't modify it
      config = args[0];
    } else {
      config = buildConfigUrl(args[0]);
    }
  } else if ((typeof args[0]) === 'string' && (args[0].match(/^https?:\/\//))) {
    config = url.parse(args[0]);
  } else {
    config = buildConfigUrl({
      hostname: args[0],
      port: args[1],
      user: args[2],
      pwd: args[3]
    });
  }

  // saucelabs automatic config
  if (/saucelabs\.com/.exec(config.hostname))
  {
    if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
      config.auth = process.env.SAUCE_USERNAME + ':' +
        process.env.SAUCE_ACCESS_KEY;
    }
  }

  return config;
};

// Creates the Webdriver object
// server parameters can be passed in 4 ways
//   - as a url string
//   - as a url object, constructed via url.parse
//   - as a list of arguments host,port, user, pwd
//   - as an option object containing the fields above
// A `driverType` string may be passed at the end of the argument list.
// If it is a valid type it will be detected even if the other arguments
// are ommited. Valide types are: `remote`, `promise` and `promiseChain`.
function remote() {
  var args = helpers.varargs(arguments).array;
  var driverType = ['async', 'promise', 'promiseChain']
    .indexOf(_(args).last()) > 0 ? args.pop() : 'async';
  var rwc = parseRemoteWdConfig(args);
  switch (driverType) {
    case 'async':
      return (new Webdriver(rwc, false))._asyncFacade;
      //return new AsyncWebdriver(rwc);
    case 'promise':
      return new Webdriver(rwc, false);
    case 'promiseChain':
      return new Webdriver(rwc);
    default:
      throw new Error('Unknown driver type.');
  }
}

// todo: allow adding element methods

function addPromiseMethod(name, method) {
  commands[name] = method;
  Webdriver.addCommand(name, method);
}

function addAsyncMethod(name, method) {
  var wrappedMethod = Webdriver.wrapAsyncCommand(name, method);
  addPromiseMethod(name, wrappedMethod);
}

function removeMethod(name) {
  delete AsyncWebdriver.prototype[name];
  delete Webdriver.prototype[name];
}

// creates a webdriver object using the Q promise wrap not chained
function asyncRemote() {
  var args = helpers.varargs(arguments).array;
  var rwc = parseRemoteWdConfig(args);
  return (new Webdriver(rwc, false))._asyncFacade;
}

// creates a webdriver object using the Q promise wrap not chained
function promiseRemote() {
  var args = helpers.varargs(arguments).array;
  var rwc = parseRemoteWdConfig(args);
  return new Webdriver(rwc, false);
}

// creates a webdriver object using the Q promise wrap chained
function promiseChainRemote() {
  var args = helpers.varargs(arguments).array;
  var rwc = parseRemoteWdConfig(args);
  return new Webdriver(rwc);
}

module.exports = {
  // Retrieves browser
  remote: remote,
  asyncRemote: asyncRemote,

  // Retrieves wrap browser
  promiseRemote: promiseRemote,
  promiseChainRemote: promiseChainRemote,

  // Webdriver and Wrapper base classes
  Webdriver: AsyncWebdriver,
  webdriver: AsyncWebdriver, // for backward compatibility
  //Element: AsyncElement,
  PromiseChainWebdriver: Webdriver,
  PromiseWebdriver: Webdriver,

  // Actualizes promise wrappers
  rewrap: function () {
    deprecator.warn('rewrap',
    'rewrap has been deprecated, use addAsyncMethod instead.');
  },

  /* jshint ignore:start */
  /**
   * wd.configureHttp(opts)
   *
   * opts example:
   * {timeout:60000, retries: 3, 'retryDelay': 15, baseUrl='http://example.com/'}
   * more info in README.
   *
   * @wd
   */
  /* jshint ignore:end */
  configureHttp: config.configureHttp,
  getHttpConfig: function () { return _(config.httpConfig).clone(); },

  // deprecation
  /**
   * wd.showHideDeprecation(boolean)
   *
   * @wd
   */
  showHideDeprecation: deprecator.showHideDeprecation.bind(deprecator),

  // add/remove methods
  /**
   * wd.addAsyncMethod(name, func)
   *
   * @wd
   */
  addAsyncMethod: addAsyncMethod,
  /**
   * wd.addPromiseMethod(name, func)
   *
   * @wd
   */
  addPromiseMethod: addPromiseMethod,
  /**
   * wd.addPromiseChainMethod(name, func)
   *
   * @wd
   */
  addPromiseChainMethod: addPromiseMethod,
  /**
   * wd.removeMethod(name, func)
   *
   * @wd
   */
  removeMethod: removeMethod,

  // Useful stuff
  Asserter: coreAsserters.Asserter,
  PromiseAsserter: coreAsserters.Asserter,
  AsyncAsserter: coreAsserters.AsyncAsserter,
  asserters: predefinedAsserters,
  SPECIAL_KEYS: SPECIAL_KEYS,
  Q: Q,
  findCallback: helpers.findCallback,
  varargs: helpers.varargs,
  transferPromiseness: helpers.transferPromiseness,
};
