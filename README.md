Mozilla London 2014
===================

AwayJS project created for [London HTML5 Game Developers](http://www.meetup.com/London-HTML5-Game-Developers/) meetup @ [Mozilla London](https://www.mozilla.org/en-US/contact/spaces/london/), October 2014.

The example demonstrates how to setup and compile an AwayJS project on your development machine. It uses [npm](https://www.npmjs.org/) for module management, and a variety of common development tools including [Gulp](http://gulpjs.com/), [Typescript](http://www.typescriptlang.org/) and [Browserify](http://browserify.org/) to rebuild the source files.

Download
========

To get started, first download this repo to your local machine. You can either

 1. Download the [master branch zip](archive/master.zip) and unpack to our project directory.
 2. Clone the repo to a local directory on your computer using git.

For the latter, you can use Github's own client or call git from the command line. Learn about installation by following [github's guide for setting up locally](https://help.github.com/articles/set-up-git/)

For command-line cloning, open a terminal window (Mac) or cmd prompt (Windows). Start by creating a project folder where you want to download the source files to:

    mkdir Mozilla_London_2014

Enter the directory:

    cd Mozilla_London_2014

Then call the following git command:

    git clone https://github.com/rob-bateman/Mozilla_London_2014.git

This will download the source files to your machine ready for use.

Install
=======

In order to rebuild the example, you will need to install the development dependencies of the project (including AwayJS). For this you will need [nodejs](http://nodejs.org/) installed on your local machine.

Goto [http://nodejs.org/](http://nodejs.org/) to grab the latest version of node and download, unpack & install on your local machine (Installers exist for Mac, Linux or Windows).

Node installs with its own package manager called [npm](https://www.npmjs.org/). This is used for installing many different development utilities such as the Typescript compiler used in compiling. It is also the method used for downloading all AwayJS resources.

To install the npm modules required here, simply browse to your project folder in your terminal window and type:

    npm install

If you're on a Mac, depending on your setup you may need administrator permissions. If you are prompted to retry the install  in which case you should type:

    sudo npm install

and enter your administrator password when prompted.

Once installation is complete, you should see a new directory in your project folder called `node_modules`. This is where npm dependencies are stored. If you browse the directory you should see a bunch of different module directories, including those for AwayJS.

Run
===

In order to run the example in a browser, you'll need to setup a local server on the `bin` folder of your project. You can use any number of different server software for this, but one of the fastest and simplest is provided by node itself.

To create a straightforward http server, try installing the `http-server` module from npm:

    npm install http-server -g

The `-g` option installs the module globally, allowing it to be accessible from any directory on your machine. Once again, administrator privileges may be necessary for Mac users.

To run the http-server, create a separate terminal window, browser to the project's `bin` folder and type:

     http-server

Now you can open the following url in the brower of your choice:

     http://localhost:8080/Intermediate_AWDViewer.html

The demo loads a rigged character model that you can control. Use keys 1-5 for different attack modes. Click and drag with the mouse to view the character from any angle.

Rebuild
=======

The example uses task runner [Gulp](http://gulpjs.com/) to recompile sources. All development modules (including gulp) should have been installed by using the `npm install` command described in the [Install](#Install) section.

Gulp also uses the command line to execute - simply browse to the project root and choose from the following options to rebuild the code in the `bin` folder:

    gulp compile

Uses the Typescript compiler to compile the example `.ts` source into a `.js` file. This is the fastest rebuild method, but requires the use of an extra `<script>` tag containing a pre-compiled version of the AwayJS libs in order to work. The `http://localhost:8080/Intermediate_AWDViewer_Test.html` url can be used to view any changes made to the example sources when rebuilt in this way.

    gulp package

Executes `compile`, then uses browserify to create a custom js file that only embeds the code required to run the example. The `http://localhost:8080/Intermediate_AWDViewer.html` url can be used to view any changes made to the example sources when rebuilt in this way.

    gulp package-min

Executes `package`, then uses an `uglifyjs` module to create a minified js file that only embeds the code required to run the example. The `http://localhost:8080/Intermediate_AWDViewer.html` url can be used to view any changes made to the example sources when rebuilt in this way.

Trying out all of the different compile options, you'll notice that `package-min` produces the most compact option but is also the slowest to execute. This build method is generally used when you are about to deploy a project, in order to get maximum compression for the final js source file. The `compile` option on the other hand is the fastest way to see what your example source is doing, and could be easily used with a simple watcher script and browser reloader to test code fast. It does however require an extra `<script>` tag to hold the precompiled AwayJS sources, hence the use of a different URL to see changes. This approach is not recommended for deploying final builds as it doesn't package resources in the most optimal way.


Sourcemaps
==========

The `gulp` scripts in this example enable full sourcemaps in the resulting `.js` package, allowing you to browse the original source files from inside the browser debugging window (for those browsers that support the sourcemaps feature). This can be invaluable when searching for bugs, allowing developers to set breakpoints and step through code from the original `.ts` or `.js` files rather than the minified runtime code.