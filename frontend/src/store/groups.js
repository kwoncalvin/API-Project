import { csrfFetch } from "./csrf";

const GET_GROUPS = "groups/getGroups";
const GET_SINGLE_GROUP = "groups/getSingleGroup";
const POST_GROUP = "groups/postGroup"
const PUT_GROUP = "groups/putGroup"
const DELETE_GROUP = "groups/deleteGroup"
const POST_GROUP_IMAGE = "groups/postGroupImage"

const loadGroups = (groups) => {
  return {
    type: GET_GROUPS,
    groups
  };
};

const loadSingleGroup = (group) => {
  return {
    type: GET_SINGLE_GROUP,
    group
  };
};

const createGroup = (group) => {
    return {
        type: POST_GROUP,
        group
    }
}

const editGroup = (group) => {
    return {
        type: PUT_GROUP,
        group
    }
}

const removeGroup = (groupId) => {
    return {
        type: DELETE_GROUP,
        groupId
    }
}

const createGroupImage = (groupId, image) => {
    return {
        type: POST_GROUP_IMAGE,
        groupId,
        image
    }
}



export const getGroups = () => async (dispatch) => {
    const res = await fetch("/api/groups");
    if (res.ok) {
        const data = await res.json();
        const groups = data.Groups;
        dispatch(loadGroups(groups));
    }
};

export const getSingleGroup = (groupId) => async (dispatch) => {
    const res = await fetch(`/api/groups/${groupId}`);
    if (res.ok) {
        const group = await res.json();
        dispatch(loadSingleGroup(group));
    }
}

export const postGroup = (group) => async (dispatch) => {
    const res = await csrfFetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(group),
    });

    if (res.ok) {
        const group = await res.json();
        dispatch(createGroup(group));
        return group;
    }
}

export const putGroup = (group, groupId) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(group),
    });

    if (res.ok) {
        const group = await res.json();
        dispatch(editGroup(group));
        return group;
    }
}

export const deleteGroup = (groupId) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        method: "DELETE"
    })

    if (res.ok) {
        dispatch(removeGroup(groupId));
    }
}

export const postGroupImage = (groupId, url, preview = false) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, preview }),
    });

    if (res.ok) {
        const image = await res.json();
        dispatch(createGroupImage(groupId, image));
        return image;
    }
}

let initialState = {allGroups: {}, singleGroup: {}};
const groupReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_GROUPS:
            return {...state, allGroups: {...action.groups}};
        case GET_SINGLE_GROUP:
            return {...state, singleGroup: {...action.group}};
        case POST_GROUP:
            return {
                ...state,
                allGroups: {...state.allGroups, [action.group.id]: action.group},
                singleGroup: {...action.group}
                };
        case PUT_GROUP:
            return {
                ...state,
                allGroups: {...state.allGroups, [action.group.id]: action.group},
                singleGroup: {...action.group}
            }
        case DELETE_GROUP:
            let res = {
                ...state,
                allGroups: {...state.allGroups},
                singleGroup: {}
            }
            delete res.allGroups[action.groupId];
            return res;
        case POST_GROUP_IMAGE:
            return {
                ...state,
                allGroups: {...state.allGroups},
                singleGroup: {...state.singleGroup, GroupImages: [action.image]}
            }
        default:
            return state;
    }
  };

  export default groupReducer;
