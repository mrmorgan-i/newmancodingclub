import EventCard from "./EventCard";
import { getPublishedEvents } from "@/modules/events/queries";
import { sortEventsByDate, getNextHighlightEvent } from "@/utils/eventUtils";

const Events = async () => {
    const events = await getPublishedEvents();
    const now = new Date();
    const sortedEvents = sortEventsByDate(events, now);
    const nextHighlightEvent = getNextHighlightEvent(events, now);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedEvents.map((event) => (
                <EventCard 
                    key={event.id ?? `${event.title}-${event.isRecurring ? 'recurring' : event.date}`}
                    event={event}
                    now={now}
                    highlight={
                        !event.isRecurring &&
                        (event.id
                            ? nextHighlightEvent?.id === event.id
                            : nextHighlightEvent?.title === event.title)
                    }
                />
            ))}
        </div>
    )
}

export default Events
