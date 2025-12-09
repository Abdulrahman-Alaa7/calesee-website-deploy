import React from "react";

import { AppStorage } from "./AppContext";
import { ApolloWrapper } from "@/utils/apollo-provider";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ApolloWrapper>
      <AppStorage>{children}</AppStorage>
    </ApolloWrapper>
  );
}
