import { gql } from "@apollo/client";

export const GET_TOP_PRODUCTS = gql`
  query {
    getTopSellingProducts {
      id
      name
      category {
        id
        nameEn
        nameAr
      }
      categoryId
      price
      estimatedPrice
      sku
      soldOut
      descriptionEn
      descriptionAr
      keywordsEn
      keywordsAr
      images {
        id
        url
        filename
        isMain
        linkedColorHex
        sortOrder
        createdAt
        updatedAt
      }
      sizes {
        id
        sizeValue
        catalogSizeId
        soldout
        createdAt
        updatedAt
        colors {
          id
          hex
          catalogColorId
          nameEn
          nameAr
          soldout
          createdAt
          updatedAt
        }
      }
      createdAt
      updatedAt
    }
  }
`;
