import { memo } from "react";
import { Handle, Position } from "reactflow";

const SubtopicNode = ({ data }) => {
    let classes =
        "cursor-pointer bg-slate-200 border-2 p-4 rounded-lg shadow-md border-dashed border-slate-500 hover:bg-slate-300 hover:border-slate-600";

    return (
        <div className={classes}>
            <div>{data.label}</div>
            <Handle
                type="target"
                position={Position.Left}
                id="left-target"
                className="!w-4 !h-4 !bg-teal-300 !border-slate-500 !border-2"
                style={{ left: 0, visibility: "hidden" }}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="right-source"
                className="!w-4 !h-4 !bg-lime-300 !border-slate-500 !border-2"
                style={{ right: 0, visibility: "hidden" }}
            />
        </div>
    );
};

export default memo(SubtopicNode);
