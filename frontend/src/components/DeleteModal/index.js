import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { deleteGroup } from "../../store/groups";
import { deleteEvent } from "../../store/events";

export default function DeleteModal({groupId, eventId}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const history = useHistory();
    const isGroup = !eventId;

    const deleteItem = async () => {
        if (isGroup) {
            dispatch(deleteGroup(groupId));
            history.push("/groups")
        } else {
            dispatch(deleteEvent(eventId));
            history.push(`/groups/${groupId}`)
        }
        closeModal();
    }

    return (
        <div className="box">
            <h2>Confirm Delete</h2>
            <h4>Are you sure you want to remove this
                {isGroup ? "group" : "event"}?
            </h4>
            <button className='modal-button' onClick={deleteItem}>
                Yes (Delete {isGroup ? "Group" : "Event"})
            </button>
            <button className='modal-button-no' onClick={closeModal}>
                No (Keep {isGroup ? "Group" : "Event"})
            </button>
        </div>
    )
}
