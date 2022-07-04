import React from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import { useAppState } from '../contexts/AppState'
import models from '../types/models'

const ModelSelect = ({ className, onChange }) => {
    const { modelName, setModel } = useAppState()
    const label = 'Model'
    return (
        <FormControl variant="outlined" className={className}>
            <InputLabel id="model-name-select-label">{label}</InputLabel>
            <Select
                labelId="model-name-select-label"
                id="model-name-select"
                value={modelName}
                label={label}
                onChange={event => {
                    setModel(event.target.value)
                    onChange()
                }}
            >
                <MenuItem value={models[0].name}>
                    {models[0].displayName}
                </MenuItem>
                <MenuItem value={models[1].name}>
                    {models[1].displayName}
                </MenuItem>
                <MenuItem value={models[2].name}>
                    {models[2].displayName}
                </MenuItem>
            </Select>
        </FormControl>
    )
}

export default ModelSelect
