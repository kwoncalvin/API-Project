import { useHistory } from "react-router-dom";
import "./EventPreview.css"

export default function EventPreview({event, fromGroup}) {
    const history = useHistory();

    let date = event.startDate.split("T");
    date = `${date[0]} · ${date[1].slice(0, -8)}`;

    if (!event.Venue) return <h1>Loading...</h1>;
    return (
        <div
            className={fromGroup ? "group-event-prev-wrap" : "event-prev-wrap"}
            onClick={() => history.push(`/events/${event.id}`)}
        >
            <div className={fromGroup ? "group-event-preview" : "eventPreview"}>
                <img src={
                        event.previewImage ?
                            event.previewImage :
                            'https://deviniti.com/app/uploads/2021/10/09-20_DM-8186_EVENTS_01_MAIN-2-1024x682.png'}/>
                <div className="prev-content">
                    <h4>{date}</h4>
                    <h2>{event.name}</h2>
                    <h4>{event.Venue.city}, {event.Venue.state}</h4>
                </div>
            </div>
            <p className="event-desc">{event.description.length > 450 ? event.description.slice(0, 450) + '...' : event.description}</p>
        </div>
    )
}
