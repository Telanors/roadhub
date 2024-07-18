import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
    Autocomplete,
    Chip,
    CircularProgress,
    Checkbox,
    TextField,
    Button,
    Box,
    Popper,
} from "@mui/material";
import {
    RadioButtonUncheckedRounded as CheckBoxOutlineBlankIcon,
    CheckCircleOutlineRounded as CheckCircleOutlineRounded,
    Search as SearchIcon,
    CancelRounded as ClearIcon,
    Tag as TagIcon,
    ExpandMoreRounded as ExpandMoreRoundedIcon,
    Height,
} from "@mui/icons-material";
import axios from "axios";

const icon = <CheckBoxOutlineBlankIcon fontSize="medium" />;
const checkedIcon = <CheckCircleOutlineRounded fontSize="medium" />;

const StyledPopper = styled((props) => <Popper {...props} />)(({ theme }) => ({
    "& .MuiAutocomplete-paper": {
        borderRadius: "1.3rem",
        boxShadow:
            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    },
}));

const MyAutocomplete = styled((props) => <Autocomplete {...props} />)(
    ({ theme }) => ({
        "& .MuiOutlinedInput-root": {
            borderRadius: "0.75rem 0 0 0.75rem",
        },
    })
);

export default function CheckboxesTagsInput({
    onTagsChange,
    selected,
    ...props
}) {
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(route("tags"))
            .then((response) => {
                setTags(response.data);
                setSelectedTags(
                    response.data.filter((tag) => selected.includes(tag.id))
                );
                setLoading(false);
            })
            .catch((error) => {
                console.error("Ошибка получения тегов:", error);
                setLoading(false);
            });
    }, []);

    const handleSearch = () => {
        onTagsChange(selectedTags.map((tag) => tag.id));
    };

    const handleDelete = (tagToDelete) => {
        const newValues = selectedTags.filter((tag) => tag.id !== tagToDelete);
        setSelectedTags(newValues);
        onTagsChange(newValues.map((tag) => tag.id));
    };

    const handleChange = (event, newValue) => {
        setSelectedTags(newValue);
        if (newValue.length === 0) {
            onTagsChange([]);
        }
    };

    return (
        <>
            <Box display="flex" alignItems="center" width="100%" {...props}>
                <MyAutocomplete
                    multiple
                    size="small"
                    limitTags={5}
                    id="checkboxes-tags-demo"
                    options={tags}
                    value={selectedTags}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.name}
                    onChange={handleChange}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                icon={
                                    loading ? (
                                        <CircularProgress size={20} />
                                    ) : (
                                        icon
                                    )
                                }
                                checkedIcon={
                                    loading ? (
                                        <CircularProgress size={20} />
                                    ) : (
                                        checkedIcon
                                    )
                                }
                                style={{ marginRight: 8 }}
                                checked={selected}
                                disabled={loading}
                            />
                            <TagIcon />
                            {option.name}
                        </li>
                    )}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                size="small"
                                style={{
                                    margin: 2,
                                    marginLeft: 2,
                                    color: "#616161",
                                }}
                                key={option.id}
                                label={option.name}
                                onDelete={() => handleDelete(option.id)}
                                icon={<TagIcon />}
                                deleteIcon={<ClearIcon />}
                            />
                        ))
                    }
                    style={{ flexGrow: 1 }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Поиск"
                            InputProps={{
                                className: "!rounded-full",
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loading ? (
                                            <CircularProgress size={20} />
                                        ) : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                    popupIcon={<ExpandMoreRoundedIcon />}
                    disabled={loading}
                    PopperComponent={StyledPopper}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    disabled={loading}
                    className="!shadow-none"
                    sx={{
                        borderRadius: "0 0.75rem 0.75rem 0",
                        height: "40px",
                        width: "40px",
                    }}
                >
                    <SearchIcon />
                </Button>
            </Box>
        </>
    );
}
