import { useHistory } from "react-router-dom";

export default function GroupPreview({group}) {
    const history = useHistory();


    return (
        <div onClick={() => history.push(`/groups/${group.id}`)}>{group.name}</div>
    )
}
