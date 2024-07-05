import React from "react";
import { IoClose } from "react-icons/io5";

//internal import
import Common from "@component/login/Common";
import MainModal from "@component/modal/MainModal";

const LoginModal = ({ modalOpen, setModalOpen }) => {
  return (
    <MainModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
      <div className="inline-block w-full max-w-lg p-10 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
        <div className="absolute top-0 right-0">
          <button
            onClick={() => setModalOpen(false)}
            type="button"
            className="inline-flex justify-center px-2 py-2 text-3xl font-medium text-red-500 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          >
            <IoClose />
          </button>
        </div>
        <Common setModalOpen={setModalOpen} />
      </div>
    </MainModal>
  );
};

export default React.memo(LoginModal);
