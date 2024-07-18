import React from "react";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ArticleIcon from "@mui/icons-material/ArticleRounded";

export default function NodeContentDialog({ open, onClose, node }) {
    const label = node?.data?.label ?? "Название отсутствует";
    const content = node?.data?.content ?? "Содержание отсутствует";
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ className: "!rounded-xl" }}
        >
            <DialogTitle className="!flex !items-center bg-gray-100">
                <div className="!bg-blue-500 !rounded-full me-2 text-white">
                    <ArticleIcon className="m-2" />
                </div>
                {label.length > 0 ? label : "Название отсутствует"}
            </DialogTitle>
            <Divider />
            <DialogContent>
                <div
                    className="html-canvas p-2"
                    dangerouslySetInnerHTML={{
                        __html:
                            content.length > 0
                                ? content
                                : `Содержание отсутствует`,
                    }}
                ></div>
            </DialogContent>
            <Divider />
            <DialogActions className="!px-6 !py-4 bg-gray-100">
                <Button
                    sx={{ textTransform: "none" }}
                    className="!rounded-full !text-gray-500 hover:!text-gray-700 hover:!bg-gray-100 !bg-white !border-gray-300 !drop-shadow-md"
                    onClick={onClose}
                    variant="outlined"
                    color="primary"
                >
                    Закрыть
                </Button>
            </DialogActions>
        </Dialog>
    );
}
