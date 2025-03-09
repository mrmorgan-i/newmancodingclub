import { IMenuItem, ISocials } from "@/types";

export const footerDetails: {
    subheading: string;
    quickLinks: IMenuItem[];
    email: string;
    telephone: string;
    socials: ISocials;
} = {
    subheading: "Fostering interest in computer programming and software development among Newman University students.",
    quickLinks: [
        {
            text: "About",
            url: "#features"
        },
        {
            text: "Events",
            url: "#events"
        },
        {
            text: "Projects",
            url: "#projects"
        },
        {
            text: "FAQ",
            url: "#faq"
        }
    ],
    email: 'coding.club@newmanu.edu',
    telephone: '',
    socials: {
        github: 'https://github.com/newman-coding-club',
        discord: 'https://discord.gg/example',
        instagram: 'https://www.instagram.com'
    }
}