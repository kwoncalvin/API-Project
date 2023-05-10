import { csrfFetch } from "./csrf";

const GET_GROUPS = "groups/getGroups";
const GET_SINGLE_GROUP = "groups/getGroup";

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

export const getGroups = () => async (dispatch) => {
    const res = await fetch("/api/groups");
    if (res.ok) {
        const groups = await res.json();
        dispatch(loadGroups(groups));
    }
};

export const getSingleGroup = (id) => async (dispatch) => {
    const res = await fetch(`/api/groups/${id}`);
    if (res.ok) {
        const group = await res.json();
        dispatch(loadSingleGroup(group));
    }
}

let initialState = {allGroups: {}, singleGroup: {}};
const groupReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_GROUPS:
            return {...state, allGroups: {...action.groups}};
        case GET_SINGLE_GROUP:
            return {...state, singleGroup: {...action.group}};
        default:
            return state;
    }
  };

  export default groupReducer;