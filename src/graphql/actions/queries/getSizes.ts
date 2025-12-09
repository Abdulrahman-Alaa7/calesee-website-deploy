import { gql } from "@apollo/client";

export const GET_SIZES = gql`
  query {
    getSizes {
      id
      valueSize
      labelEn
      labelAr
      createdAt
      updatedAt
    }
  }
`;
