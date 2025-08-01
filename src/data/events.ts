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
        title: "Create your Website Workshop",
        date: "2025-09-02",
        time: "12:00 PM - 1:00 PM",
        location: "BSGC 104",
        description: "Learn how to create a website using Next.js.",
        tags: ["Next.js", "Beginner", "Programming"],
        registerLink: "#",
        isRecurring: false,
        isActive: true
    },
    {
        title: "Guest Speaker Appearance",
        date: "2025-09-23",
        time: "12:00 PM - 1:00 PM",
        location: "BSGC 104",
        description: "Join us for a guest speaker appearance!",
        tags: ["Guest Speaker"],
        registerLink: "#",
        isRecurring: false,
        isActive: true
    },
];
