import React from "react";
import "./EventsListPage.css";
import { NavLink } from "react-router-dom";
import { getEvents } from "../../store/events";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function EventsListPage() {
    const dispatch = useDispatch();
    const events = useSelector((state) => state.events);

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);

    return (
        <div>
            <div id="bar">
                <div>
                    <h2>Events</h2>
                    <h2>Groups</h2>
                </div>
                <h3>Events in Meetup</h3>
            </div>
            <div>
                <ul>
                    {Object.values(events.allEvents).map((event) => {
                        return <h2>{event.name}</h2>
                    })}
                </ul>
            </div>
        </div>
    )
}
