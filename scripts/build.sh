#!/bin/bash

# ------------------------------------------------------------------------------
# CREATES A LOCAL VERSION OF THE DEMO/DOCS BUILD
#
# The `scripts/ghp.sh` file is run by Travis CI to build the docs/demo pages and
# deploy those pages to by pushing to a special Github repo.
#
# This script has a small subset of the build steps. It can be used for fast
# local builds to simulate the production site. Alternatively, it can be used
# to create a local build that can be pushed to the docs site if a hotfix is
# needed and Travis is taking too long.
#
# CONFIGURING YOUR PROJECT:
#
# Your project should include at least the following files, in addition to any
# code for the project itself:
#
# project/
#  |- scripts/build.sh
#  |- node_modules/
#  |- bower_components/
#  |- bower.json
#  |- polymer.json
#  |- package.json
#
# package.json requirements:
# - `bower` and `polymer-cli` (1.3.0+) must be installed as devDependencies
#
# bower.json requirements:
# - the repo name must be in the "name" field
#
# polymer.json requirements:
# - the build must be configured, with all required sources listed
#
# Additionally, the `build/` directory should be empty and added to `.gitignore`
# to ensure nothing important is overwritten.
#
# HOW TO USE IT:
#
# These commands should be run from the root of your project.
#
# 1. This file should be saved in your project as `scripts/build.sh`.
# 2. Run `yarn install` or `npm install` (your choice)
# 3. Run `bower install`
# 4. Run `./scripts/build.sh`
# ------------------------------------------------------------------------------

# Find repo name from the bower file
REPO_NAME=$(grep "name" bower.json | sed 's/"name": "//' | sed 's/",//' | sed -e 's/^[[:space:]]*//')

echo "Starting build for $REPO_NAME"

# Bower install theme dependencies
./node_modules/.bin/bower install px-theme px-dark-theme px-dark-demo-theme

# Run polymer build to transpile code. The output will be placed in the
# `build/unbundled` directory
./node_modules/.bin/polymer build

# Open the build directory
cd build/

# Rename unbundled --> $REPO_NAME, move all the bower_components/ up one level
# so they're beside to $REPO_NAME
mv unbundled $REPO_NAME
rm -rf "$REPO_NAME/bower_components/$REPO_NAME/"
find "$REPO_NAME/bower_components" -mindepth 1 -maxdepth 1 -print0 | xargs -0 -I {} mv {} .
rm -rf "$REPO_NAME/bower_components/"

# Add the redirect
# Note: We are not overwriting the component's documentation `index.html` file
# here, we are making sure that http://url/px-something/ redirects to
# http://url/px-something/px-something/, where the demo page is installed
echo "<META http-equiv=refresh content=\"0;URL=$REPO_NAME/\">" > index.html

echo ""
echo "================================================"
echo "Build finished in $(pwd)"
echo "================================================"
echo ""
