declare module "apollo-upload-client/UploadHttpLink.mjs" {
  import { ApolloLink } from "@apollo/client";

  export default class UploadHttpLink extends ApolloLink {
    constructor(options: {
      uri: string;
      credentials?: RequestCredentials;
      headers?: Record<string, string>;
    });
  }
}
