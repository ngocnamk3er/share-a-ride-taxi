import React, { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, ClickAwayListener, Container, Divider, FormControl, Icon, IconButton, InputAdornment, InputBase, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material";
import { menuIconMap } from "config/menuconfig";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { theme } from "App";

const styles = {
    root: (theme) => ({
        display: 'flex',
        width: '80%',
        backgroundColor: 'white',
        marginBottom: '32px',
        maxHeight: '40px',
        '& .filter-by-box': {
            maxWidth: '20%',
            minWidth: '20%',
            '& .filter-by': {
                border: '1px solid #c5c3c3',
                borderRadius: '3px 0px 0px 3px',
                width: '100%',
                height: '40px',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-evenly',
                '& .MuiTypography-root': {
                    fontWeight: 600
                }
            },
            '& .filter-by-item': {
                zIndex: 100,
                position: 'relative',
                overflow: 'visible',
                backgroundColor: 'white',
                // width: '200px',
                padding: '16px 4px 8px 4px',
                border: '1px solid #c5c3c3',
                paddingLeft: '10px',
                '& .filter-by-item-title': {
                    marginBottom: '16px',
                    '& .MuiTypography-root': {
                        fontWeight: 600
                    }
                },
                '& .btn-filter': {
                    marginTop: '32px'
                },
                '& .MuiFormLabel-root': {
                    top: '-10px'
                }
                // '& .MuiInputBase-root': {
                //     height: '40px'
                // }
            },
        },
        '& .input-search': {
            width: '100%',
            '& .MuiInputBase-root': {
                height: '40px !important',
                width: '100%',
                borderRadius: '0px 3px 3px 0px'
            }
        }
    })
}
const SearchBar = ({ filters, setFilters, status, type }) => {
    const [open, setOpen] = useState(false);

    const [code, setCode] = useState('');
    const [statusChose, setStatusChose] = useState('');

    const handleSwitch = () => {
        setOpen(!open)
    }
    const handleFilterStatus = () => {
        let filterTmp = filters.filter((item) => item.type !== type);
        let data = { type: type, value: statusChose }
        setFilters(prevState => [...filterTmp, data]);
        handleSwitch();
    }
    const searchCode = () => {
        let filterTmp = filters.filter((item) => item.type !== "code");
        let data = { type: "code", value: code }
        setFilters(prevState => [...filterTmp, data])
    }
    const handleRemoveFilter = (typeFilter) => {
        let data = filters.filter((item) => item.type !== typeFilter);
        if (typeFilter === "code") {
            setCode('');
        }
        if (typeFilter === "status") {
            setStatusChose('');
        }
        setFilters(data);
    }
    console.log("filters", filters);
    console.log("status", status);
    return (
        <Box>
            <Box sx={(them) => ({
                ...styles.root(theme), ...{},
            })}>
                <Box className="filter-by-box">
                    <Box className="filter-by"
                        onClick={handleSwitch}>
                        <Box>
                            <Typography>Filter By</Typography>
                        </Box>
                        <Box>
                            <Icon>{menuIconMap.get("ArrowDropDownIcon")}</Icon>
                        </Box>
                    </Box>
                    {open ? (
                        <Box className="filter-by-item">
                            <Box className="filter-by-item-title">
                                <Typography>{type === "status" ? "Status:" : "Type:"}</Typography>
                            </Box>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">{type === "status" ? "Status" : "Type"}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Status"
                                    size="small"
                                    onChange={(e) => setStatusChose(e.target.value)}
                                >
                                    {status?.map((item) => {
                                        return (
                                            <MenuItem value={item?.name}>{item?.name}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            <Box className="btn-filter"
                                onClick={handleFilterStatus}
                            >
                                <Button variant="contained">Search</Button>
                            </Box>
                        </Box>
                    ) : null}

                </Box>
                <Box className="input-search">
                    <OutlinedInput

                        id="outlined-adornment-password"
                        type='text'
                        InputLabelProps={{ shrink: false }}
                        variant="outlined"
                        placeholder="input search code"
                        value={code}
                        onChange={(e) => { setCode(e.target.value) }}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={searchCode}
                                    // onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </Box>
            </Box>
            <Box className="item-filter" mb={2} sx={{display: 'flex'}}>
                {filters.length > 0 ? (
                    filters.map((item) => {
                        return (
                            <Box sx={{
                                display: 'flex', marginRight: '8px', width: 'fit-content',
                                border: '1px solid gray', borderRadius: '10px', padding: '2px 4px'
                            }}>
                                <Box sx={{}}>
                                    <Typography>{item.value}</Typography>
                                </Box>

                                <Box onClick={() => handleRemoveFilter(item.type)}
                                    sx={{ cursor: 'pointer', marginLeft: '4px' }}>
                                    <CloseIcon />
                                </Box>
                            </Box>
                        )
                    })

                ) : null}
            </Box>
        </Box >
    )
}
export default SearchBar;