import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { getSingleEvent } from "../../store/events";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function SingleEventPage() {
    const dispatch = useDispatch();
    const params = useParams();
    const eventId = params.eventId;
    const event = useSelector((state) => state.events.singleEvent);

    useEffect(() => {
        dispatch(getSingleEvent(eventId));
    }, [dispatch]);

    return (
        <div>
            {Object.keys(event).map((key) => {

                return (<div>
                    {key}: {event[key] ? event[key].toString() : 'none'}
                    </div>); })
                    }
        </div>
    )
}
