import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { getSingleGroup } from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function SingleGroupPage() {
    const dispatch = useDispatch();
    const params = useParams();
    const groupId = params.groupId;
    const group = useSelector((state) => state.groups.singleGroup);

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
        </div>
    )
}
