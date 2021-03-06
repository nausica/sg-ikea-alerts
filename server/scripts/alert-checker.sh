#!/bin/sh

EXPECTED_ARGS=1

LOCAL_PATH=/Users/soniafabre/Projects/workspace/git/sg-ikea-alerts/server/scripts
STAGING_PATH=/home/ubuntu/journey-labs/sg-ikea-alerts/server/scripts

if [ $# -ne "$EXPECTED_ARGS" ]
  then
  echo "Usage: ./alert-checker.sh {local|staging}"
    exit $E_BADARGS
fi

case "$1" in
        local)
        mongo localhost:27017/alerts-ikea --quiet $LOCAL_PATH/db/find_active_alerts.js | awk -F\t '{system("curl -S -s \x27http://localhost:3000/api/manage/"$1"?email="$2"\x27")}'
        ;;
        staging)
        mongo localhost:27017/alerts-ikea --quiet $STAGING_PATH/db/find_active_alerts.js | awk '{system("curl -S -s \x27http://staging.ikeaalerts.com/api/manage/"$1"?email="$2"\x27")}'
        ;;
*)
    echo "Usage: ./generate_reports.sh {local|staging}"
    exit $E_BADARGS

esac




