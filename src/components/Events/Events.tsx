import EventCard from "./EventCard";
import { events } from "@/data/events";

const Events: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
                <EventCard 
                    key={event.title} 
                    event={event} 
                    highlight={index === 0} // Highlight the first/next event
                />
            ))}
        </div>
    )
}

export default Events