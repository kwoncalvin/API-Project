import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { getSingleEvent } from "../../store/events";
import { getSingleGroup } from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import OpenModalButton from "../OpenModalButton/";
import DeleteModal from "../DeleteModal";

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
    if (!event) return <h1>Loading...</h1>;

    let startDate = event.startDate.split("T");
    startDate = `${startDate[0]} · ${startDate[1].slice(0, -5)}`;
    let endDate = event.endDate.split("T");
    endDate = `${endDate[0]} · ${endDate[1].slice(0, -5)}`;

    if (!group.Organizer) return <h1>Loading...</h1>;
    return (
        <div className="wrapper">
            <div>
                <NavLink to='/events'>{'< Events'}</NavLink>
                <div>
                    <h1>{event.name}</h1>
                    <h3>Hosted by {group.Organizer.firstName} {group.Organizer.lastName}</h3>
                </div>
            </div>
            <div>
                <div>
                    <img src={
                        event.previewImage ?
                            event.previewImage :
                            'https://deviniti.com/app/uploads/2021/10/09-20_DM-8186_EVENTS_01_MAIN-2-1024x682.png'}
                    />
                    <div>
                        <div>
                            <img></img>
                            <div>
                                <div>{group.name}</div>
                                <div>{group.private ? "Private" : "Public"}</div>
                            </div>
                            <div>
                                <div>
                                    <i className="fa-regular fa-clock"></i>
                                    <div>
                                        <div>
                                            <span>START</span>
                                            <span>{startDate}</span>
                                        </div>
                                        <div>
                                            <span>END</span>
                                            <span>{endDate}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <i className="fa-solid fa-dollar-sign"></i>
                                    <div>{event.price ? event.price : 'FREE'}</div>
                                </div>
                                <div>
                                    <div>
                                        <i class="fa-solid fa-map-pin"></i>
                                        <div>{event.type}</div>
                                    </div>
                                    {user && user.id === group.Organizer.id ? (
                                        <OpenModalButton
                                            buttonText="Delete"
                                            modalComponent={
                                                <DeleteModal groupId={group.id} eventId={eventId}/>
                                            }
                                        ></OpenModalButton>) : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h2>Details</h2>
                    <p>{event.description}</p>
                </div>
            </div>
            <div>
                {Object.keys(event).map((key) => {

                    return (<div>
                        {key}: {event[key] ? event[key].toString() : 'none'}
                        </div>); })
                        }
            </div>
        </div>
    )
}
