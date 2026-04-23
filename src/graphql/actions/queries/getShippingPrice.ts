import { gql } from "@apollo/client";

export const GET_SHIPPING_PRICE = gql`
  query GetShippingPrice($governorate: String!) {
    getShippingPrice(governorate: $governorate) {
      price
      isDefault
    }
  }
`;
