import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { getSingleGroup } from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function CreateEventPage() {
    const dispatch = useDispatch();
    const params = useParams();
    const groupId = params.groupId;
    const group = useSelector((state) => state.groups.singleGroup);

    useEffect(() => {
        dispatch(getSingleGroup(groupId));
    }, [dispatch]);

    return (
        <div>
            <form>
                <div>
                    <h1>
                        Create an event for (group name)
                    </h1>
                    <p>
                        What is the name of your event?
                    </p>
                    <input></input>
                </div>
                <div>
                    <label>Is this an in person or online event?</label>
                    <select></select>
                    <label>Is this event private or public?</label>
                    <select></select>
                    <label>What is the price for your event?</label>
                    <input></input>
                </div>
                <div>
                    <label>When does your event start?</label>
                    <input></input>
                    <label>When does your event end?</label>
                    <input></input>
                </div>
                <div>
                    <label>Please add in image url for your group below:</label>
                    <input></input>
                </div>
                <div>
                    <label>Please describe your event:</label>
                    <textarea></textarea>
                </div>
                <button></button>
            </form>
        </div>
    )
}
