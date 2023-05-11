import React from "react";
import { NavLink, useParams, useHistory } from "react-router-dom";
import { getSingleGroup } from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function SingleGroupPage() {
    const dispatch = useDispatch();
    const params = useParams();
    const groupId = params.groupId;
    const group = useSelector((state) => state.groups.singleGroup);
    const history = useHistory();
    useEffect(() => {
        dispatch(getSingleGroup(groupId));
    }, [dispatch]);

    return (
        <div>
            {Object.keys(group).map((key) => {

                return (<div>
                    {key}: {group[key] ? group[key].toString() : 'none'}
                    </div>); })
                    }
            <button onClick={() => history.push(`/groups/${groupId}/events/new`)}>
                Create event
            </button>
        </div>
    )
}
