import { For, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { invoke } from "@tauri-apps/api";

import TaskAdd from "./components/TaskAdd";
import TaskCard from "./components/TaskCard";

type Task = {
  name: string;
  body: string;
};

const App = () => {
  const [taskList, setTaskList] = createStore([] as Task[]);

  const fetchJsonData = async () => {
    try {
      const json: string = await invoke<string>("read_tasks");
      console.log(json);
      const tasks: Task[] = JSON.parse(JSON.parse(json));
      console.log("Data fetched: " + tasks);
      return tasks;
    } catch {
      (err: string) => console.log("Issue fetching json: " + err);
      return [];
    }
  };

  const listTasks = async (e: Event) => {
    const tasks = await fetchJsonData();
    setTaskList(tasks);
  };

  const completeTask = async (e: Event, taskName: string) => {
    e.preventDefault();
    try {
      await invoke("delete_task", { name: taskName });
    } catch {
      (error: string) => console.log("Error deleting task: " + error);
    }
    listTasks(e);
  };

  return (
    <div class="grid auto-rows-auto">
      <div>
        <h1 class="font-extrabold text-4xl text-center m-5">Task Manager</h1>
      </div>
      <div class="flex justify-center">
        <TaskAdd listTasks={listTasks} />
        <button
          class="bg-gray-700 text-center m-1 p-5 h-25 w-25 font-bold text-white hover:outline-none hover:shadow-lg hover:border-black hover:bg-gray-600 active:bg-gray-500"
          onclick={(e) => listTasks(e)}
        >
          List Tasks
        </button>
      </div>
      <div class="flex flex-wrap justify-start justify-items-start">
        <For each={taskList}>
          {(task: Task) => <TaskCard task={task} completeTask={completeTask} />}
        </For>
      </div>
    </div>
  );
};

export default App;
