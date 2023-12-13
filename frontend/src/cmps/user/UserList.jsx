import { UserPreview } from './UserPreview'

export function UserList({ users, onRemoveUser }) {
    return (
        <div className="user-list">
            <div className="header">
                <div className="title">Full name</div>
                <div className="title">Username</div>
                <div className="title">Score</div>
            </div>
            <ul>
                {users.map((user) => (
                    <li key={user._id}>
                        <UserPreview user={user} onRemoveUser={onRemoveUser} />
                    </li>
                ))}
            </ul>
        </div>
    )
}
