import { IProject } from "@/types";

export const projects: IProject[] = [
    {
        title: "Weather Dashboard",
        description: "A web app that displays current weather and 5-day forecast for any city using the OpenWeather API.",
        image: "/images/testimonial-1.webp",
        tags: ["JavaScript", "API", "Bootstrap"],
        demoLink: "#demo",
        codeLink: "#code",
        creator: {
            name: "Ethan Johnson",
            role: "Computer Science Major",
            avatar: "/images/testimonial-1.webp"
        }
    },
    {
        title: "Study Buddy",
        description: "A mobile app that helps students organize study sessions and connect with classmates.",
        image: "/images/testimonial-2.webp",
        tags: ["React Native", "Firebase", "Mobile"],
        demoLink: "#demo",
        codeLink: "#code",
        creator: {
            name: "Sophia Martinez",
            role: "Data Science Major",
            avatar: "/images/testimonial-2.webp"
        }
    },
    {
        title: "Newman Quiz Game",
        description: "A fun web game featuring trivia about Newman University history and campus life.",
        image: "/images/testimonial-3.webp",
        tags: ["HTML", "CSS", "JavaScript"],
        demoLink: "#demo",
        codeLink: "#code",
        creator: {
            name: "Alex Williams",
            role: "Information Technology Major",
            avatar: "/images/testimonial-3.webp"
        }
    }
];