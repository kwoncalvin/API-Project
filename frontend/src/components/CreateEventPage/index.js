import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { getSingleGroup } from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { postEvent, postEventImage } from "../../store/events";
import './CreateEventPage.css'

export default function CreateEventPage() {
    const dispatch = useDispatch();
    const params = useParams();
    const groupId = params.groupId;
    const group = useSelector((state) => state.groups.singleGroup);
    const history = useHistory()

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(getSingleGroup(groupId));
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let errs = {};
        if (!name) errs.name = "Name is required";
        if (!type) errs.type = "Type is required";
        if (!price) errs.about = "Price is required"
        if (!startDate) errs.startDate = "Event start is required";
        if (!endDate) errs.endDate = "Event end is required";
        if (!(image.endsWith(".png") || image.endsWith(".jpg") || image.endsWith(".jpeg"))) {
            errs.image = "Image URL must end in .png, .jpg, or .jpeg";
        }
        if (!description || description.length < 30) errs.description = "Description must be at least 30 characters long"


        const payload = {
            name,
            type,
            price,
            startDate,
            endDate,
            description,
            venueId: '1',
            capacity: '0'
        };

        const event = await dispatch(postEvent(payload, groupId))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors({...data.errors, ...errs});
                }
            });
        if (event) {
            dispatch(postEventImage(event.id, image, true));
            history.push(`/events/${event.id}`)
        }
    }
    if (!group) return null;
    return (
        <div className="wrapper event-create-size">
            <form onSubmit={handleSubmit}>
                <div className="create-event-section">
                    <h2>
                        Create an event for {group.name}
                    </h2>
                    <p>
                        What is the name of your event?
                    </p>
                    <input
                        placeholder="Event Name"
                        onChange={(e) => setName(e.target.value)}>
                    </input>
                    {errors.name && (
                        <p className="red">{errors.name}</p>
                    )}
                </div>
                <div className="create-event-section">
                    <label>Is this an in person or online event?</label>
                    <select
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value = "" hidden>(select one)</option>
                        <option value = "Online">Online</option>
                        <option value = "In person">In person</option>
                    </select>
                    {errors.type && (
                        <p className="red">{errors.type}</p>
                    )}
                    <label>What is the price for your event?</label>
                    <div id='price-field'>
                        <p>$</p>
                        <input
                            type='number'
                            placeholder="0"
                            onChange={(e) => setPrice(e.target.value)}
                        >
                        </input>
                    </div>
                    {errors.price && (
                        <p className="red">{errors.price}</p>
                    )}
                </div>
                <div className="create-event-section">
                    <label>When does your event start?</label>
                    <input
                        className="time-input"
                        type='datetime-local'
                        onChange={(e) => setStartDate(e.target.value)}
                    ></input>
                    {errors.startDate && (
                        <p className="red">{errors.startDate}</p>
                    )}
                    <label>When does your event end?</label>
                    <input
                        className="time-input"
                        type='datetime-local'
                        onChange={(e) => setEndDate(e.target.value)}
                    ></input>
                    {errors.endDate && (
                        <p className="red">{errors.endDate}</p>
                    )}
                </div>
                <div className="create-event-section">
                    <label>Please add in image url for your group below:</label>
                    <input
                        placeholder="Image URL"
                        onChange={(e) => setImage(e.target.value)}
                    ></input>
                    {errors.image && (
                        <p className="red">{errors.image}</p>
                    )}
                </div>
                <div className="create-event-section" id='no-bottom'>
                    <label>Please describe your event:</label>
                    <textarea
                        placeholder="Please include at least 30 characters"
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    {errors.description && (
                        <p className="red">{errors.description}</p>
                    )}
                </div>
                <button
                    id='create-event-button'
                    type='submit'
                >Create Event</button>
            </form>
        </div>
    )
}
