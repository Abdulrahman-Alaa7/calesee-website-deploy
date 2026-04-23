import { CREATE_REVIEW } from "@/graphql/actions/mutations/createReview";
import { GET_PRODUCT_REVIEWS } from "@/graphql/actions/queries/getProductReviews";
import { uploadClient } from "@/lib/upload-client";
import { Review } from "@/types/product.types";
import { useMutation, useQuery } from "@apollo/client/react";

interface GetReviewsResponse {
  getProductReviews: Review[];
}

export const useReviews = (productId: string) => {
  const { data, loading, refetch } = useQuery<GetReviewsResponse>(
    GET_PRODUCT_REVIEWS,
    {
      variables: { productId },
    },
  );

  const [createReview, { loading: creating }] = useMutation(CREATE_REVIEW, {
    client: uploadClient,
  });

  return {
    reviews: data?.getProductReviews ?? [],
    loading,
    createReview,
    creating,
    refetch,
  };
};
