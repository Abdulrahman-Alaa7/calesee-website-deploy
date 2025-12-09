import { gql } from "@apollo/client";

export const GET_COLORS = gql`
  query {
    getColors {
      id
      hex
      nameEn
      nameAr
      createdAt
      updatedAt
    }
  }
`;
