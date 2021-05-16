import React from "react";
import UserList from "./components/userList";
import {DataTableProvider} from "providers/dataTable";

function UserManagement(props) {
    return (
        <DataTableProvider>
            <UserList {...props} />
        </DataTableProvider>

    );
}

export default UserManagement;
