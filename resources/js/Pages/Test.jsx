import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CatalogCard from "@/Components/MIHAComponents/CatalogCard";
import { Head } from "@inertiajs/react";

import "reactflow/dist/style.css";

export default function Catalog({ user, roadmaps}) {
    return (
        <>
            <Head title="Тест" />
            <AuthenticatedLayout
                user={user}
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Каталог
                    </h2>
                }
            >
                
            </AuthenticatedLayout>
        </>
    );
}
