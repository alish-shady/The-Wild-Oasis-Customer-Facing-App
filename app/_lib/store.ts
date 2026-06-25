import { configureStore } from "@reduxjs/toolkit";
import reservationReducer from "@/app/_lib/slices/reservationSlice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      reservation: reservationReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
