import { memo } from "react";
import { Handle, Position } from "reactflow";

const SectioncNode = () => {
    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                id="left-target"
                className="!w-4 !h-4 !bg-teal-300 !border-violet-500 !border-2"
                style={{ visibility: "hidden" }}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="right-source"
                className="!w-4 !h-4 !bg-lime-300 !border-violet-500 !border-2"
                style={{ visibility: "hidden" }}
            />
        </>
    );
};

export default memo(SectioncNode);
