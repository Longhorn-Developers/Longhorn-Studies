#!/usr/bin/env bash
# Usage: ./update_db.sh [base_url]
# Example: ./update_db.sh
# Example: ./update_db.sh http://localhost:8000/api
set -e
BASE="${1:-http://localhost:8000/api}"

echo -e "\n=== Get all study spots ==="
curl -s "${BASE}/study_spots" | python3 -m json.tool

echo -e "\n=== Create a study spot ==="
RESP=$(curl -s -X POST "${BASE}/study_spots" \
  -H "Content-Type: application/json" \
  -d '{
    "abbreviation": "TEST",
    "study_spot_name": "TEST",
    "building_name": "TEST",
    "address": "TEST",
    "floor": null,
    "tags": ["TEST"],
    "pictures": [],
    "noise_level": "TEST",
    "capacity": 0,
    "spot_type": ["TEST"],
    "access_hours": "TEST",
    "near_food": true,
    "additional_properties": "TEST",
    "reservable": true,
    "description": "TEST"
  }')
echo "$RESP" | python3 -m json.tool
ID=$(echo "$RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))")

echo -e "\n=== Get updated study spots ==="
curl -s "${BASE}/study_spots" | python3 -m json.tool

echo -e "\nDone."
