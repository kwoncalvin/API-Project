import { useHistory } from "react-router-dom";

export default function EventPreview({event}) {
    const history = useHistory();


    return (
        <div onClick={() => history.push(`/events/${event.id}`)}>{event.name}</div>
    )
}
