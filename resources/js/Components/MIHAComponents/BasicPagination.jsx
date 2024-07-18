import * as React from "react";
import {Pagination, Stack} from "@mui/material";

export default function BasicPagination({
    count,
    page,
    size,
    onChange,
    stackProps,
    paginationProps,
}) {
    return (
        <Stack {...stackProps}>
            <Pagination
                count={count}
                page={page}
                size={size}
                onChange={(event, value) => onChange(event, value)}
                {...paginationProps}
            />
        </Stack>
    );
}
