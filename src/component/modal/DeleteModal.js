import { SidebarContext } from "@context/SidebarContext";
import CustomerServices from "@services/UserServices";
import { notifySuccess } from "@utils/toast";
import { Modal, ModalBody, ModalFooter } from "@windmill/react-ui";
import { useContext } from "react";
import { IoTrashOutline } from "react-icons/io5";

const DeleteModal = ({ modalShow, setModalShow, shippingId, userId }) => {
  const { setIsUpdate } = useContext(SidebarContext);
  // handle delete
  const handleDelete = async () => {
    try {
      const res = await CustomerServices.shippingAddressDelete(
        userId,
        shippingId
      );
      notifySuccess(res.message);
      setModalShow(false);
      setIsUpdate(true);
    } catch (error) {
      notifyError(err ? err.response.data.message : err.message);
      setModalShow(false);
    }
  };

  return (
    <Modal isOpen={modalShow} onClose={() => setModalShow(!modalShow)}>
      <ModalBody className="text-center custom-modal px-8 pt-6 pb-4">
        <span className="flex justify-center text-3xl mb-6 text-red-500">
          <IoTrashOutline />
        </span>
        <h2 className="text-xl font-medium mb-2">
          <span className="text-red-500">
            Do You Want to Delete this Shipping Address?
          </span>
        </h2>
        <p className="text-gray-700">
          You can't use this in your checkout anymore if you delete!
        </p>
      </ModalBody>

      <ModalFooter className="justify-center">
        <button
          className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-gray-800 border-gray-200 border w-full mr-3 h-12 bg-gray-300 sm:w-auto hover:bg-gray-200 hover:border-gray-50"
          layout="outline"
          onClick={() => setModalShow(!modalShow)}
        >
          No, Keep It
        </button>
        <div className="flex justify-end ml-2">
          <button
            onClick={handleDelete}
            className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-green-500 border border-transparent hover:bg-red-500 hover:text-gray-100 w-full h-12 sm:w-auto"
          >
            Yes, Delete It
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteModal;
