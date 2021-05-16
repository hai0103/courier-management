import React from "react";
import PostOfficeList from "./components/postOfficeList";
import {DataTableProvider} from "providers/dataTable";

function PostOfficeManagement(props) {
    return (
        <DataTableProvider>
            <PostOfficeList {...props} />
        </DataTableProvider>

    );
}

export default PostOfficeManagement;
