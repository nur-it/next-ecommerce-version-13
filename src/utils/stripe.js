import useAsync from "@hooks/useAsync";
import SettingServices from "@services/SettingServices";
import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

const getStripe = () => {
  const { data: storeSetting, loading } = useAsync(
    SettingServices.getOnlineStoreSecretKeys
  );

  const stripePublicKey =
    (!loading && storeSetting?.stripe_public_key) ||
    process.env.NEXT_PUBLIC_STRIPE_KEY;

  // console.log('stripePublicKey', stripePublicKey);

  if (!stripePromise) {
    stripePromise = loadStripe(`${stripePublicKey}`);
  }

  return { stripePromise, storeSetting };
};

export default getStripe;
