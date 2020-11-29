import React, { useState } from "react";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

function Filter(props) {
    const [value, setValue] = useState(props.default);

    const handleChange = (event) => {
        setValue(event.target.value);
    };
    
    if (props.type === 'select') {
        return (<TextField
            select
            value={value}
            helperText={props.label}
            onChange={handleChange}
        >
            {props.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
                {option.label}
            </MenuItem>
            ))}
        </TextField>
        );
    } else {
        return (<TextField 
            value={value}
            helperText={props.label}
            onChange={handleChange} 
            />
        );
    }
}

export default Filter;