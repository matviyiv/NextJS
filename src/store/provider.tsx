"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Persistor } from "redux-persist";
import { makeStore, AppStore } from "./index";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<{ store: AppStore; persistor: Persistor } | null>(null);
  // eslint-disable-next-line react-hooks/refs -- lazy init pattern recommended by Next.js + Redux docs
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    // eslint-disable-next-line react-hooks/refs -- accessing stable ref created above
    <Provider store={storeRef.current.store}>
      {/* eslint-disable-next-line react-hooks/refs -- accessing stable ref created above */}
      <PersistGate loading={null} persistor={storeRef.current.persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
