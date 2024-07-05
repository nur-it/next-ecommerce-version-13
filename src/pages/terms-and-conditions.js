//internal import

import Layout from "@layout/Layout";
import useGetSetting from "@hooks/useGetSetting";
import PageHeader from "@component/header/PageHeader";
import CMSkeleton from "@component/preloader/CMSkeleton";
import useUtilsFunction from "@hooks/useUtilsFunction";

const TermAndConditions = () => {
  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting, loading, error } = useGetSetting();

  return (
    <Layout
      title="Terms & Conditions"
      description="This is terms and conditions page"
    >
      {storeCustomizationSetting?.term_and_condition?.status && (
        <PageHeader
          headerBg={storeCustomizationSetting?.term_and_condition?.header_bg}
          title={showingTranslateValue(
            storeCustomizationSetting?.term_and_condition?.title
          )}
        />
      )}

      <div className="bg-white">
        <div className="max-w-screen-2xl mx-auto lg:py-20 py-10 px-3 sm:px-10">
          <div className="mb-8 lg:mb-12 last:mb-0">
            <CMSkeleton
              html
              count={15}
              height={15}
              error={error}
              loading={loading}
              data={storeCustomizationSetting?.term_and_condition?.description}
            />
            <br />
            <CMSkeleton count={15} height={15} loading={loading} />
            <br />
            <CMSkeleton count={15} height={15} loading={loading} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermAndConditions;
