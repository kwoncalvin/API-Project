import React from "react";
import { NavLink, useParams, useHistory } from "react-router-dom";
import { getSingleGroup } from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import OpenModalButton from "../OpenModalButton/";
import DeleteModal from "../DeleteModal";
import JoinGroupModal from "../JoinGroupModal";
import "./SingleGroupPage.css"
import EventPreview from "../EventPreview";
import { getEvents } from "../../store/events";

export default function SingleGroupPage() {
    const dispatch = useDispatch();
    const params = useParams();
    const groupId = params.groupId;
    const history = useHistory();
    let allEvents = useSelector((state) => state.events.allEvents)
    let events = Object.values(allEvents).filter((event) => {
        return event.groupId == groupId;
    });
    let pastEvents = [];
    let upcomingEvents = [];
    const getTimeEvents = (events) => {
        pastEvents = [];
        upcomingEvents = [];
        for (let event of events) {
            const current = new Date();
            let eventDate = new Date(event.startDate);
            if (current > eventDate) {
                pastEvents.push(event);
            } else {
                upcomingEvents.push(event);
            }
        }
        let futureSorter = (a, b) => Date.parse(a.startDate) - Date.parse(b.startDate);
        let pastSorter = (a, b) => Date.parse(b.startDate) - Date.parse(a.startDate);
        pastEvents.sort(pastSorter);
        upcomingEvents.sort(futureSorter);
    }

    getTimeEvents(events);

    useEffect(() => {
        async function upEvents() {
            allEvents = dispatch(getEvents());
            events = Object.values(allEvents).filter((event) => {
                return event.groupId == groupId;
            });
            getTimeEvents(events)
        }
        upEvents();
        dispatch(getSingleGroup(groupId));
    }, [dispatch]);

    const group = useSelector((state) => {
        if (groupId == state.groups.singleGroup.id)
            return state.groups.singleGroup;
        return {};
    });
    const user = useSelector((state) => state.session.user)

    if (Object.keys(group).length === 0) return <h1>Loading...</h1>;
    if (!group.Organizer) return <h1>Loading...</h1>;
    else return (
        <>
            <div className="wrapper" id="top-half-group">
                <span>{'< '}</span>
                <NavLink className='back-to-list' to='/groups'>Groups</NavLink>
                <div
                    className="group-page"
                >
                    <img id='groupImage' src={
                            group.GroupImages.length > 0 ?
                                group.GroupImages[0].url :
                                'https://www.nicepng.com/png/detail/359-3593867_big-image-group-of-people-clipart.png'}
                    />
                    <div className="group-info">
                        <div className="group-desc">
                            <h2>{group.name}</h2>
                            <h4>{group.city}, {group.state}</h4>
                            <h4>{events.length} event{events.length === 1 ? "" : "s"} · {group.private ? "Private" : "Public"}</h4>
                            <h4>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</h4>
                        </div>
                        {user && user.id === group.Organizer.id ? (
                            <div className="group-button">
                                <button
                                    className="detail-button"
                                    onClick={() => history.push(`/groups/${groupId}/events/new`)}
                                >
                                    Create Event
                                </button>
                                <button
                                    className="detail-button"
                                    onClick={() => history.push(`/groups/${groupId}/edit`)}
                                >
                                    Update
                                </button>
                                <div className="detail-button">
                                    <OpenModalButton
                                        buttonText="Delete"
                                        modalComponent={
                                            <DeleteModal groupId={groupId} />
                                        }
                                    ></OpenModalButton>
                                </div>
                            </div>
                        ) : user ? (
                            <div className="join-group-button">
                                <OpenModalButton
                                    buttonText="Join this group"
                                    modalComponent={
                                        <JoinGroupModal/>
                                    }
                                ></OpenModalButton>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
            <div className="second-half">
                <div className="wrapper" id='bottom-half-group'>
                    <div>
                        <div>
                            <h2>Organizer</h2>
                            <h4>{group.Organizer.firstName} {group.Organizer.lastName}</h4>
                        </div>
                        <div>
                            <h2>What we're about</h2>
                            <p>{group.about}</p>
                        </div>
                    </div>
                    <div>
                        {events.length ? null : (<h2>No upcoming events!</h2>)}
                        {upcomingEvents.length? (
                            <>
                                <h2>Upcoming Events ({upcomingEvents.length})</h2>
                                {upcomingEvents.map((event) => {
                                    return (<div className="group-event">
                                                <EventPreview fromGroup={true} event={event}/>
                                            </div>)
                                })}
                            </>) : null}
                        {upcomingEvents.length? (
                            <>
                                <h2>Past Events ({pastEvents.length})</h2>
                                {pastEvents.map((event) => {
                                    return (<div className="group-event">
                                                <EventPreview fromGroup={true} event={event}/>
                                            </div>)
                                })}
                            </>) : null}
                    </div>
                    {/* {events.length === 0 ?} */}
                    {/* <div>
                        <h2>Upcoming Events {events.length}</h2>
                        {Object.values(events).map((event) => {
                                    return <EventPreview event={event}/>
                                })}
                    </div>
                    {Object.keys(group).map((key) => {
                        if (key == "Organizer") {
                            let organizer = group[key]
                            console.log(group.Organizer.firstName);
                            Object.keys(organizer).map((key) => {
                                return (<div>
                                    {key}: {organizer[key] ? organizer[key].toString() : 'none'}
                                    </div>)
                            })
                        }
                        return (<div>
                            {key}: {group[key] ? group[key].toString() : 'none'}
                            </div>); })
                            } */}

                </div>
            </div>
        </>


    )
}
