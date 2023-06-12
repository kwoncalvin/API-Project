import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { getSingleEvent } from "../../store/events";
import { getSingleGroup } from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import OpenModalButton from "../OpenModalButton/";
import DeleteModal from "../DeleteModal";
import './SingleEventPage.css';

export default function SingleEventPage() {
    const dispatch = useDispatch();
    const params = useParams();
    const eventId = params.eventId;
    const event = useSelector((state) => {
        if (eventId == state.events.singleEvent.id)
            return state.events.singleEvent;
        return {};
    });
    const group = useSelector((state) => {
        if (event.groupId == state.groups.singleGroup.id)
            return state.groups.singleGroup;
        return {};
    });
    const user = useSelector(state => state.session.user);
    useEffect(() => {
        dispatch(getSingleEvent(eventId))
    }, [dispatch]);

    useEffect(() => {
        if (event.groupId) {
            dispatch(getSingleGroup(event.groupId))
        }
    }, [event]);

    if (Object.keys(event).length === 0) return null;
    if (Object.keys(group).length === 0) return null;


    let startDate = event.startDate.split("T");
    startDate = `${startDate[0]} · ${startDate[1].slice(0, -8)}`;
    let endDate = event.endDate.split("T");
    endDate = `${endDate[0]} · ${endDate[1].slice(0, -8)}`;

    if (!group.Organizer) return <h1>Loading...</h1>;
    if (!event.previewImage) return <h1>Loading...</h1>;
    return (
        <>
            <div className="wrapper" id='event-bar'>
                <div>
                    <span>{"< "}</span>
                    <NavLink className="back-to-list" to='/events'>Events</NavLink>
                    <div className="event-title-info">
                        <h1>{event.name}</h1>
                        <h4>Hosted by {group.Organizer.firstName} {group.Organizer.lastName}</h4>
                    </div>
                </div>
            </div>
            <div className="second-half">
                <div className="wrapper" id='event-content'>
                    <div>
                        <div className="event-page">
                            <img id='eventImage' src={
                                event.previewImage ?
                                    event.previewImage :
                                    'https://deviniti.com/app/uploads/2021/10/09-20_DM-8186_EVENTS_01_MAIN-2-1024x682.png'}
                            />
                            <div className="event-side">
                                <div>
                                    <div className="group-section">
                                        <img src={
                                            group.GroupImages.length > 0 ?
                                                group.GroupImages[0].url :
                                                'https://www.nicepng.com/png/detail/359-3593867_big-image-group-of-people-clipart.png'}
                                        />
                                        <div className="group-section-info">
                                            <h3>{group.name}</h3>
                                            <h4>{group.private ? "Private" : "Public"}</h4>
                                        </div>
                                    </div>
                                    <div id='event-details'>
                                        <div className='event-detail-section'>
                                            <i className="fa-regular fa-clock"></i>
                                            <div id='start-end'>
                                                <h4>START </h4>
                                                <h4>END </h4>
                                            </div>
                                            <div id='event-dates'>
                                                <h4>{startDate}</h4>
                                                <h4>{endDate}</h4>
                                            </div>
                                        </div>
                                        <div className="event-detail-section">
                                            <i className="fa-solid fa-dollar-sign"></i>
                                            <h4>{event.price ? event.price : 'FREE'}</h4>
                                        </div>
                                        <div id='delete-row'>
                                            <div className="event-detail-section">
                                                <i class="fa-solid fa-map-pin"></i>
                                                <h4>{event.type}</h4>
                                            </div>
                                            {user && user.id === group.Organizer.id ? (
                                                <div className="detail-button">
                                                    <OpenModalButton
                                                        buttonText="Delete"
                                                        modalComponent={
                                                            <DeleteModal groupId={group.id} eventId={eventId}/>
                                                        }
                                                    ></OpenModalButton>
                                                </div>) : null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="event-desc">
                            <h2>Details</h2>
                            <p>{event.description}</p>
                        </div>
                    </div>
                    {/* <div>
                        {Object.keys(event).map((key) => {

                            return (<div>
                                {key}: {event[key] ? event[key].toString() : 'none'}
                                </div>); })
                                }
                    </div> */}
                </div>
            </div>
        </>
    )
}
