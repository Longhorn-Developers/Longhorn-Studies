#!/usr/bin/env bash
# Verify CRUD operations against the study_spots API.
# Usage: ./test_crud_db.sh [base_url]
# Example: ./test_crud_db.sh
# Example: ./test_crud_db.sh http://localhost:8000/api
set -euo pipefail

BASE="${1:-http://localhost:8000/api}"
TEST_SUFFIX="$(date +%s)"
ID=""

pass() {
  echo "[PASS] $1"
}

fail() {
  echo "[FAIL] $1" >&2
  exit 1
}

extract_json_field() {
  local json="$1"
  local field="$2"

  python3 -c 'import json,sys
raw=sys.argv[1]
field=sys.argv[2]
try:
    obj=json.loads(raw)
except Exception:
    print("")
    raise SystemExit(0)
val=obj.get(field, "")
if isinstance(val, bool):
    print("true" if val else "false")
elif val is None:
    print("")
else:
    print(val)
' "$json" "$field"
}

request() {
  local method="$1"
  local url="$2"
  local body="${3:-}"

  if [ -n "$body" ]; then
    curl -s -w '\n%{http_code}' -X "$method" "$url" \
      -H "Content-Type: application/json" \
      -d "$body"
  else
    curl -s -w '\n%{http_code}' -X "$method" "$url"
  fi
}

split_response() {
  local combined="$1"
  HTTP_CODE="$(printf '%s' "$combined" | tail -n 1)"
  HTTP_BODY="$(printf '%s' "$combined" | sed '$d')"
}

cleanup() {
  if [ -n "$ID" ]; then
    request DELETE "${BASE}/study_spots/${ID}" >/dev/null || true
  fi
}

trap cleanup EXIT

echo "Running CRUD database verification against: ${BASE}"

# Create
CREATE_PAYLOAD=$(cat <<JSON
{
  "abbreviation": "T${TEST_SUFFIX}",
  "study_spot_name": "CRUD Test ${TEST_SUFFIX}",
  "building_name": "Test Building",
  "address": "123 Test Ave",
  "floor": 1,
  "tags": ["test", "crud"],
  "pictures": ["test.jpg"],
  "noise_level": "Quiet",
  "capacity": 10,
  "spot_type": ["Library"],
  "access_hours": [
    ["00:00", "23:59"],
    ["00:00", "23:59"],
    ["00:00", "23:59"],
    ["00:00", "23:59"],
    ["00:00", "23:59"],
    ["00:00", "23:59"],
    ["00:00", "23:59"]
  ],
  "near_food": true,
  "additional_properties": "Script-created test record",
  "reservable": false,
  "description": "Temporary record for CRUD verification"
}
JSON
)

split_response "$(request POST "${BASE}/study_spots" "$CREATE_PAYLOAD")"
[ "$HTTP_CODE" = "201" ] || fail "CREATE expected HTTP 201, got ${HTTP_CODE}. Body: ${HTTP_BODY}"
ID="$(extract_json_field "$HTTP_BODY" id)"
[ -n "$ID" ] || fail "CREATE did not return an id. Body: ${HTTP_BODY}"
pass "CREATE returned 201 and id=${ID}"

# Read by id
split_response "$(request GET "${BASE}/study_spots/${ID}")"
[ "$HTTP_CODE" = "200" ] || fail "READ expected HTTP 200, got ${HTTP_CODE}. Body: ${HTTP_BODY}"
NAME="$(extract_json_field "$HTTP_BODY" study_spot_name)"
[ "$NAME" = "CRUD Test ${TEST_SUFFIX}" ] || fail "READ returned unexpected study_spot_name: ${NAME}"
pass "READ returned expected record"

# Update
UPDATE_PAYLOAD='{"description":"Updated by CRUD test script","capacity":42}'
split_response "$(request PUT "${BASE}/study_spots/${ID}" "$UPDATE_PAYLOAD")"
[ "$HTTP_CODE" = "200" ] || fail "UPDATE expected HTTP 200, got ${HTTP_CODE}. Body: ${HTTP_BODY}"
UPDATED_DESC="$(extract_json_field "$HTTP_BODY" description)"
UPDATED_CAPACITY="$(extract_json_field "$HTTP_BODY" capacity)"
[ "$UPDATED_DESC" = "Updated by CRUD test script" ] || fail "UPDATE description not applied"
[ "$UPDATED_CAPACITY" = "42" ] || fail "UPDATE capacity not applied"
pass "UPDATE applied expected fields"

# Delete
split_response "$(request DELETE "${BASE}/study_spots/${ID}")"
[ "$HTTP_CODE" = "200" ] || fail "DELETE expected HTTP 200, got ${HTTP_CODE}. Body: ${HTTP_BODY}"
pass "DELETE returned 200"

# Confirm delete
split_response "$(request GET "${BASE}/study_spots/${ID}")"
[ "$HTTP_CODE" = "404" ] || fail "POST-DELETE READ expected HTTP 404, got ${HTTP_CODE}. Body: ${HTTP_BODY}"
pass "POST-DELETE READ returned 404"

ID=""
echo "CRUD database verification completed successfully."

echo ""
echo "Current database contents (GET ${BASE}/study_spots):"
ALL_SPOTS="$(curl -s "${BASE}/study_spots")"
if printf '%s' "$ALL_SPOTS" | python3 -m json.tool >/dev/null 2>&1; then
  printf '%s' "$ALL_SPOTS" | python3 -m json.tool
else
  printf '%s\n' "$ALL_SPOTS"
fi
