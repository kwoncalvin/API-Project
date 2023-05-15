import { useHistory } from "react-router-dom";
import "./GroupPreview.css"

export default function GroupPreview({group, numEvents}) {
    const history = useHistory();
    return (
        <div
            className='groupPreview'
            onClick={() => history.push(`/groups/${group.id}`)}
        >
            <img src={
                        group.previewImage ?
                            group.previewImage :
                            'https://www.nicepng.com/png/detail/359-3593867_big-image-group-of-people-clipart.png'}
            />
            <div className="prev-content">
                <h2>{group.name}</h2>
                <h4>{group.city}, {group.state}</h4>
                <p>{group.about}</p>
                <h4>{numEvents} event{numEvents === 1 ? "" : "s"} · {group.private ? "Private" : "Public"}</h4>
            </div>

        </div>
    )
}
