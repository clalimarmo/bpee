Javascript Application
======================

Basic infrastructure for javascript application, with testing via mocha/karma.

## Setup

* Install Ruby
* Install Bundler - run `$ gem install bundler`
* Install the Ruby dependencies - run `$ bundle install`
* Install Node.js
* Install the Node dependencies - run `$ npm install`
* Install the grunt CLI - run `$ npm install -g grunt-cli`
* Verify your environment is set up by running `$ grunt`. If you end up
with a `./build` directory, and passing test suite, you're ready to
start developing.

## Building with Grunt

The default task builds a development instance of the app, runs the linter,
runs the test suite, and exits. This task would be suitable for testing on CI.
(Outputs to `build` directory).

    $ grunt

Rebuilding and running tests automatically, when source code is changed
(suitable for development):

    $ grunt watch

The same, but with the app served at https://localhost:8000

    $ grunt server

More detailed test coverage information:

    $ grunt coverage

Building for use in production (outputs to `dist` directory):

    $ grunt build:dist

Testing production build in the sample `index.html` used for development
(outputs to `.tmp/testdist`, and serves at https://localhost:8001):

    $ grunt testdist

For a full list of grunt tasks:

    $ grunt --help

## Adding third party javascript libraries

Third party libraries are added to the build via bower. To add a library to
be installed by bower, run

    $ ./node_modules/bower/bin/bower install [some-library] --save

Alternatively, manually update `bower.json` to include the library and version
you want.

Note, if you have issues with the requirejs paths not matching the install
paths for anything bower installs, bower may be installing an old or incorrect
version of your library from its cache. Try clearing bower's cache:

    $ ./node_modules/bower/bin/bower cache clear

__Important: Make sure to commit changes to `bower.json`, so that the build
task will automatically add the new dependency for other developers, as well
as the CI and deploy processes.__

## Infrastructure, and npm

The role of npm in this project is to install project infrastructure dependencies
(such as the karma test runner, for example). It's also used to install grunt
tasks.

__Important: If infrastructure dependencies are changed, ensure `package.json`
is updated, and verify that the Setup instructions at the top of this README
are still accurate.__
