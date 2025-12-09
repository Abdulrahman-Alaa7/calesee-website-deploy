import { gql } from "@apollo/client";

export const GET_LANDINGS = gql`
  query {
    getLandings {
      id
      titleEn
      titleAr
      image
      descEn
      descAr
      link
      linkTitleEn
      linkTitleAr
      createdAt
      updatedAt
    }
  }
`;
