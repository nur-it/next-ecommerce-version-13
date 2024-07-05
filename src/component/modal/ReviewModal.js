import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import ReactStars from "react-stars";

// internal imports
import Error from "@component/form/Error";
import Label from "@component/form/Label";
import Uploader from "@component/image-uploader/Uploader";
import ReviewServices from "@services/ReviewServices";
import { notifyError, notifySuccess } from "@utils/toast";
import MainModal from "./MainModal";

const ReviewModal = ({
  title = "Add",
  userInfo,
  productId,
  modalOpen,
  setModalOpen,
  storeCustomizationSetting,
}) => {
  const {
    register,
    handleSubmit,
    setValue: setValues,
    formState: { errors },
  } = useForm();

  // react hook
  const [rating, setRating] = useState(0);
  const [imageUrl, setImageUrl] = useState([]);
  const [reviewSingleData, setReviewSingleData] = useState({});

  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate);
  };

  // handle review add
  const onSubmit = async (data) => {
    try {
      if (rating === 0) {
        return notifyError("Please select a rating");
      }

      if (title === "Edit") {
        const reviewData = {
          star: rating,
          image: imageUrl,
          comment: data.comment,
          product: productId,
          customer: userInfo?._id,
        };

        await ReviewServices.updateReview(reviewSingleData._id, reviewData);
      } else {
        const reviewData = {
          star: rating,
          image: imageUrl,
          comment: data.comment,
          product: productId,
          customer: userInfo?._id,
        };

        await ReviewServices.addReview(reviewData);
      }

      setValues("comment");
      setImageUrl("");
      setRating(0);

      notifySuccess("Review Success!");
      setModalOpen(false);
      window.location.reload();
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
      setModalOpen(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (title === "Add") {
        return;
      }

      try {
        const res = await ReviewServices.getReviewByProductId(productId);

        setReviewSingleData(res);
        setImageUrl(res?.image);
        setRating(parseInt(res?.star));
        setValues("comment", res?.comment);
      } catch (err) {
        console.log("err", err);
      }
    })();
  }, [productId]);

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

        <div>
          <div>
            <h5 className="text-xl font-semibold mb-3">{title} Your Review</h5>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-5 flex flex-col gap-5"
          >
            <div className="form-group">
              <label htmlFor="comment">Comment</label>

              <div className="mt-2">
                <textarea
                  {...register("comment", {
                    required: false,
                  })}
                  id="comment"
                  name="comment"
                  rows="4"
                  placeholder="Enter your Comment"
                  className="py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-white border-gray-200 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>
              <Error errorName={errors.comment} />
            </div>

            <div className="form-group">
              <div>
                <span className="mr-3">Review</span>
                {rating === 1 ? (
                  <span className="text-red-500 text-base font-bold">
                    Terrible
                  </span>
                ) : rating === 2 ? (
                  <span className="text-red-500 text-base font-bold">Poor</span>
                ) : rating === 3 ? (
                  <span className="text-yellow-500 text-base font-bold">
                    Fair
                  </span>
                ) : rating === 4 ? (
                  <span className="text-green-600 text-base font-bold">
                    Top
                  </span>
                ) : rating === 5 ? (
                  <span className="text-green-600 text-base font-bold">
                    Excellent
                  </span>
                ) : (
                  <span></span>
                )}
              </div>

              <div>
                <ReactStars
                  count={5}
                  size={35}
                  half={false}
                  value={rating}
                  color1="#d1d1d1"
                  color2="#f59e0b"
                  onChange={handleRating}
                />
              </div>
            </div>

            <div>
              <Label label={"Image"} />

              <div className="mt-3 flex items-center">
                <Uploader
                  multiple
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                />
              </div>
            </div>

            <div className="text-right">
              <button
                type="submit"
                style={{
                  backgroundColor:
                    storeCustomizationSetting?.color?.bg_button?.hex,
                }}
                className={`bg-gray-800 text-white hover:bg-gray-900 w-[130px] text-center py-3 rounded transition-all focus:outline-none my-1`}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainModal>
  );
};

export default ReviewModal;
