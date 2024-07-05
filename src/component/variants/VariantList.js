import useUtilsFunction from "@hooks/useUtilsFunction";

const VariantList = ({
  att,
  option,
  setImage,
  variants,
  setValue,
  varTitle,
  setSelectVa,
  selectVariant,
  setSelectVariant,
}) => {
  const { showingTranslateValue } = useUtilsFunction();
  const handleChangeVariant = (v) => {
    setValue(v);
    setSelectVariant({
      ...selectVariant,
      [att]: v,
    });
    setSelectVa({ [att]: v });
    setImage("");
  };

  return (
    <>
      {option === "Dropdown" ? (
        <div className="grid sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          <select
            onChange={(e) => handleChangeVariant(e.target.value)}
            className="focus:shadow-none w-full px-2 py-1 form-select outline-none h-10 text-sm focus:outline-none block rounded-md bg-gray-100 border-transparent focus:bg-white border-green-600 focus:border-green-400 focus:ring focus:ring-green-200"
            name="parent"
          >
            {[
              ...new Map(
                variants.map((v) => [v[att], v].filter(Boolean))
              ).values(),
            ]
              .filter(Boolean)
              .map(
                (vl, i) =>
                  Object?.values(selectVariant).includes(vl[att]) &&
                  varTitle.map((vr) =>
                    vr?.variants?.map(
                      (el) =>
                        vr?._id === att &&
                        el?._id === vl[att] && (
                          <option
                            key={i + 1}
                            hidden
                            value={selectVariant[att]}
                            defaultValue={selectVariant[att]}
                          >
                            {showingTranslateValue(el?.name)}
                          </option>
                        )
                    )
                  )
              )}

            {[
              ...new Map(
                variants.map((v) => [v[att], v].filter(Boolean))
              ).values(),
            ]
              .filter(Boolean)
              .map((vl, i) =>
                varTitle.map((vr) =>
                  vr?.variants?.map(
                    (el) =>
                      vr?._id === att &&
                      el?._id === vl[att] && (
                        <option key={el._id} value={vl[att]} defaultValue>
                          {showingTranslateValue(el?.name)}
                        </option>
                      )
                  )
                )
              )}
          </select>
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            ...new Map(
              variants?.map((v) => [v[att], v].filter(Boolean))
            ).values(),
          ]
            .filter(Boolean)
            .map((vl, i) =>
              varTitle.map((vr) =>
                vr?.variants?.map(
                  (el) =>
                    vr?._id === att &&
                    el?._id === vl[att] && (
                      <button
                        onClick={(e) => handleChangeVariant(vl[att])}
                        key={i + 1}
                        className={`${
                          Object?.values(selectVariant).includes(vl[att])
                            ? "bg-green-500 text-white font-medium mr-2 border-0 rounded-full inline-flex items-center justify-center p-3 text-xs font-serif mt-2 focus:outline-none"
                            : "bg-gray-100 mr-2 border-0 text-gray-800 font-medium rounded-full inline-flex items-center justify-center p-3 text-xs font-serif mt-2 focus:outline-none"
                        }`}
                      >
                        {showingTranslateValue(el?.name)}
                      </button>
                    )
                )
              )
            )}
        </div>
      )}
    </>
  );
};

export default VariantList;
