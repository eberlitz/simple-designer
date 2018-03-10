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

var designerToolsPreview = document.getElementById("designer-tools-preview");
var designerTools = document.getElementById("designer-tools");

var viewer = document.getElementById("viewer");
var elProperties = document.getElementById("elProperties");

var selectedElement = null;

var currentElement = null;
var dropEl = null;

viewer.addEventListener("mousedown", evt => {
  if (!dropEl && currentElement) {
    // Tem bug aqui no mouse down
    selectControl(currentElement);
    currentElement.draggable = true;
    // designerTools.style.display = "none";
  }
});
viewer.addEventListener("mouseout", evt => {
  !dropEl && (evt.target.draggable = null);
  if (!designerToolsPreview.contains(evt.toElement)) {
    currentElement = null;
    designerToolsPreview.style.display = "none";
  }
});
viewer.addEventListener("mousemove", evt => {
  var el = evt.target;

  if (currentElement !== el && !dropEl) {
    currentElement = el;
    updateControlOutline(el, designerToolsPreview);
  }
});

function updateControlOutline(el, renderEl) {
  var { top, left, width, height } = el.getBoundingClientRect();
  renderEl.style.display = null;
  renderEl.style.width = width + "px";
  renderEl.style.height = height + "px";
  renderEl.style.transform = `translate3d(${left}px, ${top}px, 0px)`;
}

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
  designerToolsPreview.style.display = "none";
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
    selectControl(currentElement);
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

function selectControl(el) {
  selectedElement = el;

  while (elProperties.firstChild) {
    elProperties.removeChild(elProperties.firstChild);
  }
  var textEl = document.createElement("div");
  elProperties.appendChild(textEl);
  textEl.textContent = el.tagName;
  updateControlOutline(selectedElement, designerTools);
}
