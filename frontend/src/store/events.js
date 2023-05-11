import { csrfFetch } from "./csrf";

const GET_EVENTS = "events/getEvents";
const GET_SINGLE_EVENT = "events/getSingleEvent";
const POST_EVENT = "events/postEvent";
const DELETE_EVENT = "events/deleteEvent";
const POST_EVENT_IMAGE = "events/postEventImage";

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

const createEvent = (event) => {
    return {
        type: POST_EVENT,
        event
    }
}

const removeEvent = (eventId) => {
    return {
        type: DELETE_EVENT,
        eventId,
    }
}

const createEventImage = (eventId, image) => {
    return {
        type: POST_EVENT_IMAGE,
        eventId,
        image
    }
}

export const getEvents = () => async (dispatch) => {
  const res = await csrfFetch("/api/events");
  if (res.ok) {
    const data = await res.json();
    const events = data.Events
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

export const postEvent = (event, groupId) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
    });

    if (res.ok) {
        const event = await res.json();
        dispatch(createEvent(event));
        return event;
    }
}

export const deleteEvent = (eventId) => async (dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}`, {
        method: "DELETE"
    })

    if (res.ok) {
        dispatch(removeEvent(eventId));
    }
}

export const postEventImage = (eventId, url, preview = false) => async (dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, preview }),
    });

    if (res.ok) {
        const image = await res.json();
        dispatch(createEventImage(eventId, image));
        return image;
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
        case POST_EVENT:
            return {
                ...state,
                allEvents: {...state.allEvents, [action.event.id]: action.event},
                singleEvent: {...action.event}
            }
        case DELETE_EVENT:
            let res = {
                ...state,
                allEvents: {...state.allEvents},
                singleEvent: {}
            }
            delete res.allEvents[action.eventId];
            return res;
        case POST_EVENT_IMAGE:
            return {
                ...state,
                allEvents: {...state.allEvents},
                singleEvent: {...state.singleEvent, EventImages: [action.image]}
            }
        default:
            return state;
    }
  };

  export default eventReducer;
