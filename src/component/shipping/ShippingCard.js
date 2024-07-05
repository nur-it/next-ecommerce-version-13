import { IoTrashOutline } from 'react-icons/io5';

const ShippingCard = ({ shipping, handleDeleteShippingAddress }) => {
  return (
    <>
      <div
        key={shipping._id}
        className={`flex flex-col border border-gray-200 hover:border-green-500 transition-all duration-400 justify-center p-5 bg-white hover:bg-white rounded-md`}
      >
        <h4 className="flex justify-between text-gray-500 text-sm font-semibold mb-2 capitalize">
          <p>Address: {shipping.address}</p>{' '}
          <button
            onClick={() => handleDeleteShippingAddress(shipping._id)}
            className="text-xl text-red-500 -mt-10 -mr-5"
          >
            <IoTrashOutline />
          </button>
        </h4>

        <div className="block text-gray-500 text-sm font-medium capitalize">
          {' '}
          City: {shipping.city}
        </div>
        <div className="block text-gray-500 text-sm font-medium capitalize">
          Country: {shipping.country}
        </div>
        <div className="block text-gray-500 text-sm font-medium capitalize">
          <p>ZipCode: {shipping.zipCode}</p>
        </div>
      </div>
    </>
  );
};

export default ShippingCard;
