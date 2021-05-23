import React from "react";
import OrderList from "./components/orderList";
import {DataTableProvider} from "providers/dataTable";

function OrderManagement(props) {
  return (
    <DataTableProvider>
      <OrderList {...props} />
    </DataTableProvider>

  );
}

export default OrderManagement;
