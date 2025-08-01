import clsx from "clsx";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";

import { IEvent } from "@/types";
import { getDisplayDate, getEventStatus, hasEventPassed } from "@/utils/eventUtils";

interface Props {
    event: IEvent;
    highlight?: boolean;
}

const EventCard: React.FC<Props> = ({ event, highlight }: Props) => {
    const { title, time, location, description, tags, registerLink, isRecurring } = event;
    
    const displayDate = getDisplayDate(event);
    const eventStatus = getEventStatus(event);
    const eventIsToday = eventStatus === 'today';
    const eventHasPassed = hasEventPassed(event);
    
    const isFlagshipEvent = isRecurring && title === "Casual Coding";
    const cardClasses = clsx(
        "w-full max-w-sm mx-auto rounded-xl border lg:max-w-full transition-all duration-200",
        {
            "shadow-lg": highlight,
            "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-md": isFlagshipEvent,
            "bg-white border-gray-200": !isFlagshipEvent
        }
    );

    return (
        <div className={cardClasses}>
            <div className={clsx(
                "p-6 border-b rounded-t-xl",
                isFlagshipEvent ? "border-blue-200" : "border-gray-200"
            )}>
                <div className="flex items-center justify-between mb-2">
                    <h3 className={clsx(
                        "text-2xl font-semibold",
                        isFlagshipEvent ? "text-blue-900" : "text-gray-900"
                    )}>{title}</h3>
                    {isFlagshipEvent && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            ⭐ Every Tuesday
                        </span>
                    )}
                </div>
                
                {highlight && !isRecurring && (
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 text-xs font-semibold rounded-full mb-3">
                        {eventIsToday ? "Today!" : "Next Event"}
                    </span>
                )}
                {eventIsToday && isRecurring && (
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 text-xs font-semibold rounded-full mb-3">
                        Today!
                    </span>
                )}
                {eventHasPassed && !isRecurring && (
                    <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 text-xs font-semibold rounded-full mb-3">
                        Past Event
                    </span>
                )}
                
                <div className="flex flex-col space-y-2 mb-4 text-gray-600 text-sm">
                    <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-primary" />
                        <span>{displayDate}</span>
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
                
                {isRecurring ? (
                    <div className="w-full py-3 px-4 rounded-full text-center font-medium bg-blue-100 text-blue-800">
                        No registration needed!
                    </div>
                ) : (
                    eventHasPassed ? (
                        <div className="w-full py-3 px-4 rounded-full bg-gray-100 text-gray-500 text-center cursor-default">
                            Event Completed
                        </div>
                    ) : highlight ? (
                        <Link href={registerLink} target="_blank" rel="noopener noreferrer">
                            <button className="w-full py-3 px-4 rounded-full transition-colors bg-primary hover:bg-primary-accent text-white">
                                {eventIsToday ? "Register Today!" : "Register Now"}
                            </button>
                        </Link>
                    ) : (
                        <div className="w-full py-3 px-4 rounded-full bg-gray-100 text-gray-500 text-center cursor-default">
                            Coming Soon
                        </div>
                    )
                )}
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