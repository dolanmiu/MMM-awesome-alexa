#!/usr/bin/env bash
echo "Deploying"
echo "Setting credentials"
git config --global user.email "dolan_miu@hotmail.com"
git config --global user.name "Dolan Miu"
echo "Adding dist folder"
git add dist
echo "Commiting"
git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
echo "Add origin"
git remote add origin https://${GH_TOKEN}@github.com/dolanmiu/MMM-awesome-alexa.git > /dev/null 2>&1
echo "Pushing to master"
git push -u origin master