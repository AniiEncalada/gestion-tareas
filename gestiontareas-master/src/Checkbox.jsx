import React from 'react';
import Checkbox from '@mui/material/Checkbox';

const MyCheckbox = ({ checked, onCheckedChange, ...props }) => {
    return (
        <Checkbox
            checked={checked}
            onChange={(event) => onCheckedChange(event.target.checked)}
            {...props}
        />
    );
};

export default MyCheckbox;