import { configureStore } from "@reduxjs/toolkit";
import Todo from "./reducers/ReducerTodo";
const store: any = configureStore({
  reducer: {
    tasks: Todo,
  },
});

export default store;