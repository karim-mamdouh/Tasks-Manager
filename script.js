(function () {
  var input = document.getElementById("form__text"); //form input element
  var add = document.getElementById("form__add-btn"); //add task button element
  var form = document.getElementById("form"); //form element
  var ul = [...document.querySelectorAll(".tasksSection")]; //list of all task cards
  var drag = null; //dragged object
  var tasks = [];

  //Factory function that creates a new object
  function createTask(name, status) {
    return {
      name: name,
      status: status,
    };
  }
  //Drag over card event function
  function dragOverEvent(e) {
    e.preventDefault();
    this.style.background = "#eee";
  }
  //Drop event card function, sets local storage with the new location
  function dropEvent() {
    this.appendChild(drag);
    var temp = this;
    tasks.forEach(function (e) {
      if (e.name === drag.innerHTML) {
        e.status = temp.parentElement.id;
      }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    this.style.background = "#fff";
  }
  //Function that loops over all the cards to connect them to thier dropping events
  function dropElement() {
    ul.forEach((box) => {
      box.addEventListener("dragover", dragOverEvent);
      box.addEventListener("dragleave", function () {
        this.style.background = "#fff";
      });
      box.addEventListener("drop", dropEvent);
    });
  }
  //Function that loops over all tasks to connect them to the drag events
  function dragElement() {
    var elements = document.querySelectorAll(".item");
    elements.forEach((item) => {
      item.addEventListener("dragstart", function () {
        drag = item;
        item.style.opacity = 0.5;
      });
      item.addEventListener("dragend", function () {
        drag = null;
        item.style.opacity = 1;
      });
    });
  }
  //Function creates a new task (list item)
  function createListItem(text) {
    var element = document.createElement("li");
    element.className = "item";
    element.draggable = true;
    element.innerHTML = text;
    return element;
  }
  //Add button click event
  add.addEventListener("click", function (e) {
    e.preventDefault();
    if (input.value != "") {
      tasks.push({ name: input.value, status: "inProgrss" });
      localStorage.setItem("tasks", JSON.stringify(tasks));
      ul[0].appendChild(createListItem(input.value));
      input.value = "";
    }
    dragElement();
  });
  //Self invoke function executed at the begining of page to fetch
  //all local storage items and deploy them in thier respective cards
  //then ties them to thier drag/drop events
  (function () {
    var local = localStorage.getItem("tasks");
    if (local != null) {
      JSON.parse(local).forEach(function (e) {
        var container = document.getElementById(e.status);
        tasks.push(e);
        container.children[1].appendChild(createListItem(e.name));
      });
    } else {
      localStorage.setItem("tasks", JSON.stringify(new Array()));
    }
    dropElement();
    dragElement();
  })();
})();
