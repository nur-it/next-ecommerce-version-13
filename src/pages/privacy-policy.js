//internal import
import PageHeader from "@component/header/PageHeader";
import CMSkeleton from "@component/preloader/CMSkeleton";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Layout from "@layout/Layout";

const PrivacyPolicy = () => {
  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting, loading, error } = useGetSetting();

  return (
    <Layout title="Privacy Policy" description="This is privacy policy page">
      {storeCustomizationSetting?.privacy_policy?.status && (
        <PageHeader
          headerBg={storeCustomizationSetting?.privacy_policy?.header_bg}
          title={showingTranslateValue(
            storeCustomizationSetting?.privacy_policy?.title
          )}
        />
      )}

      <div className="bg-white">
        <div className="max-w-screen-2xl mx-auto lg:py-20 py-10 px-4 sm:px-10">
          <div className="mb-8 lg:mb-12 last:mb-0">
            <CMSkeleton
              html
              count={15}
              height={15}
              error={error}
              loading={loading}
              data={storeCustomizationSetting?.privacy_policy?.description}
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

export default PrivacyPolicy;
