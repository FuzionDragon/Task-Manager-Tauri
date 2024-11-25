import { invoke } from "@tauri-apps/api";
import { createSignal } from "solid-js";

interface ChildProps {
  listTasks: (e: Event) => void;
}

const TaskAdd = (props: ChildProps) => {
  const [name, setName] = createSignal("");
  const [body, setBody] = createSignal("");
  const [result, setResult] = createSignal("");

  const addTodo = async (e: Event) => {
    e.preventDefault();
    const result: string = (await invoke("add_task", {
      newName: name(),
      newBody: body(),
    }).catch((error) => setResult(error))) as string;

    setName("");
    setBody("");

    props.listTasks(e);

    setResult(result);
    setTimeout(setResult(""), 10000);
  };

  return (
    <div class="bg-gray-500 m-1 contents-center border-black items-center rounded shadow-md p-1 max-w-xl min-w-xl h-25 grow-0">
      <div class="flex justify-center flex-wrap max">
        <label class="m-1 text-white font-bold">
          Name:
          <input
            type="text"
            class="m-1 p-1 focus:border-black outline-none hover:shadow-lg"
            placeholder="Enter a task name"
            required
            value={name()}
            onInput={(e) => setName(e.currentTarget.value)}
          />
        </label>

        <label class="m-1 text-white font-bold">
          Body:
          <input
            type="text"
            class="m-1 p-1 focus:border-black outline-none hover:shadow-lg"
            placeholder="Enter a task"
            required
            value={body()}
            onInput={(e) => setBody(e.currentTarget.value)}
          />
        </label>
      </div>

      <div class="flex justify-center m-1">
        <button
          class="bg-gray-600 text-center p-2 font-bold text-white hover:outline-none hover:shadow-lg hover:border-black active:bg-gray-500"
          onClick={addTodo}
        >
          Add Task
        </button>
      </div>

      <div class="flex justfiy-center bg-red-600 shadow-lg m-1 rounded">
        <p class="text-white font-bold text-center">{result()}</p>
      </div>
    </div>
  );
};
export default TaskAdd;
