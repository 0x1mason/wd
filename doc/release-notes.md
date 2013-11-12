# Release Notes

## 0.2.x Release

### 0.2.0

- New wrapper: promise chain.
- Old chain api is deprecated (It is still available, but you will see a depreciation message).
- There are some changes in the way the element and webdriver classes are passed around
which may affect external wrappers. External wrappers should now subclass those 2 classes. 

### 0.2.1
 
- New test suite using the promise chain api.
- `browser.Q` was moved to `wd.Q`.

### 0.2.2 

- chai-as-promised v4 compatible.
- Promise wrappers can now be monkey patched directly.
- New saucelabs helpers.

Incompatibilities: 

  - There is a new method to call, `wd.rewrap()`, to propagate async monkey 
  patching to promise. (see [here](https://github.com/admc/wd/blob/master/examples/promise/monkey.patch-with-async.js#L35) and the monkey patch section below)
  - The chai-as-promised setup has changed in v4, look out for the `transferPromiseness` (Requires chai-as-promised 4.1.0 or greater)
  line in the examples. (see [here](https://github.com/admc/wd/blob/master/examples/promise/chrome.js#L15))

### 0.2.3 (In progress) 
  - http configuration enhancements, see doc [here](https://github.com/admc/wd#http-configuration).
  - `waitFor`, `waitForElement` and asserters replacing existing wait methods.
  - addPromiseChainMethod/addPromiseMethod/addAsyncMethod/removeMethod replacing monkey patching.
  Please refer to the add method section in README.
  - Support for external promise libraries.
  - New saveScreenshot method.
  - rootUrl functionality (todo)
