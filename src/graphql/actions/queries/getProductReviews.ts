import { gql } from "@apollo/client";

export const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($productId: String!) {
    getProductReviews(productId: $productId) {
      id
      name
      comment
      rating
      imageUrl
      createdAt
    }
  }
`;
