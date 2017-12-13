#!/usr/bin/env bash
git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"
git add dist
git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
git remote add origin-pages https://${GH_TOKEN}@github.com/MVSE-outreach/resources.git > /dev/null 2>&1
git push