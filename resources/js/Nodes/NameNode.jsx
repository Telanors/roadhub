import { memo } from "react";

const NameNode = ({ data, selected }) => {
    let classes = "";
    classes += selected ? " outline outline-3 rounded-lg outline-offset-4 outline-blue-500" : "";

    return (
        <div className={"text-3xl font-extrabold" + classes}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
                {data.label}
            </span>
        </div>
    );
};

export default memo(NameNode);
