---
name: whats-due
description: Check Canvas for what's due. Use when someone asks what's due, what homework they have, what's coming up this week, or wants a morning rundown of their assignments.
version: 2.0.0
author: Newman Coding Club
license: MIT
platforms: [linux, macos, windows]
required_environment_variables:
  - name: CANVAS_CALENDAR_URL
    prompt: Canvas calendar feed link
    help: In Canvas go to Calendar, then Calendar Feed, and copy the link
    required_for: reading your assignments
metadata:
  hermes:
    tags: [Canvas, School, Assignments]
---

# What's due

Reads your Canvas calendar feed and says what's coming up. The feed is read-only, so nothing here can submit, edit or delete anything.

## When to use

Someone asks what's due, what homework they have, what's coming up, or wants a rundown of their week.

## Procedure

The script is [scripts/whats_due.py](scripts/whats_due.py). Run this and send back what it prints:

```bash
python ${HERMES_SKILL_DIR}/scripts/whats_due.py
```

Add `--days 1` for today and tomorrow, or `--days 14` to look further out.

If they asked something narrower, like one class or one day, answer only that from the output.

## Pitfalls

- The output is the whole truth. Do not add assignments that aren't in it.
- Dates are already local. Do not convert them.
- The feed doesn't say what has been turned in. Never say something is finished or still outstanding. Say it's due.
- Never ask for the calendar link in chat. If it's missing, tell them to run this in a terminal, then restart the gateway: `hermes config set CANVAS_CALENDAR_URL their_link`

## Verification

The output starts with "Due in the next" or "Nothing on your Canvas calendar". Anything else is an error message written for the person, so pass it along.
