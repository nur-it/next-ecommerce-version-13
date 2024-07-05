//internal import
import Coupon from "@component/coupon/Coupon";
import PageHeader from "@component/header/PageHeader";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Layout from "@layout/Layout";

const Offer = () => {
  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting } = useGetSetting();

  return (
    <Layout title="Offer" description="this is discount page">
      {storeCustomizationSetting?.offers?.header_status && (
        <PageHeader
          headerBg={storeCustomizationSetting?.offers?.header_bg}
          title={showingTranslateValue(
            storeCustomizationSetting?.offers?.title
          )}
        />
      )}

      <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:py-20 sm:px-10">
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
          <Coupon />
        </div>
      </div>
    </Layout>
  );
};

export default Offer;
