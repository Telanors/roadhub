import React, { memo } from "react";
import { Handle, Position } from "reactflow";

const TopicNode = ({ data, selected }) => {
    let classes = "bg-yellow-200 border-2 p-4 rounded-lg shadow-md border-yellow-500 hover:bg-yellow-300 hover:border-yellow-600";
    classes += selected ? " outline outline-3 outline-offset-4 outline-blue-500" : "";

    return (
        <div className={classes}>
            <div>{data.label}</div>
            {/* Top handles with IDs */}
            <Handle
                type="target"
                position={Position.Left}
                id="left-target"
                className="!w-4 !h-4 !bg-teal-300 !border-yellow-500 !border-2"
                style={{left: -7}}
            />
            {/* Bottom handles with IDs */}
            <Handle
                type="source"
                position={Position.Right}
                id="right-source"
                className="!w-4 !h-4 !bg-lime-300 !border-yellow-500 !border-2"
                style={{right: -7}}
            />
        </div>
    );
};

export default memo(TopicNode);
