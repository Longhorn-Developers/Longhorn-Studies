#!/usr/bin/env bash
# Update specific fields of a study spot by ID.
# Reads JSON object from stdin (only the fields to update).
# Usage: ./update_fields.sh <study_spot_id> [base_url]
# Example: echo '{"description":"Updated description"}' | ./update_fields.sh 1
# Example: echo '{"pictures":["a.jpg","b.jpg"],"noise_level":"Quiet"}' | ./update_fields.sh 2 http://localhost:8000/api
set -e
ID="${1:?Usage: $0 <study_spot_id> [base_url] - JSON body read from stdin}"
BASE="${2:-http://localhost:8000/api}"

if [ -t 0 ]; then
  echo "No JSON provided on stdin. Usage: echo '{\"...\"}' | $0 <id> [base_url]" >&2
  exit 1
fi

JSON=$(cat)
echo "PUT study_spot id=$ID with body:"
echo "$JSON" | python3 -m json.tool
echo ""
curl -s -X PUT "${BASE}/study_spots/${ID}" \
  -H "Content-Type: application/json" \
  -d "$JSON" | python3 -m json.tool
