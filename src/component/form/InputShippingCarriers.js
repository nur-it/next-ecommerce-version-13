import useUtilsFunction from "@hooks/useUtilsFunction";

const InputShippingCarriers = ({
  error,
  loading,
  register,
  shippingData,
  handleShippingCarrier,
}) => {
  // console.log(shippingData);
  const { showingTranslateValue } = useUtilsFunction();

  return (
    <div className="grid lg:grid-cols-6 gap-6">
      {!loading &&
        !error &&
        shippingData?.map((shipping, i) => {
          return (
            <div
              key={i + 1}
              className="col-span-6 sm:col-span-3 p-3 card border border-gray-200 bg-white rounded-md"
            >
              <label className="cursor-pointer label">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3 text-gray-400">
                      <img
                        width={25}
                        height={25}
                        src={!loading && !error && shipping?.carrier_logo}
                      />
                    </span>
                    <div>
                      {" "}
                      <h6 className="font-serif font-medium text-sm text-gray-600">
                        {!loading &&
                          !error &&
                          showingTranslateValue(shipping?.name)}
                      </h6>
                      {/* <p className="text-xs text-gray-500 font-medium">
                        Delivery: {time}{' '}
                        <span className="font-medium text-gray-600">
                            Cost : ${cost}.00
                        </span>
                        </p> 
                       */}
                    </div>
                  </div>
                  <input
                    {...register("shippingCarriers", {
                      required: "Shipping Method is required!",
                    })}
                    onChange={(e) => handleShippingCarrier(shipping)}
                    name="shippingCarriers"
                    type="radio"
                    defaultValue={
                      !loading &&
                      !error &&
                      showingTranslateValue(shipping?.name)
                      // Object.keys(shipping?.name).includes()
                      //   ? shipping?.name[]
                      //   : shipping?.name
                    }
                    className="form-radio outline-none focus:ring-0 text-emerald-500"
                  />
                </div>
              </label>
            </div>
          );
        })}

      {/* <div>{shippingCarriers}</div> */}
    </div>
  );
};

export default InputShippingCarriers;
