#!/bin/bash
echo Welcome to the MMM-awesome-alexa easy installer

if [[ $UID != 0 ]]; then
    echo "Please run this script with sudo:"
    echo "sudo bash $0 $*"
    exit 1
fi

sudo npm install
sudo cd node_modules
sudo rm -rf snowboy
sudo git clone https://github.com/Kitt-AI/snowboy.git
sudo cd snowboy
sudo rm -rf node_modules
sudo npm install nan --save
sudo npm install node-pre-gyp@0.12.0 --save
sudo npm install
sudo npm run prepublish
sudo npm install --save-dev electron-rebuild
sudo npm install nan
sudo ./node_modules/.bin/electron-rebuild
