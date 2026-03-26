import { getApiDocs } from "@/lib/swagger";
import SwaggerPage from "./SwaggerUI";

export default function Page() {
    const spec = getApiDocs();

    return (
        <div style={{ padding: 20 }}>
            <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>
                🚀 Talka API Docs
            </h1>
            <SwaggerPage spec={spec} />
        </div>
    );
}