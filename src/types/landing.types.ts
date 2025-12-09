export type Slides = {
  id: string;
  titleEn: string;
  titleAr: string;
  image: string;
  descEn: string;
  descAr: string;
  link: string;
  linkTitleEn: string;
  linkTitleAr: string;
  createdAt: string;
  updatedAt: string;
};

export type Settings = {
  id: string;
  shippingPrice: number;
  freeShippingPrice: number;
  freeShipDescEn: string;
  freeShipDescAr: string;
  address: string;
  airPlaneMode: string;
};
