"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];

const settings = {
  filter: "all",
  sortBy: "firstName",
  sortDir: "asc",
};

// The prototype for all students:
const Student = {
  prefect: false,
  attending: true,
  expelled: false,
  firstName: "",
  nickName: "",
  middelName: "",
  lastName: "",
  gender: "",
  house: "",
  image: "null",
  bloodStatus: "",
  squadMember: "",
};
//hacked
let beenHacked = false;
//click on press not btn
document.querySelector("#hack").addEventListener("click", hackTheSystem);

function hackTheSystem() {
  if (!beenHacked) {
    beenHacked = true;
    console.log(beenHacked);
    pushMe();
  }
}

function pushMe() {
  alert("The system is now hacked, MUHAHA!");
  allStudents.unshift({
    firstName: "Rebecca",
    lastName: "Schütze",
    middleName: "Katarina",
    house: "Gryffindor",
    bloodStatus: "Muggle-born",
  });
  console.log(allStudents);
  buildList();
}
//seach filed
const searchField = document.querySelector(".search");
searchField.addEventListener("input", initSearch);
let showNumberOfStudent = document.querySelector(".numberinsearch");

function start() {
  // console.log("ready");

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
//serach function made here
function initSearch(event) {
  console.log("im here");
  let searchStudentList = allStudents.filter((student) => {
    let name = "";
    if (student.lastName === null) {
      name = student.firstName;
    } else {
      name = student.firstName + " " + student.lastName;
    }
    return name.toLowerCase().includes(event.target.value);
  });

  // this will show number og student in the search

  showNumberOfStudent.textContent = `number of students: ${searchStudentList.length}`;
  displayList(searchStudentList);
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
  //BLOODSTATUS
  loadBloodJSON();

  async function loadBloodJSON() {
    const response = await fetch("blodstatus.json");
    const studentBloodJSON = await response.json();
    student.bloodStatus = checkBloodType(studentBloodJSON);

    checkBloodType(studentBloodJSON);
  }
  function checkBloodType(studentBloodJSON) {
    if (studentBloodJSON.pure.includes(student.lastName) == true) {
      return "Pureblood";
    } else if (studentBloodJSON.half.includes(student.lastName) == true) {
      return "Halfblood";
    } else {
      return "Muggle-born";
    }
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
  } else if (settings.filterBy === "prefect") {
    //create a filtered list of only sly
    filteredList = allStudents.filter(isPrefect);
  } else if (settings.filterBy === "squadMember") {
    //create a filtered list of only sly
    filteredList = allStudents.filter(isSquadMember);
  }
  document.querySelector("[data-field=numberDisplayed]").textContent =
    filteredList.length;
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
function isPrefect(student) {
  return student.prefect === true;
}
function isSquadMember(student) {
  return student.squadMember === true;
}
/*---------------------------------filter slut-----------------------------*/

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
    "[data-field=lastName]"
  ).textContent = `${student.lastName}`;
  clone.querySelector("[data-field=house]").textContent = `${student.house}`;
  clone
    .querySelector(".details")
    .addEventListener("click", () => showDetails(student));

  /*---------------------------EXPELLED---------------------------------*/
  if (student.expelled === true) {
    clone.querySelector("[data-field=expelled]").textContent = "yes";
  } else {
    clone.querySelector("[data-field=expelled]").textContent = "no";
  }
  clone
    .querySelector("[data-field=expelled]")
    .addEventListener("click", clickExpelled);

  function clickExpelled() {
    if (beenHacked === true && student.lastName === "Schütze") {
      document.querySelector("#warningbox_noexpell").classList.remove("hide");
      document
        .querySelector("#warningbox_noexpell .okay_btn")
        .addEventListener("click", closeHackExpellDialog);

      function closeHackExpellDialog() {
        document.querySelector("#warningbox_noexpell").classList.add("hide");
      }
    } else {
      toggleExpelled(student);
    }
  }

  /*---------------------------PREFECT---------------------------------*/
  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  clone
    .querySelector("[data-field=prefect]")
    .addEventListener("click", clickPrefect);

  function clickPrefect() {
    if (student.expelled === true) {
      student.prefect === false;
    } else if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakeAPrefect(student);
    }
    buildList();
  }

  /*---------------------------SQUAD MEMBER---------------------------------*/
  if (student.squadMember === true) {
    clone.querySelector("[data-field=squadMember]").textContent = "yes";
  } else {
    clone.querySelector("[data-field=squadMember]").textContent = "no";
  }
  clone
    .querySelector("[data-field=squadMember]")
    .addEventListener("click", clickSquadMember);

  function clickSquadMember() {
    if (beenHacked === false) {
      toggleSquad(student);
    } else if (beenHacked === true) {
      toggleSquadHacked(student);
    }
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
function toggleExpelled(student) {
  if (student.expelled === false) {
    student.expelled = true;
    student.prefect = false;
    student.attending = false;
    student.squadMember = false;
  }
  buildList();
}
function toggleSquad(student) {
  //måske ikke (student)
  if (student.squadMember === true) {
    student.squadMember = false;
  } else {
    tryToMakeASquadMember(student);
  }
  buildList();
}

function toggleSquadHacked(student) {
  if (student.squadMember === true) {
    student.squadMember = false;
  } else {
    makeMemberLimitedTime(student);
  }
  buildList();
}

function tryToMakeASquadMember(student) {
  if (student.house === "Slytherin" || student.bloodStatus === "Pureblood") {
    student.squadMember = true;
  } else {
    document.querySelector("#warningbox_squad").classList.remove("hide");
    document
      .querySelector("#warningbox_squad .okay_btn")
      .addEventListener("click", closeSquadDialog);
  }

  function closeSquadDialog() {
    document.querySelector("#warningbox_squad").classList.add("hide");
    document
      .querySelector("#warningbox_squad .okay_btn")
      .removeEventListener("click", closeSquadDialog);
  }
}

function makeMemberLimitedTime(student) {
  student.squadMember = true;

  buildList();

  setTimeout(function () {
    student.squadMember = false;
    alert("Oops something went wrong there, why don't you try again?");
    buildList();
  }, 5000);
}
/*------------------------------------------------POP-UP STUDENT---------------------------------------------- */
function showDetails(student) {
  // console.log("clicked on", student);

  const popup = document.querySelector("#popup");
  popup.style.display = "block";

  popup.querySelector(
    ".firstname"
  ).textContent = `Firstname: ${student.firstName}`;
  popup.querySelector(
    ".middlename"
  ).textContent = ` Middlename: ${student.middleName}`;
  popup.querySelector(
    ".nickname"
  ).textContent = ` Nickname: ${student.nickName}`;

  popup.querySelector(
    ".lastname"
  ).textContent = `Lastname: ${student.lastName}`;
  popup.querySelector(".gender").textContent = `Gender: ${student.gender}`;
  popup.querySelector(".house").textContent = `House: ${student.house}`;
  popup.querySelector(".prefect").textContent = `Prefect: ${student.prefect}`;
  popup.querySelector(
    ".expelled"
  ).textContent = `Expelled: ${student.expelled}`;
  popup.querySelector(
    ".bloodstatus"
  ).textContent = `Bloodstatus: ${student.bloodStatus}`;
  popup.querySelector(
    ".squadmember"
  ).textContent = `Squadmember: ${student.squadMember}`;
  popup.querySelector(".images").src = `/images/${student.image}`;

  document
    .querySelector(".close_btn")
    .addEventListener("click", () => (popup.style.display = "none"));
}
/*------------------------------------------------POP-UP STUDENT SLUT---------------------------------------------- */

/*------------------------------------------------CHECK IFS---------------------------------------------- */
// check if student can be prefect
function tryToMakeAPrefect(selectedStudent) {
  const prefects = allStudents.filter((student) => student.prefect);
  const other = prefects.filter(
    (student) => student.house === selectedStudent.house
  );

  //if there is another of the same type
  if (other.length >= 2) {
    console.log("there can only be two of each house");
    removeAorB(other[0], other[1]);
  } else {
    makePrefect(selectedStudent);
  }

  function removeAorB(prefectA, prefectB) {
    //ask the user to ignore or remove a or b
    document.querySelector("#warningbox_prefect").classList.remove("hide");
    document
      .querySelector(".closebutton")
      .addEventListener("click", closeDialog);
    document.querySelector("#remove_a").addEventListener("click", clickRemoveA);
    document.querySelector("#remove_b").addEventListener("click", clickRemoveB);

    // show names on remove a or b button
    document.querySelector("[data-field=prefectA]").textContent =
      prefectA.firstName;
    document.querySelector("[data-field=prefectB]").textContent =
      prefectB.firstName;

    //if ignore - do nothing
    function closeDialog() {
      document.querySelector("#warningbox_prefect").classList.add("hide");
      document
        .querySelector(".closebutton")
        .removeEventListener("click", closeDialog);
      document
        .querySelector("#remove_a")
        .removeEventListener("click", clickRemoveA);
      document
        .querySelector("#remove_b")
        .removeEventListener("click", clickRemoveB);
    }
    // if remove a
    function clickRemoveA() {
      removePrefect(prefectA);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }

    //else if - removeB
    function clickRemoveB() {
      removePrefect(prefectB);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }
  function removePrefect(prefectStudent) {
    prefectStudent.prefect = false;
  }
  function makePrefect(student) {
    student.prefect = true;
  }
}
