const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-list-item');
const backlogListEl = document.getElementById('backlog-list');
const progressListEl = document.getElementById('progress-list');
const completeListEl = document.getElementById('complete-list');
const onHoldListEl = document.getElementById('on-hold-list');

//Initialize array
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];
let updatedOnLoad = false;
let draggedItem;
let dragging=false;
let currentColumn;
// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
    //    console.log(JSON.parse(localStorage.onHoldItems));
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being Uncool'];
  }
}
function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
    // console.log(JSON.stringify(listArrays[index]));
  });
}
// create DOM element for each item
function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.contentEditable=true;
  listEl.id=index;
  listEl.setAttribute('onfocusout',`updateItem(${index},${column})`)
  listEl.setAttribute('ondragstart', 'drag(event)'); //drag  is function
  columnEl.appendChild(listEl);
}
function updateDom() {
  //check local storage once
  if (!updatedOnLoad) {getSavedColumns(); updatedOnLoad=true};
  //Backlog column
  backlogListEl.textContent = '';
  backlogListArray=filterArray(backlogListArray)
  backlogListArray.forEach((backlogItem, index) => {
  //  console.log(backlogItem);
    createItemEl(backlogListEl, 0, backlogItem, index);
  });
  progressListEl.textContent = '';
   progressListArray = filterArray(progressListArray);
  progressListArray.forEach((progressList, index) => {
    createItemEl(progressListEl, 1, progressList, index);
  });
  completeListEl.textContent = '';
   completeListArray = filterArray(completeListArray);
  completeListArray.forEach((completeList, index) => {
    createItemEl(completeListEl, 2, completeList, index);
  });
  onHoldListEl.textContent = '';
   onHoldListArray = filterArray(onHoldListArray);
  onHoldListArray.forEach((onHoldList, index) => {
    createItemEl(onHoldListEl, 3, onHoldList, index);
  });
  //console.log(progressListArray,progressListEl.textContent);
  updateSavedColumns();
}
function updateItem(id,col){
   const selectedArray=listArrays[col];
   const selectedColumnEl=listColumns[col].children;
 //  console.log(selectedColumnEl[id].textContent);
 if(!dragging){
 if(!selectedColumnEl[id].textContent){
     delete selectedArray[id];
 }
 else{
     selectedArray[id]=selectedColumnEl[id].textContent;
 }
updateDom();
}
 

}
function addToColum(col){
   // console.log(addItems[col].textContent);
//   const parent =listColumns[col];
//   const newLi=document.createElement('li');
//   newLi.textContent = addItems[col].textContent;
//   parent.appendChild(newLi);
//  rebuild()
const item=addItems[col].textContent;
//console.log(item,col);
const selectedArray=listArrays[col];
//console.log(listArrays);
//console.log(selectedArray.length);
selectedArray.push(item);
//console.log(selectedArray.length);
console.log(listArrays[col].length);

updateDom();
addItems[col].textContent = '';
}
function showInputBox(column){
    addBtns[column].style.visibility='hidden';
    saveItemBtns[column].style.display='flex';
    addItemContainers[column].style.display='flex';
}
function hideInputBox(column){
      addBtns[column].style.visibility = 'visible';
      saveItemBtns[column].style.display = 'none ';
      addItemContainers[column].style.display = 'none ';
      addToColum(column);
}
function rebuild(){

    backlogListArray=[];
   for(let i=0;i<backlogListEl.children.length;i++){
       backlogListArray.push(backlogListEl.children[i].textContent);
   }

   progressListArray=[];
   for(let i=0;i<progressListEl.children.length;i++){
      progressListArray.push(progressListEl.children[i].textContent)
   }
    
   completeListArray=[];
   for(let i=0;i< completeListEl.children.length;i++){
       completeListArray.push( completeListEl.children[i].textContent)
   }
     onHoldListArray=[];
   
   for(let i=0;i< onHoldListEl.children.length;i++){
       onHoldListArray.push( onHoldListEl.children[i].textContent)
   }
   //console.log(backlogListEl);
   updateDom();
   updateSavedColumns()
}
//getSavedColumns();
//updateSavedColumns();
updateDom();
// when item start dragging
function drag(e) {
  draggedItem = e.target;
 // console.log(draggedItem);
}
//column allow item item  to drop
function allowDrop(e) {
  e.preventDefault();
  dragging=true;
}
//when item enters column area
function dragEnter(column) {
 // console.log(column);
  listColumns[column].classList.add('over');
  currentColumn = column;
}

function drop(e) {
  e.preventDefault();
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  //console.log(draggedItem);

  const parent = listColumns[currentColumn];
  //console.log(parent);
  parent.appendChild(draggedItem);
   dragging = false;
  rebuild();
 
}
updateSavedColumns();