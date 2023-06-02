// import { TodoModel, TodoModel, TodoController} from "./mvc"

const model = new TodoModel();
const view = new TodoView();
const controller = new TodoController(model, view);
