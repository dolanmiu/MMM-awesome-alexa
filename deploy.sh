#!/usr/bin/env bash
echo "Deploying"
git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"
git add dist
git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
git remote add origin https://${GH_TOKEN}@github.com/dolanmiu/MMM-awesome-alexa.git > /dev/null 2>&1
echo "Pushing to master"
git push -u origin master