import React from "react";
import "./ListPage.css";
import { NavLink } from "react-router-dom";
import { getGroups } from "../../store/groups";
import { getEvents } from "../../store/events";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import GroupPreview from "../GroupPreview";
import EventPreview from "../EventPreview";

export default function ListPage({type}) {
    const dispatch = useDispatch();
    const groups = useSelector((state) => state.groups.allGroups);
    const events = useSelector((state) => state.events.allEvents)

    useEffect(() => {
        dispatch(getGroups());
        dispatch(getEvents());
    }, [dispatch]);

    return (
        <div className="wrapper list-size">
            <div className="list-head">
                <div id='links'>
                    <NavLink to='/events' className={type === 'event' ? "current-list" : "other-list"}>Events</NavLink>
                    <NavLink to='/groups' className={type === 'group' ? "current-list" : "other-list"}>Groups</NavLink>
                </div>
                <h3>{type === 'group' ? 'Groups' : 'Events'} in Meetup</h3>
            </div>
            <div>
                <ul id='elem-list'>
                    {type === 'group' ?
                        Object.values(groups).map((group) => {
                            return (<GroupPreview
                                key={group.id}
                                group={group}
                                numEvents={
                                    Object.values(events).filter((event) =>
                                        event.groupId === group.id
                                    ).length
                                }
                            />)
                        })
                        : Object.values(events).map((event) => {
                            return <EventPreview
                                event={event}/>
                        })
                    }
                </ul>
            </div>
        </div>
    )
}
