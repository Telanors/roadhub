import { memo } from "react";
import { Handle, Position, NodeResizer } from "reactflow";

const SectioncNode = ({ selected }) => {
    return (
        <>
            <NodeResizer
                color="rgb(59 130 246)"
                handleClassName="!w-4 !h-4 !rounded"
                lineStyle={{ borderWidth: "2px" }}
                isVisible={selected}
                minWidth={30}
                minHeight={30}
            />
            <Handle
                type="target"
                position={Position.Left}
                id="left-target"
                className="!w-4 !h-4 !bg-teal-300 !border-violet-500 !border-2"
                style={{ left: -9 }}
            />
            {/* Bottom handles with IDs */}
            <Handle
                type="source"
                position={Position.Right}
                id="right-source"
                className="!w-4 !h-4 !bg-lime-300 !border-violet-500 !border-2"
                style={{ right: -9 }}
            />
        </>
    );
};

export default memo(SectioncNode);
