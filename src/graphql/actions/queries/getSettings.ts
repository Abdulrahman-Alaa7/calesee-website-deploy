import { gql } from "@apollo/client";

export const GET_SETTINGS = gql`
  query {
    getSettings {
      id
      defaultShippingPrice
      freeShippingPrice
      freeShipDescEn
      freeShipDescAr
      address
      airPlaneMode
    }
  }
`;
