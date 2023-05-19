import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import UpdateIcon from "@mui/icons-material/Update";
import { Box, InputBase } from "@mui/material";
import { Action } from "components/action/Action";
import withScreenSecurity from "components/common/withScreenSecurity";
import CustomDataGrid from "components/datagrid/CustomDataGrid";
import DraggableDeleteDialog from "components/dialog/DraggableDialogs";
import CustomDrawer from "components/drawer/CustomDrawer";
import HeaderModal from "components/modal/HeaderModal";
import CustomToolBar from "components/toolbar/CustomToolBar";
import moment, { unix } from "moment";
import { useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { useToggle, useWindowSize } from "react-use";
import { AppColors } from "shared/AppColors";
import { CustomDatePicker } from "../../components/datepicker/CustomDatePicker";
import {
  useGetContractType,
  useGetProductList,
} from "../../controllers/query/category-query";
import {
  useCreateSellinPrice,
  useGetSellinPrice,
} from "../../controllers/query/purchase-order-query";
import { purchaseOrderPrice } from "./LocalConstant";
import UpdateProductPrice from "./components/UpdateProductPrice";

function PurchasePriceScreen({ screenAuthorization }) {
  const [params, setParams] = useState({
    page: 1,
    page_size: 50,
  });
  const [isAdd, setIsAdd] = useToggle(false);
  const [isRemove, setIsRemove] = useToggle(false);
  const [itemSelected, setItemSelected] = useState(null);
  const [isOpenDrawer, setOpenDrawer] = useToggle(false);
  const { height } = useWindowSize();
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      productPrices: [],
    },
    // resolver: yupResolver(purchaseOrderSchema),
  });
  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = methods;
  const productPrices = useWatch({
    control,
    name: "productPrices",
  });

  const { isLoading: isLoadingProduct, data: product } = useGetProductList();
  const { isLoading: isLoadingContract, data: contract } = useGetContractType();
  const { isLoading: isLoadingSellinPrice, data: sellinPrices } =
    useGetSellinPrice();
  const createPurchasePrices = useCreateSellinPrice();

  const onSubmit = async (data) => {
    let productPriceParams = data?.productPrices.map((pro) => {
      return {
        productCode: pro?.code,
        endedDate: moment(pro?.endedDate),
        priceBeforeVat: pro?.priceBeforeVat,
        startedDate: moment(pro?.startedDate),
        status: "active",
        vat: pro?.vat,
      };
    });
    if (productPriceParams.length > 0)
      await createPurchasePrices.mutateAsync(productPriceParams);
    reset();
  };

  let actions = [
    {
      title: "Cập nhật",
      callback: handleSubmit(onSubmit),
      icon: <UpdateIcon />,
      describe: "Thêm bản ghi mới",
      disabled: false,
    },
  ];
  const extraActions = [
    {
      title: "Sửa",
      callback: async (item) => {
        setOpenDrawer((pre) => !pre);
        setItemSelected(
          sellinPrices?.find((el) => el?.productEntity?.code === item?.code)
        );
      },
      icon: <EditIcon />,
      color: AppColors.secondary,
    },
    {
      title: "Xóa",
      callback: (item) => {
        setIsRemove();
        setItemSelected(item);
      },
      icon: <DeleteIcon />,
      color: AppColors.error,
    },
  ];

  // const mergedProductContractData = useMemo(() => {
  //   let mergedProducts = product?.content
  //     ?.map((pro) => {
  //       return contract?.content?.map((ctr) => {
  //         let newPro = { ...pro };
  //         newPro["contract"] = ctr;
  //         return newPro;
  //       });
  //     })
  //     .flat();
  //   return mergedProducts?.map((pro, index) => {
  //     return {
  //       ...pro,
  //       id: index,
  //     };
  //   });
  // }, [product, contract]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box>
        <CustomToolBar actions={actions} containSearch={false} />
      </Box>
      <FormProvider {...methods}>
        <CustomDataGrid
          params={params}
          setParams={setParams}
          sx={{ height: height - 64 - 71 - 24 - 20 }} // Toolbar - Searchbar - TopPaddingToolBar - Padding bottom
          isLoading={isLoadingProduct || isLoadingContract}
          totalItem={100}
          isSelectable
          isEditable={(params) => {
            return !sellinPrices?.find(
              (el) => el?.productEntity?.code === params?.row?.code
            );
          }}
          columns={[
            purchaseOrderPrice[0],
            purchaseOrderPrice[1],
            purchaseOrderPrice[2],
            {
              field: "priceBeforeVat",
              headerName: "Giá trước thuế",
              sortable: false,
              minWidth: 150,
              type: "number",
              editable: true,
              headerAlign: "center",
              align: "center",
              renderCell: (params) => {
                const price = productPrices?.find((el) => el.id === params.id);
                const sellinPrice = sellinPrices?.find(
                  (el) => el?.productEntity?.code === params?.row?.code
                );
                return sellinPrice
                  ? sellinPrice?.priceBeforeVat
                  : price
                  ? price?.priceBeforeVat
                  : "Nhập giá tiền";
              },
              renderEditCell: (params) => {
                const index = productPrices?.findIndex(
                  (el) => el.id === params.id
                );
                const value =
                  index !== -1 ? productPrices[index]?.priceBeforeVat : null;
                return (
                  <Controller
                    name={`productPrices.${index}.priceBeforeVat`}
                    control={control}
                    render={({ field: { onChange } }) => (
                      <InputBase
                        inputProps={{ min: 0 }}
                        sx={{
                          "& .MuiInputBase-input": {
                            textAlign: "right",
                            fontSize: 14,
                            "&::placeholder": {
                              fontSize: 13,
                              opacity: 0.7,
                              fontStyle: "italic",
                            },
                          },
                        }}
                        placeholder="Nhập giá tiền"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                );
              },
            },
            {
              field: "vat",
              headerName: "Thuế VAT (%)",
              sortable: false,
              minWidth: 150,
              type: "number",
              editable: true,
              headerAlign: "center",
              align: "center",
              renderCell: (params) => {
                const price = productPrices?.find((el) => el.id === params.id);
                const sellinPrice = sellinPrices?.find(
                  (el) => el?.productEntity?.code === params?.row?.code
                );
                return sellinPrice
                  ? sellinPrice?.vat
                  : price
                  ? price?.vat
                  : "Nhập thuế ";
              },
              renderEditCell: (params) => {
                const index = productPrices?.findIndex(
                  (el) => el.id === params.id
                );
                const value = index !== -1 ? productPrices[index]?.vat : null;
                return (
                  <Controller
                    name={`productPrices.${index}.vat`}
                    control={control}
                    render={({ field: { onChange } }) => (
                      <InputBase
                        inputProps={{ min: 0 }}
                        sx={{
                          "& .MuiInputBase-input": {
                            textAlign: "right",
                            fontSize: 14,
                            "&::placeholder": {
                              fontSize: 13,
                              opacity: 0.7,
                              fontStyle: "italic",
                            },
                          },
                        }}
                        placeholder="Nhập giá tiền"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                );
              },
            },
            {
              field: "startedDate",
              headerName: "Ngày bắt đầu",
              sortable: false,
              minWidth: 150,
              type: "date",
              editable: true,
              renderCell: (params) => {
                const product = productPrices?.find(
                  (el) => el.id === params.id
                );
                const sellinPrice = sellinPrices?.find(
                  (el) => el?.productEntity?.code === params?.row?.code
                );
                return sellinPrice
                  ? unix(sellinPrice?.startedDate).format("DD-MM-YYYY")
                  : product
                  ? moment(product?.startedDate).format("DD-MM-YYYY")
                  : "Nhập ngày bắt đầu";
              },
              renderEditCell: (params) => {
                const index = productPrices?.findIndex(
                  (el) => el.id === params.id
                );

                const value =
                  index !== -1 ? productPrices[index]?.startedDate : null;
                return (
                  <Controller
                    name={`productPrices.${index}.startedDate`}
                    control={control}
                    render={({ field: { onChange } }) => (
                      <CustomDatePicker value={value} onChange={onChange} />
                    )}
                  />
                );
              },
            },
            {
              field: "endedDate",
              headerName: "Ngày hết hạn",
              sortable: false,
              minWidth: 150,
              type: "date",
              editable: true,
              renderCell: (params) => {
                const product = productPrices?.find(
                  (el) => el.id === params.id
                );
                const sellinPrice = sellinPrices?.find(
                  (el) => el?.productEntity?.code === params?.row?.code
                );
                return sellinPrice
                  ? unix(sellinPrice?.endedDate).format("DD-MM-YYYY")
                  : product
                  ? moment(product?.endedDate).format("DD-MM-YYYY")
                  : "Nhập ngày hết hạn";
              },
              renderEditCell: (params) => {
                const index = productPrices?.findIndex(
                  (el) => el.id === params.id
                );
                const value =
                  index !== -1 ? productPrices[index]?.endedDate : null;
                return (
                  <Controller
                    name={`productPrices.${index}.endedDate`}
                    control={control}
                    render={({ field: { onChange } }) => (
                      <CustomDatePicker value={value} onChange={onChange} />
                    )}
                  />
                );
              },
            },
            {
              field: "action",
              headerName: "Hành động",
              headerAlign: "center",
              align: "center",
              sortable: false,
              width: 125,
              minWidth: 150,
              maxWidth: 200,
              type: "actions",
              getActions: (params) => {
                return [
                  ...extraActions.map((extraAction, index) => (
                    <Action
                      item={params.row}
                      key={index}
                      extraAction={extraAction}
                      onActionCall={extraAction.callback}
                    />
                  )),
                ];
              },
            },
          ]}
          rows={product?.content ? product?.content : []}
          onSelectionChange={(ids) => {
            let results = product?.content?.filter((pro) =>
              ids.includes(pro?.id)
            );
            setValue("productPrices", results);
          }}
        />
      </FormProvider>
      <CustomDrawer open={isOpenDrawer} onClose={setOpenDrawer}>
        <HeaderModal
          onClose={setOpenDrawer}
          title="Sửa thông tin giá sản phẩm"
        />
        <UpdateProductPrice currPrice={itemSelected} setIsAdd={setOpenDrawer} />
      </CustomDrawer>
      <DraggableDeleteDialog
        // disable={isLoadingRemove}
        open={isRemove && itemSelected}
        handleOpen={setIsRemove}
        callback={(flag) => {}}
      />
    </Box>
  );
}

const SCR_ID = "SCR_PURCHASE_PRICE";
export default withScreenSecurity(PurchasePriceScreen, SCR_ID, true);
