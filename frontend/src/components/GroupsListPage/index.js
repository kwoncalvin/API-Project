import React from "react";
import "./GroupsListPage.css";
import { NavLink } from "react-router-dom";
import { getGroups } from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function GroupsListPage() {
    const dispatch = useDispatch();
    const groups = useSelector((state) => state.groups);

    useEffect(() => {
        dispatch(getGroups());
    }, [dispatch]);

    return (
        <div>
            <div id="bar">
                <div>
                    <h2>Events</h2>
                    <h2>Groups</h2>
                </div>
                <h3>Groups in Meetup</h3>
            </div>
            <div>
                <ul>
                    {Object.values(groups.allGroups).map((group) => {
                        return <h2>{group.name}</h2>
                    })}
                </ul>
            </div>
        </div>
    )
}
