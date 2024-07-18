import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div>
                <Link href="/">
                    <ApplicationLogo
                        imgProps={{
                            className:
                                "w-20 h-20 fill-current text-gray-500 me-2",
                        }}
                        textProps={{
                            className:
                                "text-5xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-zinc-800",
                        }}
                    />
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden rounded-xl">
                {children}
            </div>
        </div>
    );
}
