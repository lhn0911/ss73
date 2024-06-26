import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Task } from "../../interface/index";

export const fetchTasks: any = createAsyncThunk("task/fetchAllTasks", async () => {
  const response = await axios.get("http://localhost:3000/tasks");
  return response.data;
});

export const addTaskAction: any = createAsyncThunk("task/addTask", async (task) => {
  const response = await axios.post("http://localhost:3000/tasks", task);
  return response.data;
});

export const deleteTaskAction: any = createAsyncThunk(
  "task/deleteTask",
  async (id) => {
    await axios.delete(`http://localhost:3000/tasks/${id}`);
    return id;
  }
);

export const updateTaskAction: any = createAsyncThunk(
  "task/updateTask",
  async (task: Task) => {
    await axios.patch(`http://localhost:3000/tasks/${task.id}`, {
      text: task.name,
      completed: task.completed,
    });
    return task;
  }
);

const initialState: Task[] = [];

const todoSlice = createSlice({
  name: "task",
  initialState: {
    tasks: initialState,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state, action) => {
        // pending state for fetching tasks
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        // success state for fetching tasks
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        // failure state for fetching tasks
      })
      .addCase(addTaskAction.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(deleteTaskAction.fulfilled, (state, action) => {
        const taskIdToDelete = action.payload;
        state.tasks = state.tasks.filter(task => task.id !== taskIdToDelete);
      })
      .addCase(updateTaskAction.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        state.tasks = state.tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        );
      });
  },
});

export default todoSlice.reducer;
