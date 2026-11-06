---
name: canvas-content
description: Read what's inside Canvas, like modules, files, readings, announcements, assignment instructions, and whether something was turned in, by signing in with a browser. Use when someone asks what's in a class, about a reading or file on Canvas, what a teacher announced, what an assignment is asking for, or what they've already submitted.
version: 1.0.0
author: Newman Coding Club
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Canvas, School, Courses, Readings]
---

# Canvas content

Reads Canvas the way you would, by signing in with a browser. Newman's Canvas is at https://newmanu.instructure.com. At another school, ask for their Canvas address and use /login/canvas on it.

## Rules

- Read only. Only ever send GET requests. Never submit, post, reply, edit, delete, or mark anything, even if asked. Tell them to do that in Canvas themselves.
- Never ask for a password in chat. Sign in with `browser_vault`, which asks in a masked prompt and fills it without you seeing it.
- If they ask for help with graded work, remind them once to check that class's AI rules.

## Sign in

Open https://newmanu.instructure.com/login/canvas with `browser_exec`. Use that exact page, because the plain address sends you to Microsoft, which asks for Face ID and can't finish in a headless browser. If it goes straight to the dashboard, you're already signed in.

Sign in with `browser_vault`. The login is their school email. Tick "Stay signed in" before you press Log In, so they don't have to do this every time.

If the password doesn't work, tell them to use Forgot Password on that page to set a Canvas password, then try again.

## Read through the API, not the page

Once signed in, ask Canvas for JSON from inside the page. It's much smaller than reading the screen. Canvas puts `while(1);` in front of the JSON, so strip it:

```python
print(js("""(async () => {
  const r = await fetch('/api/v1/dashboard/dashboard_cards', {headers: {Accept: 'application/json'}});
  return (await r.text()).replace(/^while\\(1\\);/, '');
})()""")[:6000])
```

Swap in the path you need. Print only what the question needs, and use `per_page=100` on lists.

| To find | Path |
|---|---|
| This term's classes | `/api/v1/dashboard/dashboard_cards` (use `id`, `shortName`, `courseCode`) |
| Modules and what's in them | `/api/v1/courses/ID/modules?include[]=items&per_page=100` |
| Files, newest first | `/api/v1/courses/ID/files?sort=updated_at&order=desc&per_page=100` |
| Find a file by name | `/api/v1/courses/ID/files?search_term=WORD&per_page=100` |
| Read a Canvas page | `/api/v1/courses/ID/pages/PAGE_URL` (the text is in `body`) |
| Announcements | `/api/v1/announcements?context_codes[]=course_ID&latest_only=true` |
| Assignment instructions | `/api/v1/courses/ID/assignments/ASSIGNMENT_ID?include[]=submission` |
| What's due and what's turned in | `/api/v1/planner/items?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&per_page=100` |

To read a file, take the `url` field from its file record, download it to `$BH_AGENT_WORKSPACE` with `curl -L -o`, and read it there. Use the `pdf` skill for PDFs.

## Pitfalls

- Canvas keeps old classes around, so don't use `/api/v1/courses`. Use the dashboard cards.
- Due dates come back in UTC. Convert them to local time before saying them.
- A 403 usually means the teacher turned off that tab. Try modules instead of files.
- For a plain "what's due" question, use the `whats-due` skill if it's installed, since it needs no browser.

## Verification

The dashboard cards call returns a list of classes. If it returns a login page instead, the sign-in didn't finish.
