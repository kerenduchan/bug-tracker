import { UserPreview } from './UserPreview'

export function UserList({ users, onRemoveUser, onEditUser }) {
    return (
        <ul className="user-list">
            {users.map((user) => (
                <li key={user._id}>
                    <UserPreview
                        user={user}
                        onRemoveUser={onRemoveUser}
                        onEditUser={onEditUser}
                    />
                </li>
            ))}
        </ul>
    )
}
