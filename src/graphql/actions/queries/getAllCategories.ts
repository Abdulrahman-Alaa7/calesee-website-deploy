import { gql } from "@apollo/client";

export const GET_ALL_CATEGORIES = gql`
  query {
    getCategories {
      id
      nameEn
      nameAr
      imageUrl
      createdAt
      updatedAt
    }
  }
`;
