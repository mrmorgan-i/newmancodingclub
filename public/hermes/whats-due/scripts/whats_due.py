#!/usr/bin/env python3
import argparse
import datetime as dt
import os
import re
import ssl
import sys
import urllib.error
import urllib.request

SETUP = "Copy your link from Canvas (Calendar, then Calendar Feed). Then in a terminal, not in chat, run: hermes config set CANVAS_CALENDAR_URL your_link_here"


def stop(message):
    print(message)
    sys.exit(1)


def ssl_context():
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        return ssl.create_default_context()


def fetch_feed(url):
    request = urllib.request.Request(url, headers={"User-Agent": "whats-due"})
    try:
        with urllib.request.urlopen(request, timeout=30, context=ssl_context()) as response:
            return response.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as error:
        stop(f"Canvas didn't recognize that calendar link ({error.code}). {SETUP}")
    except urllib.error.URLError as error:
        stop(f"Couldn't reach Canvas. Check your internet. ({error.reason})")


def unescape(text):
    return re.sub(r"\\([,;\\])", r"\1", re.sub(r"\\[nN]", " ", text)).strip()


def parse_events(feed):
    unfolded = re.sub(r"\r?\n[ \t]", "", feed)
    events = []
    for block in unfolded.split("BEGIN:VEVENT")[1:]:
        start = re.search(r"^DTSTART[^:\r\n]*:(\d{8})(?:T(\d{6})(Z?))?", block, re.MULTILINE)
        summary = re.search(r"^SUMMARY[^:\r\n]*:(.*)$", block, re.MULTILINE)
        if not start or not summary:
            continue
        day, clock_time, is_utc = start.groups()
        when = None
        if clock_time:
            moment = dt.datetime.strptime(day + clock_time, "%Y%m%d%H%M%S")
            when = moment.replace(tzinfo=dt.timezone.utc).astimezone() if is_utc else moment.astimezone()
            on_day = when.date()
        else:
            on_day = dt.datetime.strptime(day, "%Y%m%d").date()
        events.append((on_day, when, split_title(unescape(summary.group(1)))))
    return events


def split_title(summary):
    match = re.match(r"(.*)\[(.+)\]\s*$", summary)
    if not match:
        return summary
    title, course = match.group(1).strip(), match.group(2)
    code = re.match(r"\d{4}[A-Z]{2}-(.+)-[A-Z0-9]+$", course)
    return f"{code.group(1) if code else course}: {title}"


def clock(moment):
    hour = moment.hour % 12 or 12
    return f"{hour}:{moment.minute:02d} {'AM' if moment.hour < 12 else 'PM'}"


def day_label(day, today):
    named = f"{day.strftime('%a %b')} {day.day}"
    if day == today:
        return f"Today ({named})"
    if day == today + dt.timedelta(days=1):
        return f"Tomorrow ({named})"
    return named


def build_report(events, today, days):
    last_day = today + dt.timedelta(days=days)
    upcoming = [event for event in events if today <= event[0] <= last_day]
    span = "day" if days == 1 else f"{days} days"
    if not upcoming:
        return f"Nothing on your Canvas calendar in the next {span}."
    upcoming.sort(key=lambda event: (event[0], event[1] is None, event[1] or dt.datetime.min.replace(tzinfo=dt.timezone.utc), event[2]))
    lines = [f"Due in the next {span}:"]
    current = None
    for on_day, when, title in upcoming:
        if on_day != current:
            current = on_day
            lines.append("")
            lines.append(day_label(on_day, today))
        lines.append(f"  {clock(when)}  {title}" if when else f"  {title}")
    lines.append("")
    lines.append("Canvas's calendar doesn't know what you've turned in, so some of these may be done.")
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="What's due, from your Canvas calendar feed. Read-only.")
    parser.add_argument("--days", type=int, default=7, help="how many days ahead to look, default 7")
    args = parser.parse_args()

    url = os.environ.get("CANVAS_CALENDAR_URL", "").strip()
    if not url:
        stop(f"No Canvas calendar link yet. {SETUP}")
    if url.startswith("webcal://"):
        url = "https://" + url[len("webcal://"):]
    if "/feeds/calendars/" not in url:
        stop(f"That doesn't look like a Canvas calendar link. {SETUP}")

    today = dt.datetime.now().astimezone().date()
    print(build_report(parse_events(fetch_feed(url)), today, args.days))


if __name__ == "__main__":
    main()
