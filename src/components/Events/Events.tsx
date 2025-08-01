import EventCard from "./EventCard";
import { events } from "@/data/events";
import { sortEventsByDate, getNextHighlightEvent } from "@/utils/eventUtils";

const Events: React.FC = () => {
    const sortedEvents = sortEventsByDate(events);
    const nextHighlightEvent = getNextHighlightEvent(events);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedEvents.map((event) => (
                <EventCard 
                    key={`${event.title}-${event.isRecurring ? 'recurring' : event.date}`}
                    event={event} 
                    highlight={nextHighlightEvent?.title === event.title && !event.isRecurring}
                />
            ))}
        </div>
    )
}

export default Events