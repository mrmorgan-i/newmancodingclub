import { IEvent } from "@/types";

export const events: IEvent[] = [
    {
        title: "Intro to Web Development",
        date: "April 15, 2025",
        time: "6:00 PM - 8:00 PM",
        location: "Dugan Library, Room 201",
        description: "Our first event! Join us for a beginner-friendly introduction to HTML, CSS, and JavaScript. No prior experience required.",
        tags: ["Beginner", "HTML", "CSS", "JavaScript"],
        registerLink: "#register"
    },
    {
        title: "Git & GitHub Workshop",
        date: "April 29, 2025",
        time: "6:00 PM - 7:30 PM",
        location: "Eck Hall, Room 125",
        description: "Learn how to collaborate on code with Git and GitHub. Essential skills for every programmer!",
        tags: ["Version Control", "Collaboration", "Git"],
        registerLink: "#register"
    },
    {
        title: "Python Basics",
        date: "May 13, 2025",
        time: "5:30 PM - 7:30 PM",
        location: "Zoom Meeting",
        description: "Dive into Python programming! We'll cover syntax, data types, functions, and create simple programs together.",
        tags: ["Python", "Beginner", "Programming"],
        registerLink: "#register"
    }
];