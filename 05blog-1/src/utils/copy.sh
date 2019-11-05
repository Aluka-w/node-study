#!/bin/sh
cd /Users/aluka/desktop/open/05blog-1/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log