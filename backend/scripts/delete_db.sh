#!/usr/bin/env bash
# Usage: ./delete_db.sh <study_spot_id> [base_url]
# Example: ./delete_db.sh 1
# Example: ./delete_db.sh 2 http://localhost:8000/api
set -e
ID="${1:?Usage: $0 <study_spot_id> [base_url]}"
BASE="${2:-http://localhost:8000/api}"

echo -e "\n=== Get all study spots ==="
curl -s "${BASE}/study_spots" | python3 -m json.tool

echo -e "\n=== Delete study spot (id=$ID) ==="
curl -s -X DELETE "${BASE}/study_spots/${ID}" | python3 -m json.tool

echo -e "\n=== Get study spots after delete ==="
curl -s "${BASE}/study_spots" | python3 -m json.tool

echo -e "\nDone."
