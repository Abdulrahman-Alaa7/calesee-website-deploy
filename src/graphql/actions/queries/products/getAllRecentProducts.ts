import { gql } from "@apollo/client";

export const GET_RECENT_PRODUCTS = gql`
  query {
    getProductsPublic {
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
