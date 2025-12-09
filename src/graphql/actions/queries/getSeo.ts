import { gql } from "@apollo/client";

export const GET_SEO_BY_PAGE = gql`
  query GetSeoByPage($page: String!) {
    getSeoByPage(page: $page) {
      id
      page
      titleEn
      titleAr
      descEn
      descAr
      keywordsEn
      keywordsAr
      createdAt
      updatedAt
    }
  }
`;
