import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { notifyError } from "@utils/toast";

const PaypalButton = ({
  total,
  product,
  disabled,
  currency,
  showSpinner,
  handlePaymentWithPaypal,
}) => {
  const [{ isPending }] = usePayPalScriptReducer();

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={{
          color: "silver",
          layout: "horizontal",
          height: 55,
          tagline: false,
        }}
        disabled={disabled}
        forceReRender={[total]}
        onClick={(data, actions) => {
          console.log("clicked on paypal button");
        }}
        createOrder={(data, actions) => {
          return actions.order
            .create({
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: total,
                  },
                },
              ],
            })
            .then((orderId) => {
              // Your code here after create the order
              return orderId;
            });
        }}
        onApprove={async (data, actions) => {
          const order = await actions.order.capture();

          console.log("order confirmed");

          handlePaymentWithPaypal(order);
        }}
        onCancel={() => {
          notifyError("Paypal Payment Canceled!");
        }}
        onError={(err) => {
          notifyError(err);
        }}
      />
    </>
  );
};

export default PaypalButton;
