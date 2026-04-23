import { gql } from "@apollo/client";

export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewDto!) {
    createReview(input: $input) {
      id
    }
  }
`;
