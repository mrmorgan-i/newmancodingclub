import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { IEvent, IRecurringEvent } from "../src/types";
import {
    getDisplayDate,
    getNextOccurrence,
    hasEventPassed,
    isEventToday,
    sortEventsByDate,
} from "../src/utils/eventUtils";

const casualCoding: IRecurringEvent = {
    id: 1,
    title: "Casual Coding",
    date: "Every Thursday",
    time: "7:00 PM - 8:00 PM",
    location: "Library Learning Commons",
    description: "Weekly coding session.",
    tags: ["Coding"],
    registerLink: "#",
    isFeatured: true,
    isRecurring: true,
    recurrencePattern: "weekly",
    repeatInterval: 2,
    daysOfWeek: [4],
    startDate: "2026-08-27",
    endDate: "2026-12-03",
    timeZone: "America/Chicago",
    isActive: true,
};

const events: IEvent[] = [
    casualCoding,
    {
        id: 2,
        title: "Honors x Coding Club Crossover",
        date: "2025-11-20",
        time: "5:00 PM - 6:30 PM",
        location: "Library CTL",
        description: "AI workshop.",
        tags: ["AI"],
        registerLink: "https://example.com",
        isRecurring: false,
        isActive: true,
    },
    {
        id: 3,
        title: "Guest Speaker Appearance",
        date: "TBD",
        time: "12:00 PM - 1:00 PM",
        location: "BSGC 104",
        description: "Guest speaker.",
        tags: ["Guest Speaker"],
        registerLink: "#",
        isRecurring: false,
        isActive: true,
    },
];

function occurrenceDate(now: string): string | null {
    return getNextOccurrence(casualCoding, new Date(now))?.toISOString().slice(0, 10) ?? null;
}

describe("Casual Coding schedule", () => {
    it("starts on Thursday, August 27, 2026", () => {
        assert.equal(occurrenceDate("2026-08-27T12:00:00.000Z"), "2026-08-27");
        assert.equal(
            getDisplayDate(casualCoding, new Date("2026-08-27T12:00:00.000Z")),
            "Next: Thursday, August 27, 2026",
        );
    });

    it("keeps today's meeting current until it ends in Chicago", () => {
        const duringMeeting = new Date("2026-08-28T00:30:00.000Z");
        const afterMeeting = new Date("2026-08-28T01:30:00.000Z");

        assert.equal(isEventToday(casualCoding, duringMeeting), true);
        assert.equal(occurrenceDate(afterMeeting.toISOString()), "2026-09-10");
        assert.equal(isEventToday(casualCoding, afterMeeting), false);
    });

    it("includes the December 3 final meeting and stops afterward", () => {
        assert.equal(occurrenceDate("2026-12-03T20:00:00.000Z"), "2026-12-03");

        const afterFinalMeeting = new Date("2026-12-04T03:00:00.000Z");
        assert.equal(getNextOccurrence(casualCoding, afterFinalMeeting), null);
        assert.equal(hasEventPassed(casualCoding, afterFinalMeeting), true);
        assert.equal(
            getDisplayDate(casualCoding, afterFinalMeeting),
            "Ended: Thursday, December 3, 2026",
        );
    });

    it("sorts current meetings ahead of past and unscheduled events", () => {
        const sorted = sortEventsByDate(events, new Date("2026-08-27T12:00:00.000Z"));
        assert.equal(sorted[0]?.title, "Casual Coding");
        assert.equal(sorted.at(-1)?.title, "Honors x Coding Club Crossover");
    });

    it("preserves labels for events without a scheduled date", () => {
        const unscheduledEvent = events.find((event) => event.date === "TBD");
        if (!unscheduledEvent) throw new Error("Unscheduled event fixture is missing.");

        assert.equal(getDisplayDate(unscheduledEvent), "TBD");
    });

    it("supports Sunday schedules", () => {
        const sundayEvent: IRecurringEvent = {
            ...casualCoding,
            title: "Sunday meetup",
            date: "Every Sunday",
            repeatInterval: 1,
            daysOfWeek: [0],
            startDate: "2026-08-30",
            endDate: "2026-09-13",
        };

        assert.equal(
            getNextOccurrence(sundayEvent, new Date("2026-08-29T17:00:00.000Z"))
                ?.toISOString()
                .slice(0, 10),
            "2026-08-30",
        );
    });

    it("supports more than one meeting day in an active week", () => {
        const multiDayEvent: IRecurringEvent = {
            ...casualCoding,
            title: "Study group",
            date: "Every Tuesday and Thursday",
            repeatInterval: 1,
            daysOfWeek: [2, 4],
            startDate: "2026-09-01",
            endDate: "2026-09-17",
        };

        assert.equal(
            getNextOccurrence(multiDayEvent, new Date("2026-09-02T17:00:00.000Z"))
                ?.toISOString()
                .slice(0, 10),
            "2026-09-03",
        );
    });

    it("anchors every-three-week schedules to the starting week", () => {
        const everyThreeWeeks: IRecurringEvent = {
            ...casualCoding,
            title: "Project check-in",
            date: "Every 3 weeks on Monday and Thursday",
            repeatInterval: 3,
            daysOfWeek: [1, 4],
            startDate: "2026-08-27",
            endDate: "2026-10-31",
        };

        assert.equal(
            getNextOccurrence(everyThreeWeeks, new Date("2026-08-28T17:00:00.000Z"))
                ?.toISOString()
                .slice(0, 10),
            "2026-09-14",
        );
    });
});
