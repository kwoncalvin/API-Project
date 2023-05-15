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
        <div className="wrapper">
            <div className="list-head">
                <div id='links'>
                    <NavLink to='/events'>Events</NavLink>
                    <NavLink to='/groups'>Groups</NavLink>
                </div>
                <h3>Groups in Meetup</h3>
            </div>
            <div>
                <ul>
                    {type === 'group' ?
                        Object.values(groups).map((group) => {
                            return (<GroupPreview
                                className='display-wrapper'
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
                                className='display-wrapper'
                                event={event}/>
                        })
                    }
                </ul>
            </div>
        </div>
    )
}
