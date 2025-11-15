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
            text: "Events",
            url: "#events"
        },
        {
            text: "Leadership",
            url: "#leadership"
        },
        {
            text: "Interactives",
            url: "/interactives"
        },
        {
            text: "Resources",
            url: "/resources"
        }
    ],
    email: 'newmancodingclub@gmail.com',
    telephone: '',
    socials: {
        github: 'https://github.com/newmancodingclub',
        groupme: 'https://groupme.com/join_group/106407244/ylKLTabX',
        instagram: 'https://www.instagram.com/newmancodingclub/',
        slack: "https://join.slack.com/t/newman-coding-club/shared_invite/zt-32f7dfd3r-~ZoHuzue5NsycAC1Ll1B_Q",
        discord: 'https://discord.gg/b8whUeKn',
        x: 'https://x.com/nucodingclub',
    }
}