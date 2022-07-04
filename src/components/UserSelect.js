import React from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import { useAppState } from '../contexts/AppState'
import { useUsersQuery } from '../hooks/useRequests'

const UserSelect = ({ className, onChange }) => {
    const { users } = useUsersQuery()
    const { userId, setUser } = useAppState()
    const label = 'User'

    if (users) {
        return (
            <FormControl variant="outlined" className={className}>
                <InputLabel id="user-select-label">{label}</InputLabel>
                <Select
                    labelId="user-select-label"
                    id="user-select"
                    value={userId ? userId : users[0].id}
                    label={label}
                    onChange={event => {
                        setUser(event.target.value)
                        onChange()
                    }}
                >
                    {users.map((u, i) => (
                        <MenuItem value={u.id} key={u.id}>
                            {u.id}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        )
    } else return <></>
}

export default UserSelect
