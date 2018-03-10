var tree = {
  name: "ul",
  children: [
    {
      name: "li",
      children: [
        {
          name: "input"
        }
      ]
    },
    {
      name: "li",
      children: [
        {
          name: "button"
        }
      ]
    }
  ]
};

var designerTools = document.getElementById("designer-tools");

var viewer = document.getElementById("viewer");

var selectedElement = null;

var currentElement = null;
var dropEl = null;

viewer.addEventListener("mousedown", evt => {
  if (!dropEl && currentElement) {
    // Tem bug aqui no mouse down
    selectedElement = currentElement;
    currentElement.draggable = true;
    // designerTools.style.display = "none";
  }
});
viewer.addEventListener("mouseout", evt => {
  !dropEl && (evt.target.draggable = null);
  if (!designerTools.contains(evt.toElement)) {
    currentElement = null;
    designerTools.style.display = "none";
  }
});
viewer.addEventListener("mousemove", evt => {
  var el = evt.target;

  if (currentElement !== el && !dropEl) {
    var { top, left, width, height } = el.getBoundingClientRect();
    designerTools.style.display = null;
    designerTools.style.width = width + "px";
    designerTools.style.height = height + "px";

    designerTools.style.transform = `translate3d(${left}px, ${top}px, 0px)`;
    currentElement = el;
  }
});

function dragstart_cmp_handler(ev) {
  setDropEl(ev.target);
}

function dragstart_handler(ev) {
  console.log("dragStart");
  var type = ev.target.textContent || ev.target.innerText || "input";

  var el = document.createElement(type);
  el.innerText = " ";
  el.style.pointerEvents = "none";
  setDropEl(el);
}
function setDropEl(el) {
  dropEl = el;
  designerTools.style.display = "none";
}

function dragover_handler(ev) {
  ev.preventDefault();
  ev.dataTransfer.dropEffect = "move";

  var el = ev.target;
  if (currentElement !== el) {
    currentElement = el;
    console.log("dragover_handler", ev);
    dropEl.parentElement = null;
    if (isContainerElement(el)) {
      el.appendChild(dropEl);
    } else {
      el.parentNode.insertBefore(dropEl, el.nextSibling);
    }
  }
}

function drop_handler(ev) {
  ev.preventDefault();
  dropEl.style.pointerEvents = null;
  dropEl.draggable = null;
  dropEl = null;
}

function isContainerElement(el) {
  return ["DIV", "UL", "LI"].indexOf(el.tagName) !== -1;
}
