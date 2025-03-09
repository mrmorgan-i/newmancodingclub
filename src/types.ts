export interface IMenuItem {
    text: string;
    url: string;
}

export interface IBenefit {
    title: string;
    description: string;
    imageSrc: string;
    bullets: IBenefitBullet[]
}export interface IProject {
    title: string;
    description: string;
    image: string;
    tags: string[];
    demoLink?: string;
    codeLink?: string;
    creator: {
        name: string;
        role: string;
        avatar: string;
    };
}

export interface ILeader {
    name: string;
    role: string;
    bio: string;
    avatar: string;
    contact: string;
}

export interface IBenefitBullet {
    title: string;
    description: string;
    icon: JSX.Element;
}

export interface IPricing {
    name: string;
    price: number | string;
    features: string[];
}

export interface IFAQ {
    question: string;
    answer: string;
}

export interface ITestimonial {
    name: string;
    role: string;
    message: string;
    avatar: string;
}

export interface IStats {
    title: string;
    icon: JSX.Element;
    description: string;
}

export interface ISocials {
    facebook?: string;
    github?: string;
    instagram?: string;
    linkedin?: string;
    threads?: string;
    twitter?: string;
    youtube?: string;
    x?: string;
    [key: string]: string | undefined;
}

export interface IEvent {
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    tags: string[];
    registerLink: string;
}