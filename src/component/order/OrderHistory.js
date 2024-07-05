import useUtilsFunction from "@hooks/useUtilsFunction";

const OrderHistory = ({ order }) => {
  const { showDateFormat, getNumberTwo, currency } = useUtilsFunction();
  return (
    <>
      <td className="px-5 py-3 leading-6 whitespace-nowrap">
        <span className="uppercase text-sm font-medium">
          {order._id.substring(20, 24)}
        </span>
      </td>
      <td className="px-5 py-3 leading-6 text-center whitespace-nowrap">
        <span className="text-sm">{showDateFormat(order.createdAt)}</span>
      </td>

      <td className="px-5 py-3 leading-6 text-center whitespace-nowrap">
        <span className="text-sm">{order.paymentMethod}</span>
      </td>
      <td className="px-5 py-3 leading-6 text-center whitespace-nowrap font-medium text-sm">
        {/* {order.status === 'Delivered' ||
          (order.status === 'POS-Completed' && (
            <span className="text-emerald-500">{order.status}</span>
          ))} */}

        {order.status === "Delivered" && (
          <span className="text-emerald-500">{order.status}</span>
        )}
        {order.status === "POS-Completed" && (
          <span className="text-emerald-500">{order.status}</span>
        )}
        {order.status === "Pending" && (
          <span className="text-orange-500">{order.status}</span>
        )}
        {order.status === "Cancel" && (
          <span className="text-red-500">{order.status}</span>
        )}
        {order.status === "Processing" && (
          <span className="text-indigo-500">{order.status}</span>
        )}
        {order.status === "Deleted" && (
          <span className="text-red-700">{order.status}</span>
        )}
      </td>
      <td className="px-5 py-3 leading-6 text-center whitespace-nowrap">
        <span className="text-sm font-bold">
          {currency}
          {getNumberTwo(order?.total)}
        </span>
      </td>
    </>
  );
};

export default OrderHistory;
