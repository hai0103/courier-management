import React from "react";
import {DataTableProvider} from "providers/dataTable";
import ReinsuranceClassList from "./components/reinsuranceClassList";

function ReinsuranceClassManagement(props) {
    return (
        <DataTableProvider>
            <ReinsuranceClassList {...props}/>
        </DataTableProvider>
    );
}

export default ReinsuranceClassManagement;
