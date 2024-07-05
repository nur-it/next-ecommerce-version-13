import Error from "@component/form/Error";
import InputArea from "@component/form/InputArea";
import Label from "@component/form/Label";
import SelectCountry from "@component/form/SelectCountry";
import { SidebarContext } from "@context/SidebarContext";
import CustomerServices from "@services/UserServices";
import { notifyError, notifySuccess } from "@utils/toast";
import { Modal, ModalBody, ModalFooter } from "@windmill/react-ui";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";
import { useForm } from "react-hook-form";

const ShippingCreateModal = ({ modalShow, setModalShow, userId }) => {
  const { setIsUpdate } = useContext(SidebarContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await CustomerServices.shippingAddressCreate(userId, data);
      setModalShow(false);
      notifySuccess("Shipping Address Added Successfully");
      setIsUpdate(true);
    } catch (err) {
      notifyError(err ? err.response.data.message : err.message);
      setModalShow(false);
    }
  };

  const { t } = useTranslation();

  return (
    <Modal isOpen={modalShow} onClose={() => setModalShow(!modalShow)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="custom-modal px-8 pt-6 pb-4">
          <div className="grid grid-cols-6 gap-6 mb-8">
            <div className="col-span-6">
              <InputArea
                register={register}
                label={t("common:streetAddress")}
                name="address"
                type="text"
                placeholder="123 Boulevard Rd, Beverley Hills"
              />
              <Error errorName={errors.address} />
            </div>

            <div className="col-span-6 sm:col-span-6 lg:col-span-2">
              <InputArea
                register={register}
                label={t("common:city")}
                name="city"
                type="text"
                placeholder="Los Angeles"
              />
              <Error errorName={errors.city} />
            </div>

            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
              <Label label={"Country"} />
              <SelectCountry
                register={register}
                label="Country"
                name="country"
              />
              <Error errorName={errors.country} />
            </div>

            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
              <InputArea
                register={register}
                label={t("common:zIPPostal")}
                name="zipCode"
                type="text"
                placeholder="2345"
              />
              <Error errorName={errors.zipCode} />
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="justify-end">
          {/* <button
            className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-gray-800 border-gray-200 border w-full mr-3 h-10 bg-gray-300 sm:w-auto hover:bg-gray-200 hover:border-gray-50"
            layout="outline"
            onClick={() => setModalShow(!modalShow)}
          >
            No, Keep It
          </button> */}

          <div className="flex justify-end ml-2">
            <button
              type="submit"
              className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-green-500 border border-transparent hover:bg-green-600 w-full h-10 sm:w-auto"
            >
              Add New address
            </button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default ShippingCreateModal;
