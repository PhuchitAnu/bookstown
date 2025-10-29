import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function Page() {
    return (
        <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
            <SearchClient />
        </Suspense>
    );
}