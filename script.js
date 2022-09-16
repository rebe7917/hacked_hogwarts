"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let expelledStudents = [];

const settings = {
  filter: "all",
  sortBy: "firstName",
  sortDir: "asc",
};

// The prototype for all students:
const Student = {
  attending: true,
  expelled: false,
  firstName: "",
  nickName: "",
  middelName: "",
  lastName: "",
  gender: "",
  house: "",
  //image: "null",
};

function start() {
  console.log("ready");

  // TODO: Add event-listeners to filter and sort buttons
  registerButtons();
  loadJSON();
}
/* opretter eventlisteners på sort og filter knapper/overskrifter */
function registerButtons() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((button) => button.addEventListener("click", selectFilter));
  document
    .querySelectorAll("[data-action='sort']")
    .forEach((button) => button.addEventListener("click", selectSort));
}
/* fetcher json data */
async function loadJSON() {
  const response = await fetch("studentlist.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}
/*map? */
function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);

  buildList();
}
/*clean data og opret object "student"  */
function prepareObject(jsonObject) {
  const student = Object.create(Student);

  //TRIM (fullname, house, gender)
  let fullname = jsonObject.fullname.trim();
  //console.log(fullname)
  let house = jsonObject.house.trim();
  //console.log(house);
  let gender = jsonObject.gender.trim();
  //console.log(gender);

  //FIRSTNAME
  //uppercase on the first letter and rest lowercase
  student.firstName =
    fullname.substring(0, 1).toUpperCase() +
    fullname.substring(1, fullname.indexOf(" ")).toLowerCase();
  //console.log(student.firstname);

  //MIDDLENAME
  //trim + uppercase on the first letter and the rest lowercase
  student.middelName =
    fullname
      .substring(fullname.indexOf(" "), fullname.lastIndexOf(" "))
      .trim()
      .substring(0, 1)
      .toUpperCase() +
    fullname
      .substring(fullname.indexOf(" "), fullname.lastIndexOf(" "))
      .trim()
      .substring(1)
      .toLowerCase();
  //console.log(student.middelName);

  //NICKNAME
  if (fullname.includes(`"`)) {
    student.nickName =
      fullname
        .substring(fullname.indexOf(`"`) + 1, fullname.indexOf(`"`) + 2)
        .toUpperCase() +
      fullname
        .substring(fullname.indexOf(`"`) + 2, fullname.lastIndexOf(`"`))
        .toLowerCase();
    //removing the name fron the middlename because its a nickname
    student.middelName = "";
    //console.log(student.nickName)
  }
  //LASTNAME
  //trim + uppercase on the first letter and the rest lowercase
  student.lastName =
    fullname
      .substring(fullname.lastIndexOf(" ") + 1, fullname.lastIndexOf(" ") + 2)
      .toUpperCase() +
    fullname.substring(fullname.lastIndexOf(" ") + 2).toLowerCase();
  //console.log(student.lastName);

  //GENDER
  student.gender =
    gender.substring(0, 1).toUpperCase() + gender.substring(1).toLowerCase();
  //console.log(student.gender);

  //HOUSE
  student.house =
    house.substring(0, 1).toUpperCase() + house.substring(1).toLowerCase();
  //console.log(student.house);

  //IMAGE
  student.image =
    fullname.substring(fullname.lastIndexOf(" ")).trim().toLowerCase() +
    "_" +
    fullname.substring(0, 1).toLowerCase() +
    ".png";

  if (fullname.includes("-")) {
    student.image =
      fullname.substring(fullname.lastIndexOf("-") + 1).toLowerCase() +
      "_" +
      fullname.substring(0, 1).toLowerCase() +
      ".png";
    // console.log(student.image);
  }

  //console.log(student);

  return student;
}
/*----------------------------------filter-------------------------------- */
//hvilket filter bliver der klikket på
function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`user selected ${filter}`);
  setFilter(filter);
}
// ?
function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}
//create filtreret lister
function filterList(filteredList) {
  //let filteredList = allStudents
  if (settings.filterBy === "Gryffindor") {
    //create a filtered list of only gry
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filterBy === "Ravenclaw") {
    //create a filtered list of only rav
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "Hufflepuff") {
    //create a filtered list of only huf
    filteredList = allStudents.filter(isHufflePuff);
  } else if (settings.filterBy === "Slytherin") {
    //create a filtered list of only sly
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filterBy === "expelled") {
    //create a filtered list of only sly
    filteredList = allStudents.filter(isExpelled);
  } else if (settings.filterBy === "attending") {
    //create a filtered list of only sly
    filteredList = allStudents.filter(isAttending);
  }
  return filteredList;
}
//hvad skal retuneres når der trykkes
function isGryffindor(student) {
  return student.house === "Gryffindor";
}
function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}
function isHufflePuff(student) {
  return student.house === "Hufflepuff";
}
function isSlytherin(student) {
  return student.house === "Slytherin";
}
function isExpelled(student) {
  return student.expelled === true;
}
function isAttending(student) {
  return student.expelled === false;
}
/*---------------------------------sort-----------------------------*/
function selectSort(event) {
  const sortBy = event.target.dataset.sort; // what is clicked
  const sortDir = event.target.dataset.sortDirection; //direction

  //find old sort by element
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortby");
  //indicate active sort
  event.target.classList.add("sortby");

  //toggle the direction of sorting
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`user selected ${sortBy}${sortDir}`);
  setSort(sortBy, sortDir);
}
//?
function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}
function sortList(sortedList) {
  // to sort both directions
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);
  //?
  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}
//to make sort and filter work together (not break)
function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  displayList(sortedList);
}
function displayList(students) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}
//clone to main site
function displayStudent(student) {
  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector(
    "[data-field=firstName]"
  ).textContent = `${student.firstName}`;
  clone.querySelector(
    "[data-field=middleName]"
  ).textContent = ` ${student.middleName}`;
  clone.querySelector(
    "[data-field=nickName]"
  ).textContent = ` ${student.nickName}`;
  clone.querySelector(
    "[data-field=lastName]"
  ).textContent = `${student.lastName}`;
  clone.querySelector("[data-field=gender]").textContent = `${student.gender}`;
  clone.querySelector("[data-field=house]").textContent = `${student.house}`;
  /* clone.querySelector(".images").src = `/images/${student.image}`; */

  //expelled
  if (student.expelled === true) {
    clone.querySelector("[data-field=expelled]").textContent = "yes";
  } else {
    clone.querySelector("[data-field=expelled]").textContent = "no";
  }
  clone
    .querySelector("[data-field=expelled]")
    .addEventListener("click", clickExpelled);

  function clickExpelled() {
    if (student.expelled === false) {
      student.expelled = true;
    }
    buildList();
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
