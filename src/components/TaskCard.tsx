interface Props {
  task: Task;
  completeTask: (e: Event, taskName: string) => void;
}

interface Task {
  name: string;
  body: string;
}

const TaskCard = (props: Props) => {
  return (
    <div class="bg-gray-500 contents-center border-black items-center rounded shadow-md w-40 text-center m-5">
      <h1 class="font-extrabold m-2 text-white text-xl">{props.task.name}</h1>
      <div>
        <p class="m-2 text-white">{props.task.body}</p>

        <button
          class="bg-gray-600 text-center p-1 m-2 font-bold text-white hover:outline-none hover:shadow-lg hover:border-black active:bg-gray-500"
          onclick={(e) => props.completeTask(e, props.task.name)}
        >
          Complete
        </button>
      </div>
    </div>
  );
};
export default TaskCard;
