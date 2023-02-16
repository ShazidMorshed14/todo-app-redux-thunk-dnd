import { createSlice } from "@reduxjs/toolkit";
import { v4 } from "uuid";
import { toast } from "react-toastify";

const initialState = localStorage.getItem("todoState")
  ? JSON.parse(localStorage.getItem("todoState"))
  : {
      todo: {
        title: "Todo",
        items: [],
      },
      "in-progress": {
        title: "In Progress",
        items: [],
      },
      done: {
        title: "Done",
        items: [],
      },
    };

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, { payload }) => {
      state.todo.items.push({
        id: v4(),
        name: payload,
      });

      localStorage.setItem("todoState", JSON.stringify(state));
      toast.success("Task Added Successfully!");
    },
    handleDragEndStore: (state, { payload }) => {
      const { source, destination } = payload;
      //console.log("handleDragEndStore", payload);
      if (!destination) {
        return;
      }
      if (
        destination.index === source.index &&
        destination.droppableId === source.droppableId
      ) {
        return;
      }
      // Creating a copy of item before removing it from state
      const itemCopy = { ...state[source.droppableId].items[source.index] };

      // Remove from previous items array
      state[source.droppableId].items.splice(source.index, 1);

      // Adding to new items array location
      state[destination.droppableId].items.splice(
        destination.index,
        0,
        itemCopy
      );

      localStorage.setItem("todoState", JSON.stringify(state));
    },
  },
});

// Action creators are generated for each case reducer function
export const { addTodo, handleDragEndStore } = todoSlice.actions;
export const getMyStoreState = (state) => state;

export default todoSlice.reducer;
