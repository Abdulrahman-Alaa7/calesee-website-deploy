"use client";
import React, { useContext, useState } from "react";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useLocale, useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { toast } from "sonner";
import { Textarea } from "../../components/ui/textarea";
import { AppContext } from "../../utils/AppContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaMoneyCheck } from "react-icons/fa6";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { HiLockClosed } from "react-icons/hi";
import dataGov from "../../../public/database/governorates.json";
import dataCit from "../../../public/database/cities.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { TbShoppingBagX } from "react-icons/tb";
import { Link } from "../../i18n/routing";
import MainBtn from "../../components/ui/main-button";
import { MdAddIcCall } from "react-icons/md";
import { MapPinPlus } from "lucide-react";
import MainLoading from "../../components/ui/main-loading";
import { checkoutCities, checkoutGov } from "@/types/checkouy.types";
import { ShippingItem } from "@/types/product.types";
import { GET_SETTINGS } from "@/graphql/actions/queries/getSettings";
import { useMutation, useQuery } from "@apollo/client/react";
import { Settings } from "@/types/landing.types";
import { CREATE_ORDER } from "@/graphql/actions/mutations/CreateOrder";
import { trackEvent } from "@/utils/trackEvent";
import { hashValue } from "@/utils/hash";

interface SettingsData {
  getSettings: Settings[];
}

