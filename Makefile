TEST_DIR = test/common test/unit test/local test/saucelabs
TEST_COFFEE_FILES = $(shell find test/common/*.coffee test/unit/*.coffee \
test/local/*.coffee test/saucelabs/*.coffee)

DEFAULT:
	@echo
	@echo '  make test -> run the unit and  local tests (start selenium with chromedriver first).'
	@echo '  make test_unit -> run the unit tests'
	@echo '  make test_local -> run the local tests (start selenium with chromedriver first).'
	@echo '  make test_saucelabs -> run the saucelabs tests (configure username/access_key first).'
	@echo '  make test_coverage -> generate test coverage (install jscoverage first).'
	@echo '  make compile2js -> compile coffee files to js.'
	@echo '  make compile2js_watch -> compile coffee files to js, watch for changes.'
	@echo '  make cleanGenJs -> clean js files generated from coffeescript.'
	@echo

# run unit and local tests, start selenium server first
test:
	./node_modules/.bin/mocha \
	test/unit/*-test.coffee \
	test/local/*-test.coffee

# run unit tests
test_unit:
	./node_modules/.bin/mocha test/unit/*-test.coffee

# run local tests, start selenium server first
test_local:
	./node_modules/.bin/mocha test/local/*-test.coffee

# run saucelabs test, configure username/key first
test_saucelabs:
	./node_modules/.bin/mocha test/saucelabs/*-test.coffee

# run test coverage, install jscoverage first
test_coverage:
	rm -rf lib-cov
	jscoverage --no-highlight lib lib-cov --exclude=bin.js
	WD_COV=1 ./node_modules/.bin/mocha --reporter html-cov \
	test/unit/*-test.coffee \
	test/local/*-test.coffee \
	test/saucelabs/*-test.coffee \
  > coverage.html

# remove all the generated js
cleanGenJs:
	@rm -f test/common/*.js test/local/*.js test/saucelabs/*.js

# compile once
compile2js:
	@./node_modules/.bin/coffee --compile $(TEST_DIR)
# compile, and then watch for changes
compile2js_watch:
	./node_modules/.bin/coffee --compile --watch $(TEST_DIR)

.PHONY: \
	test \
	test_unit \
	test_local \
	test_saucelabs \
	test_coverage \
	compile2js \
	compile2js_watch \
	cleanGenJs DEFAULT
