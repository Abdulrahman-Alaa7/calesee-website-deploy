"use client";

import { ApolloClient, InMemoryCache } from "@apollo/client";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";

const uri = process.env.NEXT_PUBLIC_SERVER_URI;

if (!uri) {
  throw new Error("NEXT_PUBLIC_SERVER_URI is not defined");
}

export const uploadClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new UploadHttpLink({
    uri,
    credentials: "include",
    headers: {
      "Apollo-Require-Preflight": "true",
    },
  }),
});
