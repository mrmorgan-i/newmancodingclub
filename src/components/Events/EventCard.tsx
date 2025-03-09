import clsx from "clsx";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";

import { IEvent } from "@/types";

interface Props {
    event: IEvent;
    highlight?: boolean;
}

const EventCard: React.FC<Props> = ({ event, highlight }: Props) => {
    const { title, date, time, location, description, tags, registerLink } = event;

    return (
        <div className={clsx("w-full max-w-sm mx-auto bg-white rounded-xl border border-gray-200 lg:max-w-full", { "shadow-lg": highlight })}>
            <div className="p-6 border-b border-gray-200 rounded-t-xl">
                <h3 className="text-2xl font-semibold mb-2">{title}</h3>
                
                {highlight && (
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 text-xs font-semibold rounded-full mb-3">
                        Next Event
                    </span>
                )}
                
                <div className="flex flex-col space-y-2 mb-4 text-gray-600 text-sm">
                    <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-primary" />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center">
                        <FaClock className="mr-2 text-primary" />
                        <span>{time}</span>
                    </div>
                    <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-primary" />
                        <span>{location}</span>
                    </div>
                </div>
                
                <Link href={registerLink} target="_blank" rel="noopener noreferrer">
                    <button className={clsx("w-full py-3 px-4 rounded-full transition-colors", { 
                        "bg-primary hover:bg-primary-accent text-white": highlight, 
                        "bg-hero-background hover:bg-gray-200 text-foreground": !highlight 
                    })}>
                        {highlight ? "Register Now" : "Learn More"}
                    </button>
                </Link>
            </div>
            <div className="p-6 mt-1">
                <p className="text-foreground-accent mb-4">{description}</p>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span key={tag} className="tag">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default EventCard