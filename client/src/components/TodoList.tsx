import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  deletetask,
  getTask,
  updatetask,
} from "../store/reducers/ReducerTodo";
import { Task } from "../interface";

export default function TodoList() {
  const tasks = useSelector((state: any) => state.tasks.task);
  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<null | number>(null);
  const [editTaskId, setEditTaskId] = useState<null | number>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState("all");

  useEffect(() => {
    dispatch(getTask());
  }, [dispatch]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === "") {
      setShowWarningModal(true);
      return;
    }
    if (editMode) {
      dispatch(
        updatetask({
          id: editTaskId,
          name: newTask,
          completed: false,
        })
      );
      setEditMode(false);
      setEditTaskId(null);
    } else {
      const addNewTask = {
        name: newTask,
        completed: false,
      };
      dispatch(addTask(addNewTask));
    }
    setNewTask("");
  };

  const handleDeleteTask = (taskId: number) => {
    dispatch(deletetask(taskId));
    setShowDeleteModal(false);
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };
  const filteredTasks = tasks.filter((task: Task) => {
    if (currentTab === "completed") {
      return task.completed;
    } else if (currentTab === "incomplete") {
      return !task.completed;
    }
    return true;
  });

  return (
    <div>
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card">
                <div className="card-body p-5">
                  <form
                    className="d-flex justify-content-center align-items-center mb-4"
                    onSubmit={handleAddTask}
                  >
                    <div className="form-outline flex-fill">
                      <input
                        type="text"
                        id="form2"
                        className="form-control"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                      />
                      <label className="form-label" htmlFor="form2">
                        {editMode ? "Cập nhật công việc" : "Nhập tên công việc"}
                      </label>
                    </div>
                    <button type="submit" className="btn btn-info ms-2">
                      {editMode ? "Cập nhật" : "Thêm"}
                    </button>
                  </form>

                  {/* Tabs navs */}
                  <ul className="nav nav-tabs mb-4 pb-2">
                    <li className="nav-item" role="presentation">
                      <a
                        className={`nav-link ${
                          currentTab === "all" ? "active" : ""
                        }`}
                        onClick={() => handleTabChange("all")}
                      >
                        Tất cả
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className={`nav-link ${
                          currentTab === "completed" ? "active" : ""
                        }`}
                        onClick={() => handleTabChange("completed")}
                      >
                        Đã hoàn thành
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className={`nav-link ${
                          currentTab === "incomplete" ? "active" : ""
                        }`}
                        onClick={() => handleTabChange("incomplete")}
                      >
                        Chưa hoàn thành
                      </a>
                    </li>
                  </ul>
                  {/* Tabs navs */}

                  {/* Tabs content */}
                  <div className="tab-content" id="ex1-content">
                    <div className="tab-pane fade show active">
                      <ul className="list-group mb-0">
                        {filteredTasks.map((task: Task) => (
                          <li
                            key={task.id}
                            className="list-group-item d-flex align-items-center justify-content-between border-0 mb-2 rounded"
                            style={{ backgroundColor: "#f4f6f7" }}
                          >
                            <div>
                              <input
                                className="form-check-input me-2"
                                type="checkbox"
                                checked={task.completed}
                                onChange={() =>
                                  dispatch(
                                    updatetask({
                                      ...task,
                                      completed: !task.completed,
                                    })
                                  )
                                }
                              />
                              {task.completed ? (
                                <s>{task.name}</s>
                              ) : (
                                <span>{task.name}</span>
                              )}
                            </div>
                            <div className="d-flex gap-3">
                              <i
                                className="fas fa-pen-to-square text-warning"
                                onClick={() => {
                                  setNewTask(task.name);
                                  setEditTaskId(task.id);
                                  setEditMode(true);
                                }}
                              ></i>
                              <i
                                className="far fa-trash-can text-danger"
                                onClick={() => {
                                  setTaskToDelete(task.id);
                                  setShowDeleteModal(true);
                                }}
                              ></i>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="overlay">
          <div className="modal-custom">
            <div className="modal-header-custom">
              <h5>Xác nhận</h5>
              <i
                className="fas fa-xmark"
                onClick={() => setShowDeleteModal(false)}
              ></i>
            </div>
            <div className="modal-body-custom">
              <p>Bạn chắc chắn muốn xóa công việc này?</p>
            </div>
            <div className="modal-footer-footer">
              <button
                className="btn btn-light"
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy
              </button>
              <button
                className="btn btn-danger"
                onClick={() =>
                  taskToDelete !== null && handleDeleteTask(taskToDelete)
                }
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal cảnh báo lỗi */}
      {showWarningModal && (
        <div className="overlay">
          <div className="modal-custom">
            <div className="modal-header-custom">
              <h5>Cảnh báo</h5>
              <i
                className="fas fa-xmark"
                onClick={() => setShowWarningModal(false)}
              ></i>
            </div>
            <div className="modal-body-custom">
              <p>Tên công việc không được phép để trống.</p>
            </div>
            <div className="modal-footer-footer">
              <button
                className="btn btn-light"
                onClick={() => setShowWarningModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