const CheckoutPage = () => {
  const [createOrderMutation, { loading: createOrderLoading }] =
    useMutation(CREATE_ORDER);

  const { data: settingsData, loading: getSettingsLoading } =
    useQuery<SettingsData>(GET_SETTINGS);

  const settings = settingsData?.getSettings[0];
  const shippingPrice = settings?.shippingPrice;
  const freeShippingPrice = settings?.freeShippingPrice;

  const lang = useLocale();
  const tHeader = useTranslations("AllHeader");
  const tHomeProducts = useTranslations("HomeProducts");
  const tCheckout = useTranslations("CheckOut");

  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [selectedSecGovernorate, setSelectedSecGovernorate] = useState("");
  const [showPhoneTwo, setShowPhoneTwo] = useState<boolean>(false);
  const [showAddresssTwo, setShowAddresssTwo] = useState<boolean>(false);
  const [, setOpen] = useState(false);

  const { shippingList, handleDeleteAllShippingList, loadingStates } =
    useContext(AppContext);

  const order = shippingList;
  const loading = loadingStates.fetching;

  function sortDataByLocale<T extends Record<string, string>>(
    data: T[],
    arKey: keyof T,
    enKey: keyof T,
    lang: string,
  ): T[] {
    return [...data].sort((a, b) =>
      lang === "ar"
        ? String(a[arKey]).localeCompare(String(b[arKey]), "ar", {
            sensitivity: "base",
          })
        : String(a[enKey]).localeCompare(String(b[enKey]), "en", {
            sensitivity: "base",
          }),
    );
  }

  const govNotSorted = dataGov.dataGov;

  const gov = sortDataByLocale<checkoutGov>(
    govNotSorted,
    "governorate_name_ar",
    "governorate_name_en",
    lang,
  );

  const cit = dataCit.dataCit;

  const filteredCities = sortDataByLocale<checkoutCities>(
    cit.filter((city) => city.governorate_id === selectedGovernorate),
    "city_name_ar",
    "city_name_en",
    lang,
  );
  const filteredSecCities = sortDataByLocale<checkoutCities>(
    cit.filter((city) => city.governorate_id === selectedSecGovernorate),
    "city_name_ar",
    "city_name_en",
    lang,
  );

  const defaultValues = {
    email: "",
    phone_number: "",
    secPhone_number: "",
    fullName: "",
    address: "",
    governorate: "",
    city: "",
    secAddress: "",
    secGovernorate: "",
    secCity: "",
    note: "",
  };

  const checkOutSchema = z.object({
    email: z
      .string()
      .min(1, {
        message: `${tCheckout("validEmailMin")}`,
      })
      .email({
        message: `${tCheckout("validEmailValid")}`,
      }),
    phone_number: z
      .string()
      .min(11, {
        message: `${tCheckout("validPhoneNum")}`,
      })
      .max(11, { message: `${tCheckout("validPhoneNum")}` })
      .regex(/^(010|011|012|015)\d{8}$/, {
        message: `${tCheckout("validPhoneNum")}`,
      }),
    secPhone_number: z
      .string()
      .optional()
      .refine(
        (value?: string) => {
          if (!value) return true;
          return value.length === 11 && /^(010|011|012|015)\d{8}$/.test(value);
        },
        {
          message: `${tCheckout("validPhoneNum")}`,
        },
      ),

    fullName: z
      .string()
      .min(3, { message: `${tCheckout("validfullNameMin")}` })
      .max(50, {
        message: `${tCheckout("validfullNameMax")}`,
      }),
    address: z
      .string()
      .min(3, { message: `${tCheckout("validAddressMin")}` })
      .max(150, {
        message: `${tCheckout("validAddressMax")}`,
      }),
    governorate: z
      .string()
      .min(3, { message: `${tCheckout("validGovernorateMin")}` })
      .max(50, {
        message: `${tCheckout("validGovernorateMax")}`,
      }),
    city: z
      .string()
      .min(3, { message: `${tCheckout("validCityMin")}` })
      .max(50, {
        message: `${tCheckout("validCityMax")}`,
      }),
    secAddress: z.string().optional(),
    secGovernorate: z.string().optional(),
    secCity: z.string().optional(),
    note: z
      .string()
      .max(250, {
        message: `${tCheckout("validNoteMax")}`,
      })
      .optional(),
  });

  type CheckoutValues = z.infer<typeof checkOutSchema>;

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkOutSchema),
    defaultValues,
  });

  const onSubmit = async (data: CheckoutValues) => {
    try {
      if (order.length >= 1) {
        const NewData = {
          lang: lang,
          orderItems: order.map((item) => {
            return {
              productId: item.id,
              name: item.name,
              img: item.mainImage,
              price: item.price,
              color: item.color,
              size: item.size,
              quantity: item.quantity,
            };
          }),
          email: data.email,
          phone_number: data.phone_number,
          secPhone_number: data.secPhone_number,
          fullName: data.fullName,
          address: data.address,
          governorate: data.governorate,
          city: data.city,
          secAddress: data.secAddress,
          secGovernorate: data.secGovernorate,
          secCity: data.secCity,
          note: data.note,
        };

        await createOrderMutation({
          variables: {
            input: NewData,
          },
        });

        const emailHash = await hashValue(data.email);
        const phoneHash = await hashValue(data.phone_number);

        trackEvent({
          event: "purchase",
          order_id: Date.now().toString(),
          email_hash: emailHash,
          phone_hash: phoneHash,
          value:
            freeShippingPrice && sumPrice(order) > freeShippingPrice
              ? sumPrice(order)
              : shippingPrice
                ? sumPrice(order) + shippingPrice
                : sumPrice(order),
          currency: "EGP",
          item_count: order.length,
        });
        form.reset();
        toast.success(`${tCheckout("successSend")}`);
        setOpen(true);
        handleDeleteAllShippingList();
      } else {
        toast.error(`${tHeader("shippingListTitle")}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(`${tHomeProducts("msgError")}`);
    }
  };

  const sumPrice = (order: ShippingItem[]) => {
    let TotalPrice = 0;
    for (let i = 0; i < order.length; i++) {
      TotalPrice += order[i].price * order[i].quantity;
    }
    return TotalPrice;
  };

  const handleFormSubmit = form.handleSubmit(onSubmit, (errors) => {
    if (Object.keys(errors).length > 0) {
      toast.error(`${tCheckout("formErrorReq")}`);
    }
  });

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center my-12">
          <MainLoading />
        </div>
      ) : (
        <>
          {order && order.length > 0 ? (
            <div className="fadeIn grid grid-cols-3">
              <div
                className={`lg:col-span-2 bg-background border border-primary col-span-3 space-y-8 p-4 md:px-12 rounded-3xl mb-6 ${
                  lang == "ar" ? "lg:rounded-r-none" : "lg:rounded-l-none"
                }  lg:rounded-r-3xl lg:order-first order-last`}
              >
                <div className="rounded-md mt-3">
                  <div className="text-sm text-[#666] flex justify-center items-center gap-2 mx-auto mb-3">
                    <HiLockClosed size={16} /> {tCheckout("secAndEnc")}
                  </div>
                  <Form {...form}>
                    <h2 className="uppercase tracking-wide text-lg font-semibold mb-3">
                      {tCheckout("contactTit")}
                    </h2>
                    <form onSubmit={handleFormSubmit} className="">
                      <div className="flex flex-col justify-center mx-auto items-center gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="w-full lg:w-[70%]">
                              <FormLabel>{tCheckout("emailInput")}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={`${tCheckout("emailInput")}`}
                                  {...field}
                                  className="py-6 px-4 rounded-full"
                                  disabled={
                                    getSettingsLoading || createOrderLoading
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone_number"
                          render={({ field }) => (
                            <FormItem className="w-full lg:w-[70%]">
                              <FormLabel>
                                {tCheckout("phoneNum")}{" "}
                                <span
                                  className={`!fadeIn ${
                                    field.value.length != 11 && "text-red-500"
                                  } ${
                                    field.value &&
                                    field.value.length === 11 &&
                                    "text-green-500"
                                  }`}
                                >
                                  {" "}
                                  {field.value.length > 0 &&
                                    `( ${field.value.length} / 11 )`}{" "}
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={`${tCheckout("phoneNum")}`}
                                  type="number"
                                  {...field}
                                  className="py-6 px-4 rounded-full"
                                  onWheel={(
                                    e: React.WheelEvent<HTMLInputElement>,
                                  ) => e.currentTarget.blur()}
                                  disabled={
                                    getSettingsLoading || createOrderLoading
                                  }
                                />
                              </FormControl>
                              <FormDescription>
                                {tCheckout("phoneNumMsg")}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />{" "}
                        <div className="w-full lg:w-[70%] ">
                          <Button
                            variant={`outline`}
                            type="button"
                            className="flex justify-center items-center gap-2 py-2 px-3 rounded-full border"
                            onClick={() => setShowPhoneTwo(!showPhoneTwo)}
                            disabled={getSettingsLoading || createOrderLoading}
                          >
                            <MdAddIcCall />
                            {tCheckout("secPhone")}
                          </Button>
                        </div>
                        {showPhoneTwo && (
                          <FormField
                            control={form.control}
                            name="secPhone_number"
                            render={({ field }) => (
                              <FormItem className="w-full lg:w-[70%] fadeIn">
                                <FormLabel>
                                  {tCheckout("phoneNum")} {"  "} (
                                  {tCheckout("optionalWord")})
                                  <span
                                    className={`!fadeIn ${
                                      field.value &&
                                      field.value.length != 11 &&
                                      "text-red-500"
                                    } ${
                                      field.value &&
                                      field.value.length === 11 &&
                                      "text-green-500"
                                    }`}
                                  >
                                    {" "}
                                    {field.value &&
                                      field.value.length > 0 &&
                                      `( ${field.value.length} / 11 )`}{" "}
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={`${tCheckout("phoneNum")}`}
                                    type="number"
                                    {...field}
                                    className="py-6 px-4 rounded-full"
                                    onWheel={(
                                      e: React.WheelEvent<HTMLInputElement>,
                                    ) => e.currentTarget.blur()}
                                    disabled={
                                      getSettingsLoading || createOrderLoading
                                    }
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        <h2 className="uppercase tracking-wide text-lg font-semibold mb-3 w-full">
                          {tCheckout("infoShipping")}
                        </h2>
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem className="w-full lg:w-[70%]">
                              <FormLabel>
                                {tCheckout("fullNameInput")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={`${tCheckout(
                                    "fullNameInputPlace",
                                  )}`}
                                  {...field}
                                  className="py-6 px-4 rounded-full"
                                  disabled={
                                    getSettingsLoading || createOrderLoading
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 w-full lg:w-[70%] gap-3">
                          <FormField
                            control={form.control}
                            name="governorate"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>{tCheckout("govTit")}</FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    const selectedGov = gov.find(
                                      (g) =>
                                        (lang === "ar"
                                          ? g.governorate_name_ar
                                          : g.governorate_name_en) === value,
                                    );
                                    setSelectedGovernorate(
                                      selectedGov ? selectedGov.id : "",
                                    );
                                  }}
                                  defaultValue={field.value}
                                  disabled={
                                    getSettingsLoading || createOrderLoading
                                  }
                                >
                                  <FormControl className="py-6">
                                    <SelectTrigger
                                      className={`w-full rounded-full px-4 cursor-pointer ${
                                        lang === "ar" && "flex-row-reverse"
                                      }`}
                                    >
                                      <SelectValue
                                        placeholder={`${tCheckout("govPlace")}`}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="py-2">
                                    {gov.map((gov, index) => (
                                      <SelectItem
                                        key={index}
                                        value={
                                          lang === "ar"
                                            ? gov.governorate_name_ar
                                            : gov.governorate_name_en
                                        }
                                        className={`flex flex-col justify-center py-2 px-4 cursor-pointer ${
                                          lang === "ar"
                                            ? "items-end"
                                            : "items-start"
                                        } gap-2`}
                                      >
                                        {lang === "ar"
                                          ? gov.governorate_name_ar
                                          : gov.governorate_name_en}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>{tCheckout("cityTit")}</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  disabled={!selectedGovernorate}
                                >
                                  <FormControl className="py-6">
                                    <SelectTrigger
                                      className={`w-full rounded-full px-4 cursor-pointer ${
                                        lang === "ar" && "flex-row-reverse"
                                      }`}
                                    >
                                      <SelectValue
                                        placeholder={`${tCheckout(
                                          "cityPlace",
                                        )}`}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="py-2">
                                    {filteredCities.map((city, index) => (
                                      <SelectItem
                                        key={index}
                                        value={
                                          lang === "ar"
                                            ? city.city_name_ar
                                            : city.city_name_en
                                        }
                                        className={`flex flex-col justify-center px-4 py-2  cursor-pointer ${
                                          lang === "ar"
                                            ? "items-end"
                                            : "items-start"
                                        } gap-2`}
                                      >
                                        {lang === "ar"
                                          ? city.city_name_ar
                                          : city.city_name_en}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="w-full lg:w-[70%]">
                              <FormLabel>{tCheckout("addressTit")}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={`${tCheckout("addressPlace")}`}
                                  {...field}
                                  className="py-6 px-4 rounded-full"
                                  disabled={
                                    getSettingsLoading || createOrderLoading
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="w-full lg:w-[70%] ">
                          <Button
                            variant={`outline`}
                            type="button"
                            className="flex justify-center items-center gap-2 py-2 px-4 rounded-full border"
                            onClick={() => setShowAddresssTwo(!showAddresssTwo)}
                            disabled={getSettingsLoading || createOrderLoading}
                          >
                            <MapPinPlus size={20} />
                            {tCheckout("secAddress")}
                          </Button>
                        </div>
                        {showAddresssTwo && (
                          <div className={`SecAdess fadeIn w-full lg:w-[70%] `}>
                            <div className="grid grid-cols-1 md:grid-cols-2  gap-3">
                              <FormField
                                control={form.control}
                                name="secGovernorate"
                                render={({ field }) => (
                                  <FormItem className="w-full">
                                    <FormLabel>
                                      {tCheckout("govTit")} {"  "} (
                                      {tCheckout("optionalWord")})
                                    </FormLabel>
                                    <Select
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        const selectedSecGov = gov.find(
                                          (g) =>
                                            (lang === "ar"
                                              ? g.governorate_name_ar
                                              : g.governorate_name_en) ===
                                            value,
                                        );
                                        setSelectedSecGovernorate(
                                          selectedSecGov
                                            ? selectedSecGov.id
                                            : "",
                                        );
                                      }}
                                      defaultValue={field.value}
                                      disabled={
                                        getSettingsLoading || createOrderLoading
                                      }
                                    >
                                      <FormControl className="py-6">
                                        <SelectTrigger
                                          className={`px-4 rounded-full w-full cursor-pointer ${
                                            lang === "ar" && "flex-row-reverse"
                                          }`}
                                        >
                                          <SelectValue
                                            placeholder={`${tCheckout(
                                              "govPlace",
                                            )}`}
                                          />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="py-2">
                                        {gov.map((gov, index) => (
                                          <SelectItem
                                            key={`${gov}_${index}`}
                                            value={
                                              lang === "ar"
                                                ? gov.governorate_name_ar
                                                : gov.governorate_name_en
                                            }
                                            className={`flex flex-col justify-center py-2 px-4 cursor-pointer ${
                                              lang === "ar"
                                                ? "items-end"
                                                : "items-start"
                                            } gap-2`}
                                          >
                                            {lang === "ar"
                                              ? gov.governorate_name_ar
                                              : gov.governorate_name_en}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="secCity"
                                render={({ field }) => (
                                  <FormItem className="w-full">
                                    <FormLabel>
                                      {tCheckout("cityTit")}
                                      {"  "} ({tCheckout("optionalWord")})
                                    </FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      disabled={
                                        !selectedSecGovernorate ||
                                        getSettingsLoading ||
                                        createOrderLoading
                                      }
                                    >
                                      <FormControl className="py-6">
                                        <SelectTrigger
                                          className={`px-4 rounded-full w-full cursor-pointer ${
                                            lang === "ar" && "flex-row-reverse"
                                          }`}
                                        >
                                          <SelectValue
                                            placeholder={`${tCheckout(
                                              "cityPlace",
                                            )}`}
                                          />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="py-2">
                                        {filteredSecCities.map(
                                          (city, index) => (
                                            <SelectItem
                                              key={`${city}_${index}`}
                                              value={
                                                lang === "ar"
                                                  ? city.city_name_ar
                                                  : city.city_name_en
                                              }
                                              className={`flex flex-col justify-center py-2 px-4 cursor-pointer ${
                                                lang === "ar"
                                                  ? "items-end"
                                                  : "items-start"
                                              } gap-2 px-4 rounded-full `}
                                            >
                                              {lang === "ar"
                                                ? city.city_name_ar
                                                : city.city_name_en}
                                            </SelectItem>
                                          ),
                                        )}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={form.control}
                              name="secAddress"
                              render={({ field }) => (
                                <FormItem className="mt-3">
                                  <FormLabel>
                                    {tCheckout("addressTit")} {"  "} (
                                    {tCheckout("optionalWord")})
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={`${tCheckout(
                                        "addressPlace",
                                      )}`}
                                      {...field}
                                      className="py-6 px-4 rounded-full"
                                      disabled={
                                        getSettingsLoading || createOrderLoading
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                        <FormField
                          control={form.control}
                          name="note"
                          render={({ field }) => (
                            <FormItem className="w-full lg:w-[70%]">
                              <FormLabel>{tCheckout("noteTit")}</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={`${tCheckout("notePlace")}`}
                                  className="resize-none w-full min-h-[100px] max-h-[120px] p-4"
                                  {...field}
                                  disabled={
                                    getSettingsLoading || createOrderLoading
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <br />
                      </div>
                      <div className="rounded-md mb-6 mt-0">
                        <section>
                          <h2 className="uppercase tracking-wide text-lg font-semibold mt-2 mb-4">
                            {tCheckout("payTit")}
                          </h2>
                          <fieldset className="flex flex-col justify-center items-center gap-3   lg:w-[70%] w-full mx-auto">
                            <label className="inline-flex rounded-full justify-between w-full items-center z-10  p-4 border border-primary text-primary bg-background/80 font-bold lg:hover:opacity-60 transition-all cursor-pointer duration-500 relative translate-y-0 opacity-100 overflow-hidden">
                              <div className="inline-flex items-center justify-center gap-2 relative z-10">
                                <FaMoneyBillWave size={32} />
                                <p className="font-semibold w-full whitespace-nowrap top-1 left-2 transition-all duration-700 opacity-100">
                                  {tCheckout("cod")}
                                </p>
                              </div>
                              <RadioGroup defaultValue="cod">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="cod"
                                    id="r1"
                                    disabled={
                                      getSettingsLoading || createOrderLoading
                                    }
                                  />
                                </div>
                              </RadioGroup>
                            </label>
                            <label className="opacity-20 rounded-full inline-flex cursor-no-drop justify-between w-full items-center z-10  p-4 border border-primary bg-background/80 font-bold transition-all duration-500 relative translate-y-0 overflow-hidden">
                              <div className="inline-flex items-center justify-center gap-2 relative z-10">
                                <FaMoneyCheck size={32} />
                                <p className="font-semibold w-full whitespace-nowrap top-1 left-2 transition-all duration-700 opacity-100">
                                  {tCheckout("payOnline")}
                                </p>
                              </div>
                              <RadioGroup disabled>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="add"
                                    id="id_test"
                                    className="border-foreground"
                                    disabled={
                                      getSettingsLoading || createOrderLoading
                                    }
                                  />
                                </div>
                              </RadioGroup>
                            </label>
                          </fieldset>
                        </section>
                      </div>
                      <Button
                        variant={`default`}
                        type="submit"
                        className="submit-button px-4 py-6 rounded-full md:w-[50%] mx-auto flex justify-center items-center mb-12 mt-8 text-white focus:ring focus:outline-none w-full text-lg font-semibold transition-colors"
                        disabled={createOrderLoading || getSettingsLoading}
                      >
                        {getSettingsLoading || createOrderLoading ? (
                          <MainLoading />
                        ) : (
                          <>
                            {lang === "ar" ? (
                              <>
                                {tCheckout("placeOrder")}{" "}
                                {freeShippingPrice &&
                                sumPrice(order) > freeShippingPrice
                                  ? sumPrice(order)
                                  : shippingPrice &&
                                    sumPrice(order) + shippingPrice}{" "}
                                {tHeader("pound")}
                              </>
                            ) : (
                              <>
                                {tCheckout("placeOrder")} {tHeader("pound")}{" "}
                                {freeShippingPrice &&
                                sumPrice(order) > freeShippingPrice
                                  ? sumPrice(order)
                                  : shippingPrice &&
                                    sumPrice(order) + shippingPrice}
                              </>
                            )}
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
              <div className="lg:col-span-1 col-span-3 bg-background lg:mt-8 mt-0 lg:order-last order-first">
                <Accordion
                  type="single"
                  collapsible
                  defaultValue={
                    typeof window !== "undefined" && window.innerWidth >= 1024
                      ? "item-1"
                      : undefined
                  }
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="px-6 cursor-pointer">
                      {tCheckout("orderSum")}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="py-6 border-b space-y-6 px-3 md:px-8">
                        {order.map((ele: ShippingItem, index: number) => (
                          <li key={index} className="grid grid-cols-6 gap-2">
                            <div className="col-span-1 self-center">
                              <Image
                                src={ele.mainImage}
                                alt={ele.name}
                                className="rounded object-cover w-[100px] h-[70px]"
                                width={100}
                                height={70}
                              />
                            </div>
                            <div className="flex flex-col col-span-3 pt-2">
                              <span className="text-[#333] text-sm font-semi-bold line-clamp-1">
                                {ele.name.length > 28
                                  ? `${ele.name.substring(0, 28)}...`
                                  : ele.name}{" "}
                              </span>
                              <span className="flex gap-1 items-center text-[#666] text-sm font-normal">
                                {ele?.size && <>({ele.size})</>}
                                {ele?.color && (
                                  <>
                                    {" "}
                                    -{" "}
                                    <span
                                      className={`w-4 h-4 rounded-full shadow-lg `}
                                      style={{
                                        backgroundColor: `${ele?.color}`,
                                      }}
                                    ></span>
                                  </>
                                )}
                              </span>
                            </div>
                            <div className="flex items-center col-span-2 pt-2">
                              <div className="flex items-center space-x-2 text-sm justify-between gap-1">
                                <span className="text-[#666]  inline-flex gap-1 items-center">
                                  {ele.quantity} <span>x</span> {ele.price}
                                </span>
                                <span className="text-text-primary font-semibold inline-flex gap-1 items-center">
                                  {lang === "ar" ? (
                                    <>
                                      {Math.round(ele.quantity * ele.price)}{" "}
                                      {tHeader("pound")}{" "}
                                    </>
                                  ) : (
                                    <>
                                      {tHeader("pound")}{" "}
                                      {Math.round(ele.quantity * ele.price)}
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="px-8 border-b">
                  <div className="flex justify-between py-4 text-[#666] ">
                    <span>{tCheckout("subTotal")}</span>
                    <span className="font-semibold text-primary">
                      {lang === "ar" ? (
                        <>
                          {sumPrice(order)} {tHeader("pound")}
                        </>
                      ) : (
                        <>
                          {tHeader("pound")} {sumPrice(order)}
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between py-4 text-[#666] ">
                    <span>{tCheckout("shipping")}</span>
                    <span className="font-semibold text-primary">
                      {lang === "ar" ? (
                        <>
                          {freeShippingPrice &&
                          sumPrice(order) > freeShippingPrice
                            ? `${tCheckout("freeShip")}`
                            : ` ${shippingPrice} ${tHeader("pound")}`}{" "}
                        </>
                      ) : (
                        <>
                          {freeShippingPrice &&
                          sumPrice(order) > freeShippingPrice
                            ? `${tCheckout("freeShip")}`
                            : `${tHeader("pound")} ${shippingPrice}`}{" "}
                        </>
                      )}
                    </span>
                  </div>
                </div>
                <div className="font-semibold text-xl px-8 flex justify-between py-8 text-[#666] ">
                  <span>{tCheckout("total")}</span>
                  <span>
                    {lang === "ar" ? (
                      <>
                        {freeShippingPrice &&
                        sumPrice(order) > freeShippingPrice
                          ? sumPrice(order)
                          : shippingPrice &&
                            sumPrice(order) + shippingPrice}{" "}
                        {tHeader("pound")}{" "}
                      </>
                    ) : (
                      <>
                        {tHeader("pound")}{" "}
                        {freeShippingPrice &&
                        sumPrice(order) > freeShippingPrice
                          ? sumPrice(order)
                          : shippingPrice &&
                            sumPrice(order) + shippingPrice}{" "}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="fadeIn flex justify-center items-center my-6 flex-col gap-4 min-h-[450px]">
              <div className="flex justify-center items-center  flex-col gap-1">
                <TbShoppingBagX size={125} className=" text-muted-foreground" />
                <h3 className=" text-[25px] font-bold">
                  {tHeader("shippingListTitle")}
                </h3>
                <p className="text-center sm:text-[18px] text-[15px]">
                  {tHeader("shippingListdesc")}
                </p>
              </div>
              <Link href={`/store`} className="z-50">
                <MainBtn title={`${tHeader("shopNowBtn")}`} />
              </Link>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CheckoutPage;
