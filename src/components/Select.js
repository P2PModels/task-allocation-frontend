import React from 'react'
import PropTypes from 'prop-types'
import {
    FormControl,
    InputLabel,
    Select as MuiSelect,
    MenuItem,
    makeStyles,
    useTheme,
} from '@material-ui/core'

function Select(props) {
    const theme = useTheme()

    const {
        name,
        label,
        labelTitle,
        value,
        onChange,
        options,
        className,
        required,
        ...other
    } = props

    return (
        <FormControl variant="outlined" className={className} {...other}>
            <InputLabel>{label}</InputLabel>
            <MuiSelect
                name={name}
                label={label}
                value={value}
                onChange={onChange}
            >
                <MenuItem value="">None</MenuItem>
                {options.map((opt, i) => (
                    <MenuItem key={i} value={opt.value}>
                        {opt.label}
                    </MenuItem>
                ))}
            </MuiSelect>
        </FormControl>
    )
}

Select.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.array,
}

export default Select
