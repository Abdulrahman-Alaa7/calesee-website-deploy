export type TrackingEventName =
  | "view_content"
  | "add_to_cart"
  | "add_to_wishlist"
  | "hero_click_button"
  | "buy_now_click"
  | "explore_collection_click"
  | "quick_view"
  | "begin_checkout"
  | "purchase";

export type TrackEventPayload = {
  event: TrackingEventName;
  product_id?: string;
  product_name?: string;
  price?: number;
  quantity?: number;
  currency?: "EGP";
  order_id?: string;
  value?: number;
  source?: string;
  email_hash?: string;
  phone_hash?: string;
  item_count?: number;
};

export const trackEvent = (payload: TrackEventPayload) => {
  if (typeof window === "undefined") return;

  window.dataLayer?.push({
    ...payload,
  });
};
