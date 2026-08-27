import React from 'react';

export interface IMenuItem {
    text: string;
    url: string;
}

export interface IBenefit {
    title: string;
    description: string;
    imageSrc: string;
    bullets: IBenefitBullet[]
}

export interface IProject {
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

export interface IAdvisor {
    name: string;
    role: string;
    bio: string;
    avatar: string;
    contact: string;
}

export interface IBenefitBullet {
    title: string;
    description: string;
    icon: React.ReactElement;
}

export interface IFAQ {
    question: string;
    answer: string;
}

export interface IStats {
    title: string;
    icon: React.ReactElement;
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

interface IEventBase {
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    tags: string[];
    registerLink: string;
    timeZone?: string;
    isActive?: boolean;
}

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface IRecurringEvent extends IEventBase {
    isRecurring: true;
    recurrencePattern: 'weekly';
    dayOfWeek: Weekday;
    startDate: string;
    endDate: string;
    timeZone: string;
}

export interface ISingleEvent extends IEventBase {
    isRecurring: false;
}

export type IEvent = IRecurringEvent | ISingleEvent;
