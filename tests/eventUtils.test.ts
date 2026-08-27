import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { events } from "../src/data/events";
import type { IRecurringEvent } from "../src/types";
import {
    getDisplayDate,
    getNextOccurrence,
    hasEventPassed,
    isEventToday,
    sortEventsByDate,
} from "../src/utils/eventUtils";

const casualCodingEvent = events.find(
    (event): event is IRecurringEvent =>
        event.isRecurring && event.title === "Casual Coding",
);

if (!casualCodingEvent) {
    throw new Error("Casual Coding test fixture is missing.");
}

const casualCoding: IRecurringEvent = casualCodingEvent;

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
        assert.equal(occurrenceDate(afterMeeting.toISOString()), "2026-09-03");
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
            dayOfWeek: 0,
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
});
