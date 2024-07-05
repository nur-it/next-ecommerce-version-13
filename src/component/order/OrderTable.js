const OrderTable = ({ data, currency, getNumberTwo }) => {
  return (
    <tbody className="bg-white divide-y divide-gray-100 text-serif text-sm">
      {data?.cart?.map((item, i) => (
        <tr key={i}>
          {/* <th className="px-4 py-1 whitespace-nowrap font-normal text-gray-500 text-left">
            {i + 1}{' '}
          </th> */}
          <td className="px-4 py-1 whitespace-nowrap font-normal text-gray-500 text-left">
            {item.title.substring(0, 30)}
          </td>
          <td className="px-4 py-1 whitespace-nowrap font-bold text-center">
            {item.quantity}{" "}
          </td>
          <td className="px-4 py-1 whitespace-nowrap font-bold text-left font-DejaVu">
            {currency}
            {getNumberTwo(item.price)}
          </td>

          <td className="px-4 py-1 whitespace-nowrap font-bold font-DejaVu k-grid text-red-500 text-right">
            {currency}
            {getNumberTwo(item.price * item.quantity)}
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default OrderTable;
