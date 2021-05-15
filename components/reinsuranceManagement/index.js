import React from "react";
import {DataTableProvider} from "providers/dataTable";
import ReinsuranceList from "./components/reinsuranceList";

function ReinsuranceManagement(props) {
    return (
        <DataTableProvider>
            <ReinsuranceList {...props}/>
        </DataTableProvider>
    );
}

export default ReinsuranceManagement;
