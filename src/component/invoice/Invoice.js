import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";
import Image from "next/image";
import Link from "next/link";

//internal import

import useAsync from "@hooks/useAsync";
import OrderTable from "@component/order/OrderTable";
import SettingServices from "@services/SettingServices";
import useTranslation from "next-translate/useTranslation";
import useUtilsFunction from "@hooks/useUtilsFunction";
import useGetSetting from "@hooks/useGetSetting";

const Invoice = ({ data, printRef }) => {
  const { t } = useTranslation();

  const { data: posSetting } = useAsync(SettingServices.getPosSetting);

  const { storeCustomizationSetting } = useGetSetting();
  const {
    globalSetting,
    currency,
    showDateFormat,
    getNumberTwo,
    showingTranslateValue,
  } = useUtilsFunction();

  return (
    <div ref={printRef}>
      <div className="overflow-hidden rounded-t lg:overflow-visible px-8 mt-10">
        <div className="rounded-t flex lg:flex-row md:flex-row flex-col lg:items-center justify-between py-4 border-b border-gray-100 dark:border-white dark:text-gray-300">
          <Table>
            <TableBody className="">
              <TableRow className="flex justify-between items-baseline">
                <TableCell className="px-0">
                  <h1 className="font-bold font-serif text-2xl text-gray-800 uppercase">
                    {" "}
                    {t("common:invoice")}
                  </h1>
                  <h6 className="text-gray-700">
                    Status :{" "}
                    {data.status === "Delivered" && (
                      <span className="text-emerald-500">{data.status}</span>
                    )}
                    {data.status === "POS-Completed" && (
                      <span className="text-emerald-500">{data.status}</span>
                    )}
                    {data.status === "Pending" && (
                      <span className="text-orange-500">{data.status}</span>
                    )}
                    {data.status === "Cancel" && (
                      <span className="text-red-500">{data.status}</span>
                    )}
                    {data.status === "Processing" && (
                      <span className="text-indigo-500">{data.status}</span>
                    )}
                    {data.status === "Deleted" && (
                      <span className="text-red-700">{data.status}</span>
                    )}
                  </h6>
                  {posSetting?.invoice_contact_details
                    ? posSetting?.vat_number && (
                        <p className="text-gray-700">
                          VAT Number :{" "}
                          <span className="text-gray-900">
                            {posSetting?.vat_number}{" "}
                          </span>
                        </p>
                      )
                    : globalSetting?.vat_number && (
                        <p className="text-gray-700">
                          VAT Number :{" "}
                          <span className="text-gray-900">
                            {globalSetting?.vat_number}{" "}
                          </span>
                        </p>
                      )}
                </TableCell>

                <TableCell className="px-0 invoice-address-width">
                  <h2 className="text-lg font-serif font-semibold mt-4 lg:mt-0 md:mt-0">
                    <Link href="/">
                      <Image
                        width={130}
                        height={40}
                        src={
                          storeCustomizationSetting?.footer_block_four_logo
                            ? storeCustomizationSetting?.footer_block_four_logo
                            : "/logo/cloudclever_logo.png"
                        }
                        alt="logo"
                      />
                    </Link>
                  </h2>
                  {posSetting?.invoice_contact_details ? (
                    <div className="text-sm text-gray-500 col-3  ">
                      <span className="font-bold font-serif text-sm uppercase text-gray-600 ">
                        {showingTranslateValue(posSetting?.shop_name)}
                      </span>
                      <br />
                      {showingTranslateValue(posSetting?.address_one)}
                      {showingTranslateValue(posSetting?.address_two) &&
                        `,${showingTranslateValue(posSetting?.address_two)}`}

                      {showingTranslateValue(posSetting?.address_three) &&
                        `,${showingTranslateValue(posSetting?.address_three)}`}
                      <br />
                      {posSetting?.contact_one && `${posSetting?.contact_one}`}

                      {posSetting?.contact_two && `,${posSetting?.contact_two}`}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 col-3  ">
                      <span className="font-bold font-serif text-sm uppercase text-gray-600 ">
                        {showingTranslateValue(globalSetting?.shop_name)}
                      </span>
                      <br />
                      {showingTranslateValue(globalSetting?.address_one)}

                      {showingTranslateValue(globalSetting?.address_two) &&
                        `,${showingTranslateValue(globalSetting?.address_two)}`}

                      {showingTranslateValue(globalSetting?.address_three) &&
                        `,${showingTranslateValue(
                          globalSetting?.address_three
                        )}`}
                      <br />
                      {globalSetting?.contact_one &&
                        `${globalSetting?.contact_one}`}
                      {globalSetting?.contact_two &&
                        `,${globalSetting?.contact_two}`}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex lg:flex-row md:flex-row flex-col justify-between pt-4">
          <Table>
            <TableBody className="">
              <TableRow className=" flex justify-between items-center">
                <TableCell className="px-0">
                  <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
                    <span className="font-bold font-serif text-sm uppercase text-gray-600 block">
                      {t("common:date")}
                    </span>
                    <span className="text-sm text-gray-500 block">
                      {showDateFormat(data?.createdAt)}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className=" md:mb-0 lg:mb-0 flex flex-col">
                    <span className="font-bold font-serif text-sm uppercase text-gray-600 block">
                      {t("common:invoiceNo")}
                    </span>
                    <span className="text-sm text-gray-500 block">
                      #{data.invoice}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-0">
                  <div className="flex flex-col lg:text-right text-right">
                    <span className="font-bold font-serif text-sm uppercase text-gray-600 block">
                      {t("common:invoiceTo")}
                    </span>
                    <span className="text-sm text-gray-500 block">
                      {data?.user_info?.name}
                      <br />
                      {data?.user_info?.address}
                      <br />
                      {data?.user_info?.city}, {data?.user_info?.country},{" "}
                      {data?.user_info?.zipCode}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="overflow-hidden lg:overflow-visible px-8 ">
        <TableContainer className="mb-8">
          <Table>
            <TableHeader className=" dark:border-white border-gray-200">
              <tr>
                {/* <TableCell>{t('common:sr')}</TableCell> */}
                <TableCell>{t("common:productName")}</TableCell>
                <TableCell className="text-center">
                  {t("common:quantity")}
                </TableCell>
                <TableCell>{t("common:itemPrice")}</TableCell>
                <TableCell className="text-right">
                  {" "}
                  {t("common:amount")}
                </TableCell>
              </tr>
            </TableHeader>

            <OrderTable
              data={data}
              currency={currency}
              getNumberTwo={getNumberTwo}
            />
          </Table>
        </TableContainer>
      </div>

      <div className="border-t border-gray-100 p-8 py-6  dark:border-white">
        <div className="flex justify-between">
          <div className="">
            <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600  block">
              Sub Total
            </span>
            <span className="text-sm text-gray-500  font-semibold font-serif block">
              {currency}
              {getNumberTwo(data?.subTotal)}
            </span>
          </div>
          <div className="">
            <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600  block">
              VAT
            </span>
            <span className="text-sm text-gray-500  font-semibold font-serif block">
              {currency}
              {getNumberTwo(data?.vat)}
            </span>
          </div>

          {/* 
              <div className="mb-3 md:mb-0 lg:mb-0   flex  flex-row md:flex-col justify-between">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600  block">
                  {t('ShippingMethod')}
                </span>
                <span className="text-sm text-gray-500  font-semibold font-serif block">
                  {data?.shippingOption}
                </span>
              </div> */}

          <div className="">
            <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600  block">
              Shipping Cost
            </span>
            <span className="text-sm text-gray-500  font-semibold font-serif block">
              {currency}
              {getNumberTwo(data?.shippingCost)}
            </span>
          </div>

          <div className="">
            <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600  block">
              Discount
            </span>
            <span className="text-sm text-gray-500  font-semibold font-serif block">
              {currency}
              {getNumberTwo(data?.discount)}
            </span>
          </div>

          <div className="">
            <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-700 block">
              Total
            </span>
            <span className="text-base text-red-500 font-semibold font-serif text-right">
              {currency}
              {getNumberTwo(data?.total)}
            </span>
          </div>

          {/* <TableCell>
                <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                  <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 block">
                    {t('common:shippingMethod')}
                  </span>
                  <span className="text-sm text-gray-500 font-semibold font-serif block">
                  
                    {data?.shippingCarrier && !invoLoading && data?.shippingOption}
                  </span>
                </div>
                </TableCell> */}

          {/* <TableCell>
                <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                  <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 block">
                    {t('common:discount')}
                  </span>
                  <span className="text-sm text-gray-500 font-semibold font-serif block">
                    {currency ? currency : '$'}
                    {parseFloat(data.discount).toFixed(2)}
                  </span>
                </div>   
                </TableCell>

                <TableCell>
                <div className="flex flex-col sm:flex-wrap">
                  <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 block">
                    {t('common:totalAmount')}
                  </span>
                  <span className="text-2xl font-serif font-bold text-red-500 block">
                    {currency ? currency : '$'}
                    {parseFloat(data.total).toFixed(2)}
                  </span>
                </div>
                </TableCell> */}
        </div>
      </div>
    </div>
  );
};

export default Invoice;
