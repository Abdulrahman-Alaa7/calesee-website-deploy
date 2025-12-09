import { gql } from "@apollo/client";

export const GET_PRODUCT = gql`
  query GetProductByIdPublic($id: String!) {
    getProductByIdPublic(id: $id) {
      product {
        id
        name
        categoryId
        category {
          id
          nameEn
          nameAr
        }
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

      relatedProducts {
        id
        name
        categoryId
        category {
          id
          nameEn
          nameAr
        }
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
  }
`;
