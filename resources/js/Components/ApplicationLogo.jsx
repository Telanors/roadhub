export default function ApplicationLogo({ imgProps, textProps }) {
    return (
        <div className="flex items-center">
            <img
                src="/images/logo.png"
                width={40}
                alt="logo"
                className="me-2"
                {...imgProps}
            />
            <span
                className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-zinc-800"
                {...textProps}
            >
                Roadhub
            </span>
        </div>
    );
}
