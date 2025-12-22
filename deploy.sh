#!/bin/bash
npm run build
sudo rsync -av --delete build/ /var/www/citizen-connect/
echo "Deployed! Hard refresh your browser."
