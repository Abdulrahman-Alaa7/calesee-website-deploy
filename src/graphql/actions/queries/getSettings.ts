import { gql } from "@apollo/client";

export const GET_SETTINGS = gql`
  query {
    getSettings {
      id
      shippingPrice
      freeShippingPrice
      freeShipDescEn
      freeShipDescAr
      address
      airPlaneMode
    }
  }
`;
