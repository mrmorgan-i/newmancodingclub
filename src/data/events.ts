import { IEvent } from "@/types";

export const events: IEvent[] = [
    {
        title: "Casual Coding",
        date: "Every Tuesday",
        time: "7:00 PM - 8:00 PM",
        location: "Library Learning Commons",
        description: "Casual coding session where members can work on their own projects or learn new skills.",
        tags: ["Coding", "Social", "Collaboration", "Projects"],
        registerLink: "#",
        isRecurring: true,
        recurrencePattern: "weekly",
        dayOfWeek: 2,
        startDate: "2025-08-26",
        isActive: true
    },
    {
        title: "Honors x Coding Club Crossover",
        date: "2025-11-20",
        time: "5:00 PM - 6:30 PM",
        location: "Library CTL",
        description: "Learn how to leverage the latest AI technologies.",
        tags: ["AI", "Prompting", "Hacks"],
        registerLink: "https://forms.office.com/r/F0Xmpnav3A",
        isRecurring: false,
        isActive: true
    },
    {
        title: "Guest Speaker Appearance",
        date: "TBD",
        time: "12:00 PM - 1:00 PM",
        location: "BSGC 104",
        description: "Join us for a guest speaker appearance!",
        tags: ["Guest Speaker"],
        registerLink: "#",
        isRecurring: false,
        isActive: true
    },
];
