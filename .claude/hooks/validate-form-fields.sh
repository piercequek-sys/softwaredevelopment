#!/usr/bin/env bash
# PreToolUse hook — guards form field validation in index.html and script.js.
# Blocks Write/Edit tool calls that would remove required field markup or validation logic.
# Validated fields: name (required), email (required + regex), phone/tel (optional, format-aware).

set -euo pipefail

INPUT=$(cat)

TOOL=$(printf '%s' "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_name',''))" 2>/dev/null || echo "")

# Only intercept Write and Edit
if [[ "$TOOL" != "Write" && "$TOOL" != "Edit" ]]; then
  exit 0
fi

TOOL_INPUT=$(printf '%s' "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(json.dumps(d.get('tool_input',{})))" 2>/dev/null || echo "{}")
FILE_PATH=$(printf '%s' "$TOOL_INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('file_path',''))" 2>/dev/null || echo "")

# Only check form-related source files
BASE=$(basename "$FILE_PATH")
if [[ "$BASE" != "index.html" && "$BASE" != "script.js" ]]; then
  exit 0
fi

block() {
  printf '{"decision":"block","reason":"%s"}\n' "$1"
  exit 0
}

# ── Write: check the full proposed content ─────────────────────────────────────
if [[ "$TOOL" == "Write" ]]; then
  CONTENT=$(printf '%s' "$TOOL_INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('content',''))" 2>/dev/null || echo "")

  if [[ "$BASE" == "script.js" ]]; then
    # Email regex must be present
    echo "$CONTENT" | grep -qE '[^\s@]+@[^\s@]+\.[^\s@]+' \
      || block "script.js is missing an email validation regex. The form requires a pattern like /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/."

    # Required-field check must be present
    echo "$CONTENT" | grep -qE 'required|validateField|This field is required' \
      || block "script.js is missing required-field validation. name, email, service, and message are all required fields."

    # Phone field must still be referenced (may be optional but must be collected)
    echo "$CONTENT" | grep -qE "phone|tel" \
      || block "script.js no longer references the phone/tel field. It should at least be collected in the form payload."
  fi

  if [[ "$BASE" == "index.html" ]]; then
    MISSING=()
    echo "$CONTENT" | grep -q 'id="name"'              || MISSING+=("name")
    echo "$CONTENT" | grep -q 'id="email"'             || MISSING+=("email")
    echo "$CONTENT" | grep -qE 'id="phone"|type="tel"' || MISSING+=("phone/tel")

    if [[ ${#MISSING[@]} -gt 0 ]]; then
      MISSING_STR=$(IFS=", "; echo "${MISSING[*]}")
      block "index.html is missing required form field(s): ${MISSING_STR}. The contact form must include name, email, and phone\\/tel inputs."
    fi

    # Required attributes on mandatory fields must be present
    echo "$CONTENT" | grep -q 'required' \
      || block "index.html has no 'required' attributes on form inputs. name, email, service, and message must be marked required."
  fi
fi

# ── Edit: check if the patch removes key validation patterns ───────────────────
if [[ "$TOOL" == "Edit" ]]; then
  OLD=$(printf '%s' "$TOOL_INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('old_string',''))" 2>/dev/null || echo "")
  NEW=$(printf '%s' "$TOOL_INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('new_string',''))" 2>/dev/null || echo "")

  if [[ "$BASE" == "script.js" ]]; then
    # Removing the email regex without a replacement
    if echo "$OLD" | grep -qE '[^\s@]+@[^\s@]+' && ! echo "$NEW" | grep -qE '[^\s@]+@[^\s@]+|validateEmail'; then
      block "This edit removes the email validation regex from script.js without a replacement. Email format checking is required."
    fi

    # Removing validateField / required checks without replacement
    if echo "$OLD" | grep -qE 'validateField|This field is required' && ! echo "$NEW" | grep -qE 'validateField|required'; then
      block "This edit removes required-field validation from script.js. All mandatory form fields must be validated before submission."
    fi

    # Removing phone collection from the payload
    if echo "$OLD" | grep -qE 'phone|tel' && ! echo "$NEW" | grep -qE 'phone|tel'; then
      block "This edit removes all phone\\/tel references from script.js. The phone field must still be collected in the submission payload."
    fi
  fi

  if [[ "$BASE" == "index.html" ]]; then
    for field in 'id="name"' 'id="email"'; do
      if echo "$OLD" | grep -q "$field" && ! echo "$NEW" | grep -q "$field"; then
        block "This edit removes the ${field} field from index.html. The contact form requires name and email inputs."
      fi
    done

    if echo "$OLD" | grep -qE 'id="phone"|type="tel"' && ! echo "$NEW" | grep -qE 'id="phone"|type="tel"'; then
      block "This edit removes the phone\\/tel input from index.html. The contact form must include a phone field."
    fi
  fi
fi

exit 0
