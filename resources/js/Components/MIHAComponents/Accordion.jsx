import * as React from "react";
import { styled } from "@mui/material/styles";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    AccordionActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMoreRounded";

const MyAccordion = styled((props) => (
    <Accordion disableGutters elevation={0} square {...props} />
))((theme) => ({
    border: `0`,
    "&:not(:last-child)": {
        borderBottom: 0,
    },
    "&::before": {
        display: "none",
    },
    "& .MuiButtonBase-root": {
        padding: "0",
        minHeight: "0",
    },
}));

const MyAccordionSummary = styled((props) => (
    <AccordionSummary
        expandIcon={<ExpandMoreIcon className="!text-3xl" />}
        {...props}
    />
))((theme) => ({
    "& .MuiAccordionSummary-content": {
        margin: "0 !important",
    },
}));

const MyAccordionDetails = styled(AccordionDetails)((theme) => ({
    padding: "0",
}));

const MyAccordionActions = styled(AccordionActions)((theme) => ({
    padding: "0",
}));

export default function CustomAccordion({
    label,
    children,
    detailProps,
    summaryProps,
    footer,
    ...props
}) {
    return (
        <MyAccordion {...props}>
            <MyAccordionSummary {...summaryProps}>{label}</MyAccordionSummary>
            <MyAccordionDetails {...detailProps}>{children}</MyAccordionDetails>
            <MyAccordionActions className="!justify-start !mt-4">{footer}</MyAccordionActions>
        </MyAccordion>
    );
}
