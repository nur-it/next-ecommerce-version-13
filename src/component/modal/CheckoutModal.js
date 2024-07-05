import { Modal, ModalBody, ModalFooter } from '@windmill/react-ui';
import { FiCheckCircle } from 'react-icons/fi';

const CheckoutModal = ({
  modalShow,
  setModalShow,
  orderSubmitAfterModal,
  setIsCheckoutSubmit,
}) => {
  const clickHandler = (message) => {
    setIsCheckoutSubmit(true);
    orderSubmitAfterModal(message);
    setModalShow(!modalShow);
  };

  return (
    <Modal isOpen={modalShow} onClose={() => setModalShow(!modalShow)}>
      <ModalBody className="text-center custom-modal px-8 pt-6 pb-4">
        <span className="flex justify-center text-3xl mb-6 text-green-500">
          <FiCheckCircle />
        </span>
        <h2 className="text-xl font-medium mb-2">
          <span className="text-green-500">
            Do You Want to Save this Shipping Information?
          </span>
        </h2>
        <p>It will save to your profile for future uses.</p>
      </ModalBody>

      <ModalFooter className="justify-center">
        <button
          className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-gray-600 border-gray-200 border dark:text-gray-400 w-full mr-3 h-10 bg-gray-200 sm:w-auto hover:bg-white hover:border-gray-50"
          layout="outline"
          onClick={() => clickHandler('no')}
        >
          No, Don't Save
        </button>
        <div className="flex justify-end ml-2">
          <button
            onClick={() => clickHandler('yes')}
            className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-green-500 border border-transparent hover:bg-green-600 w-full h-10 sm:w-auto"
          >
            Yes, Save it
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default CheckoutModal;
