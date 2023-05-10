import { csrfFetch } from "./csrf";

const GET_EVENTS = "events/getEvents";
const GET_SINGLE_EVENT = "events/getSingleEvent";

const loadEvents = (events) => {
  return {
    type: GET_EVENTS,
    events
  };
};

const loadSingleEvent = (event) => {
  return {
    type: GET_SINGLE_EVENT,
    event
  };
};

export const getEvents = () => async (dispatch) => {
  const res = await csrfFetch("/api/events");
  if (res.ok) {
    const events = await res.json();
    dispatch(loadEvents(events));
  }
};

export const getSingleEvent = (id) => async (dispatch) => {
    const res = await fetch(`/api/events/${id}`);
    if (res.ok) {
        const event = await res.json();
        dispatch(loadSingleEvent(event));
    }
}

let initialState = {allEvents: {}, singleEvent: {}};
const eventReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_EVENTS:
            return {...state, allEvents: {...action.events}};
        case GET_SINGLE_EVENT:
            return {...state, singleEvent: {...action.event}};
        default:
            return state;
    }
  };

  export default eventReducer;
