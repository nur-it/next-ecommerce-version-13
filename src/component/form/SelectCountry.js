import useAsync from "@hooks/useAsync";
import useUtilsFunction from "@hooks/useUtilsFunction";
import CountryServices from "@services/CountryServices";

const SelectCountry = ({
  name,
  label,
  register,
  required,
  shippingCarrier,
  handleShippingCarrier,
}) => {
  const { data } = useAsync(CountryServices.getShowingCountry);
  const { lang, showingTranslateValue } = useUtilsFunction();

  const handleChangeShipping = () => {
    if (shippingCarrier) {
      return handleShippingCarrier(shippingCarrier);
    } else {
      return null;
    }
  };

  return (
    <>
      {data?.length === 0 ? (
        "Loading..."
      ) : (
        <select
          className="py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12"
          name={name}
          {...register(`${name}`, {
            required: required ? false : `${label} is required!`,
          })}
          onBlur={handleChangeShipping}
        >
          <option value="" defaultValue hidden>
            Select Country
          </option>
          {data?.map((country) => (
            <option key={country._id} value={country?.name[lang]}>
              {showingTranslateValue(country?.name)}
            </option>
          ))}
        </select>
      )}
    </>
  );
};

export default SelectCountry;
