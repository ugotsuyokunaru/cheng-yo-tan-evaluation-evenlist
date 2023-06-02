const API = (() => {
    const API_URL = "http://localhost:3000/events";  // private variable

    async function getEventList() {
        const res = await fetch(API_URL);
        return await res.json();
    }

    async function postTodo(newTodoItem) {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json; charset=utf-8"},
            body: JSON.stringify(newTodoItem),
        });
        return await res.json();
    }

    async function deleteTodo(itemID) {
        await fetch(`${API_URL}/${itemID}`, {method: "DELETE"});
    }

    async function putTodo(newTodoItem) {
        const res = await fetch(`${API_URL}/${newTodoItem.id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json; charset=utf-8"},
            body: JSON.stringify(newTodoItem),
        });
        return await res.json();
    }

    return {
        getEventList,
        postTodo,
        deleteTodo,
        putTodo,
    };
})();

class TodoModel {
    #eventList = []; // private variable

    constructor() {}

    getEventList() {
        return this.#eventList;
    }

    async fetchEventList() {
        this.#eventList = await API.getEventList();
        // console.log("[debug] TodoModel fetchEventList: this.#eventList = ", this.#eventList);
        return this.#eventList;
    }

    async addEvent (todoItem) {
        const todoItemNew = await API.postTodo(todoItem);
        this.#eventList.push(todoItemNew);
        return todoItemNew;
    }

    async removeTodo (todoID) {
        await API.deleteTodo(todoID);
        this.#eventList = this.#eventList.filter(item => item.id !== todoID);
    }

    async editEvent(eventItem) {
        const eventItemNew = await API.putTodo(eventItem);
        this.#eventList = this.#eventList.map(item => (item.id === eventItem.id) ? eventItemNew : item);
        return eventItemNew;
    }
}

class TodoView {
    constructor() { // create the basic maintained elements (according to the HTML file)
        this.form = document.getElementById("event");
        this.eventList = document.getElementById("event-list-table");
        // this.eventList = document.getElementsByClassName("event-item");
    }

    createEventElement(eventItem) {
        // tr row
        const eventRowElement = document.createElement("tr");
        eventRowElement.classList.add("event-item");
        eventRowElement.id = `event-${eventItem.id}`;


        // td 1
        const eventTdElement1 = document.createElement("td");
        eventTdElement1.classList.add("event-item__content");

        const editBox = document.createElement("input");
        editBox.value = ""; // eventItem.content
        editBox.type = "text";
        editBox.classList.add("event-item__text");
        editBox.id = `editbox-${eventItem.id}`;
        editBox.required = true;

        const content = document.createElement("p");
        content.id = `content-${eventItem.id}`;
        content.style.display = "none"
        // content.textContent = eventItem.content;

        eventTdElement1.append(editBox, content);


        // td 2
        const eventTdElement2 = document.createElement("td");
        eventTdElement2.classList.add("event-item__start");

        const startDateSelect = document.createElement("input");
        startDateSelect.type = "date";
        startDateSelect.id = `start-date-select-${eventItem.id}`;
        startDateSelect.required = true;

        const startDateText = document.createElement("p");
        startDateText.id = `start-date-text-${eventItem.id}`;
        startDateText.style.display = "none"
        // content.textContent = eventItem.content;

        eventTdElement2.append(startDateSelect, startDateText);


        // td 3
        const eventTdElement3 = document.createElement("td");
        eventTdElement3.classList.add("event-item__end");

        const endDateSelect = document.createElement("input");
        endDateSelect.type = "date";
        endDateSelect.id = `end-date-select-${eventItem.id}`;
        endDateSelect.required = true;

        const endDateText = document.createElement("p");
        endDateText.id = `end-date-text-${eventItem.id}`;
        endDateText.style.display = "none"
        // content.textContent = eventItem.content;

        eventTdElement3.append(endDateSelect, endDateText);


        // td 4
        const eventTdElement4 = document.createElement("td");
        eventTdElement4.classList.add("event-item__actions");

        // when adding
        const addButton = document.createElement("svg");
        addButton.innerHTML = '<svg class="event-item__add-btn" focusable viewBox="0 0 24 24" aria-hidden="true xmlns="http://www.w3.org/2000/svg"><path d="M12 6V18M18 12H6" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        addButton.id = `add-${eventItem.id}`;

        const addCancelButton = document.createElement("svg");
        addCancelButton.innerHTML = '<svg class="event-item__add-cancel-btn" focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>';
        addCancelButton.id = `add-cancel-${eventItem.id}`;

        // when added
        const editButton = document.createElement("svg");
        editButton.innerHTML = '<svg class="event-item__edit-btn" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>';
        editButton.id = `edit-${eventItem.id}`;
        editButton.style.display = "none";
        
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<svg class="event-item__delete-btn" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>';
        deleteButton.id = `delete-${eventItem.id}`;
        deleteButton.style.display = "none";

        // when editing
        const saveButton = document.createElement("svg");
        saveButton.innerHTML = '<svg class="event-item__save-btn" focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg>';
        saveButton.id = `save-${eventItem.id}`;
        saveButton.style.display = "none";
        
        const editCancelButton = document.createElement("button");
        editCancelButton.innerHTML = '<svg class="event-item__edit-cancel-btn" focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>';
        editCancelButton.id = `edit-cancel-${eventItem.id}`;
        editCancelButton.style.display = "none";

        eventTdElement4.append(addButton, addCancelButton, editButton, deleteButton, saveButton, editCancelButton);

        eventRowElement.append(eventTdElement1, eventTdElement2, eventTdElement3, eventTdElement4);
        return eventRowElement;
    }

    appendEventItem(eventItem) {
        const eventElement = this.createEventElement(eventItem);
        this.eventList.append(eventElement);
    }

    removeTodoItem(removeID) {
        const todoItem = document.getElementById(`event-${removeID}`);
        todoItem.remove();
    }

    addEventItem(id) {
        const addBtn = document.getElementById(`add-${id}`);
        addBtn.style.display = "none";
        const addCancelBtn = document.getElementById(`add-cancel-${id}`);
        addCancelBtn.style.display = "none";

        const editBtn = document.getElementById(`edit-${id}`);
        editBtn.style.display = "inline-block";
        const editEndBtn = document.getElementById(`save-${id}`);
        editEndBtn.style.display = "inline-block";

        const eventContent = document.getElementById(`content-${id}`);
        const editbox = document.getElementById(`editbox-${id}`);
        eventContent.textContent = editBox.value;

        const startSelect = document.getElementById(`start-date-select-${id}`);
        const startContent = document.getElementById(`start-date-text-${id}`);
        startSelect.textContent = startContent.value;

        const endSelect = document.getElementById(`end-date-select-${id}`);
        const endContent = document.getElementById(`end-date-text-${id}`);
        endSelect.textContent = endContent.value;

        return [eventContent.textContent, startSelect.textContent, endSelect.textContent];
    }  

    startTodoItemEditMode(id) {
        const checkbox = document.getElementById(`label-${id}`);
        checkbox.style.display = "none";
        const editBox = document.getElementById(`editbox-${id}`);
        editBox.style.display = "inline-block";
        const editStartBtn = document.getElementById(`edit-start-${id}`);
        editStartBtn.style.display = "none";
        const editEndBtn = document.getElementById(`edit-end-${id}`);
        editEndBtn.style.display = "inline-block";
    }

    EndEventItemEditMode(id) {
        const editBox = document.getElementById(`editbox-${id}`);
        editBox.style.display = "none";
        const editStartBtn = document.getElementById(`edit-start-${id}`);
        editStartBtn.style.display = "inline-block";
        const editEndBtn = document.getElementById(`edit-end-${id}`);
        editEndBtn.style.display = "none";

        const content = document.getElementById(`content-${id}`);
        content.textContent = editBox.value;
        return editBox.value;
    }   

    initRenderTodoList(todoList) {
        // this.eventList.innerHTML = "";
        // console.log("[debug] initRenderTodoList, todoList = ", todoList);
        // console.log("[debug] initRenderTodoList, this.eventList = ", this.eventList.innerHTML);
        todoList.forEach(todoItem => {
            this.appendEventItem(todoItem);
        })
    }
}

class TodoController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    async init() {
        this.setUpEventLisiteners();
        const initTodoList = await this.model.fetchEventList();
        this.view.initRenderTodoList(initTodoList);
    }

    async setUpEventLisiteners() {
        await this.setUpCreateEventLisitener();
        await this.setUpAddEventLisitener();
        // await this.setUpRemoveEventLisitener();
        // await this.setUpEditStartEventLisitener();
        // await this.setUpEditEndEventLisitener();
    }

    async setUpCreateEventLisitener() {
        this.view.form.addEventListener("submit", async (e) => {
            e.preventDefault(); // prevent browser from auto-refreshing when submitting the form
            const todoItem = {
                eventName: "",
                startDate: "",
                endDate: "",
                // id: automatically-assigned by post request,
            }
            const todoItemNew = await this.model.addEvent(todoItem);
            this.view.appendEventItem(todoItemNew);
        })
    }

    async setUpAddEventLisitener() {
        this.view.eventList.addEventListener("click", async (e) => {
            const element = e.target;
            console.log(element)
            const isAddBtn = element.classList.contains("event-item__add-btn");
            if (isAddBtn) {
                const idStrList = element.id.split("-");
                const editID = idStrList[idStrList.length - 1];
                const [content, start, end] = this.view.addEventItem(editID);

                // update the text to model
                const todoItem = {
                    id: editID,
                    eventName: content,
                    startDate: start,
                    endDate: end,
                }
                await this.model.editEvent(todoItem);

                // this.view.removeTodoItem(addID);
            }
        })
    }


    // async setUpRemoveEventLisitener() {
    //     this.view.eventList.addEventListener("click", async (e) => {
    //         const element = e.target;
    //         const isDeleteBtn = element.classList.contains("event-item__delete-btn");
    //         if (isDeleteBtn) {
    //             const idStrList = element.id.split("-");
    //             const removeID = idStrList[idStrList.length - 1];
    //             await this.model.removeTodo(removeID);
    //             this.view.removeTodoItem(removeID);
    //         }
    //     })
    // }

    // async setUpEditStartEventLisitener() {
    //     this.view.eventList.addEventListener("click", async (e) => {
    //         const element = e.target;
    //         const isEditStartBtn = element.classList.contains("event-item__edit-start-btn");
    //         if (isEditStartBtn) {
    //             // change checkbox to input
    //             const idStrList = element.id.split("-");
    //             const editID = idStrList[idStrList.length - 1];
    //             this.view.startTodoItemEditMode(editID);
    //         }
    //     })
    // }

    // async setUpEditEndEventLisitener() {
    //     this.view.eventList.addEventListener("click", async (e) => {
    //         const element = e.target;
    //         const isEditEndBtn = element.classList.contains("event-item__edit-end-btn");
    //         if (isEditEndBtn) { // when clicked again
    //             // change back to checkbox (with the edited text) and edit button, and save the text
    //             const idStrList = element.id.split("-");
    //             const editID = idStrList[idStrList.length - 1];
    //             const editedContent = this.view.EndEventItemEditMode(editID);

    //             // update the text to model
    //             const todoItem = {
    //                 id: editID,
    //                 content: editedContent,
    //                 completed: element.completed,
    //             }
    //             await this.model.editEvent(todoItem);
    //         }
    //     })
    // }
}

// export default TodoModel;
// export default TodoView;
// export default TodoController;
