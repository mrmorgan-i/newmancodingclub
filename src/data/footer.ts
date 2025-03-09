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
            text: "Leadership",
            url: "#leadership"
        },
        {
            text: "FAQ",
            url: "#faq"
        }
    ],
    email: 'newmancodingclub@gmail.com',
    telephone: '',
    socials: {
        github: 'https://github.com/newmancodingclub',
        discord: 'https://discord.gg/b8whUeKn',
        instagram: 'https://www.instagram.com/newmancodingclub/',
        x: 'https://x.com/nucodingclub',
    }
}