/*********** SERVER SIDE COMMUNICATION ***********/
const socket = io();
const chatForm = document.querySelector("#chatForm");
const cc = document.getElementById("chat-container");
const ttlbar = document.getElementById("ttlbar");
const ulist = document.getElementById("ulist");
const tarea = document.getElementById("tarea");
const chatPingNode = document.querySelector("#chatPing");
const notificationArea = document.querySelector("#notificationArea");
const chatBox = document.querySelector("#chatBox");
const params = new URLSearchParams(window.location.search);
const username = params.get("username");
const room = params.get("room");

function escapeHtml(html) {
  var text = document.createTextNode(html);
  var p = document.createElement("p");
  p.appendChild(text);
  return p.innerHTML;
}

// Insert text extracted from query strings into the dom
tarea.textContent = room;

// Request server to join to the room extracted from query strings
socket.emit("JOIN_ROOM", { username, room });

socket.on("USERS_LIST", (list) => {
  ulist.innerHTML = `
    ${list.map((user) => `<li>${escapeHtml(user.username)}</li>`).join("")}
    `;
  const usersCountNode = document.querySelector("#usersCount");
  usersCountNode.textContent = `(${list.length})`;
});

// Nofitication from the server
socket.on("NOTIFICATION", (message) => {
  notificationArea.textContent = "🔔  " + message;
  const dot = notificationArea.previousElementSibling;
  dot.classList.add("animate-ping");
  dot.classList.remove("hidden");

  setTimeout(() => {
    dot.classList.remove("animate-ping");
    dot.classList.add("hidden");
  }, 4000);
});

socket.on("CHAT_MESSAGE_RECEIVE", ({ username, message }) => {
  const messageNode = Message(message, username);

  chatBox.appendChild(messageNode);
  messageNode.scrollIntoView({ behavior: "smooth" });

  if (cc.classList.contains("h-0")) {
    chatPingNode.classList.remove("hidden");
    chatPingNode.classList.add("animate-ping");
  }
});

function openChatBox() {
  var cf = document.getElementById("chat-container");
  cf.classList.toggle("h-0");
  chatPingNode.classList.remove("animate-ping");
  chatPingNode.classList.add("hidden");
}

socket.on("receive", ({ shared_code, team_current }) => {
  editor1.setValue(shared_code);
  changeClass1(team_current);
  saveToStorage1(editor1, team_current);
});

// Code Shared passed to the server
function shareCode() {
  const shared_code = editor1.getValue();
  socket.emit("send", { shared_code, team_current });
}

function YourMessage(message) {
  const div = document.createElement("div");
  div.className = "bg-yellow-300 p-2 rounded";
  div.innerHTML = `<p class="text-sm">${escapeHtml(message)}</p>
  <p class="text-xs mt-2">You</p>`;

  return div;
}

function Message(message, username) {
  const div = document.createElement("div");
  div.className = "bg-blue-200 p-2 rounded";
  div.innerHTML = `<p class="text-sm">${escapeHtml(message)}</p>
  <p class="text-xs mt-2">${escapeHtml(username)}</p>`;

  return div;
}

/*********** CLIENT SIDE ************/
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const messageInput = chatForm.querySelector("#messageInput");
  const message = messageInput.value;

  socket.emit("CHAT_MESSAGE_SEND", message);

  const messageNode = YourMessage(message);
  // Append message and scroll chat box to bottom
  chatBox.appendChild(messageNode);
  messageNode.scrollIntoView({ behavior: "smooth" });

  // Clear input and focus
  messageInput.value = "";
  messageInput.focus();
});

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function changeClass1(team_id) {
  team_classList[0].classList.remove("active");
  team_classList[1].classList.remove("active");
  team_classList[2].classList.remove("active");
  team_classList[3].classList.remove("active");
  team_classList[4].classList.remove("active");
  team_classList[team_id].classList.add("active");
}

function changeClass2(personal_id) {
  personal_c.classList.remove("active");
  personal_cpp.classList.remove("active");
  personal_java.classList.remove("active");
  personal_python.classList.remove("active");
  personal_python3.classList.remove("active");
  personal_id.classList.add("active");
}

function initialize_code() {
  templates.push(`#include <stdio.h>

int main() {
  // your code goes here
  return 0;
}
    `);
  templates.push(`#include <bits/stdc++.h>
using namespace std;

int main() {
  // your code goes here
  return 0;
}
    `);
  templates.push(`import java.util.*;
import java.lang.*;
import java.io.*;

/* Name of the class has to be "Main" only if the class is public. */
class Code
{
  public static void main (String[] args) throws java.lang.Exception{
	// your code goes here
  }
}
    `);
  templates.push(`# your code goes here`);
  templates.push(`# your code goes here`);
}

function initialize_mode() {
  modes.push("text/x-c++src");
  modes.push("text/x-c++src");
  modes.push("text/x-c++src");
  modes.push("text/x-python");
  modes.push("text/x-python");
}

function initialize_compiler() {
  compilers.push(11);
  compilers.push(44);
  compilers.push(10);
  compilers.push(4);
  compilers.push(116);
}

// Method to Set Default Values
function addDefault(editor, current) {
  editor.setValue(templates[current]);
}

//Methods used to set compilerId, compilerMode and default language code
function addCompilerOptions1(editor, type) {
  editor.setOption("mode", modes[type]);
  editor.setValue(TEAM_CODES[type]);
  team_compiler = compilers[type];
  team_current = type;
}

function addCompilerOptions2(editor, type) {
  editor.setOption("mode", modes[type]);
  editor.setValue(PERSONAL_CODES[type]);
  personal_compiler = compilers[type];
  personal_current = type;
}

//Methods used to run and compile team_code and personal_code
function get_output(submissionId, output) {
  const url =
    proxyUrl +
    "https://" +
    endpoint +
    "/api/v4/submissions/" +
    submissionId +
    "?access_token=" +
    accessToken;
  fetch(url, {
    method: "GET",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.executing === true) {
        sleep(2000);
        get_output(submissionId, output);
      } else {
        var result = data.result;
        var status = result.status;
        var output_data = "No Output";
        var publish = document.getElementById(output);
        publish.value =
          "Status Code: " + status.name.toUpperCase() + "\n\nOutput:\n";
        if (result.streams.output) {
          var output_link = result.streams.output.uri;
          const url = proxyUrl + output_link;
          fetch(url, {
            method: "GET",
          })
            .then(function (response) {
              return response.text();
            })
            .then(function (data) {
              output_data = data;
              publish.value = publish.value + output_data;
            })
            .catch(() => console.log("Some ERROR! Happened"));
        } else {
          publish.value = publish.value + output_data;
        }
      }
    })
    .catch(() => console.log("Some ERROR! Happened"));
}

function run_compile(editor, input, output, compiler) {
  var source_code = editor.getValue();
  var input_data = document.getElementById(input).value;
  var running = document.getElementById(output);
  running.value = "Code is running -----";
  const url = proxyUrl + mainUrl;
  fetch(
    url +
      new URLSearchParams({
        access_token: accessToken.toString(),
        compilerId: compiler.toString(),
        source: source_code.toString(),
        input: input_data.toString(),
      }),
    {
      method: "POST",
    }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      get_output(data.id, output);
    })
    .catch(() => console.log("Some ERROR! Happened"));
}

//Methods used to save team_code or personal_code to Local Storage
function saveToStorage1(editor, team_current) {
  console.log(team_current);
  TEAM_CODES[team_current] = editor.getValue();
  localStorage.setItem("IDE_1", JSON.stringify(TEAM_CODES));
}

function saveToStorage2(editor, personal_current) {
  PERSONAL_CODES[personal_current] = editor.getValue();
  localStorage.setItem("IDE_2", JSON.stringify(PERSONAL_CODES));
}

//Team's Code nav variables
var team_c = document.getElementById("c_1");
var team_cpp = document.getElementById("c++_1");
var team_java = document.getElementById("java_1");
var team_python = document.getElementById("python_1");
var team_python3 = document.getElementById("python3_1");

var team_classList = [team_c, team_cpp, team_java, team_python, team_python3];

//Personal Code nav variables
var personal_c = document.getElementById("c_2");
var personal_cpp = document.getElementById("c++_2");
var personal_java = document.getElementById("java_2");
var personal_python = document.getElementById("python_2");
var personal_python3 = document.getElementById("python3_2");

var templates = [];
initialize_code(); //To define the templates for some programming languages

var modes = [];
initialize_mode();

var compilers = [];
initialize_compiler();

let PERSONAL_CODES = ["", "", "", "", ""];
let TEAM_CODES = ["", "", "", "", ""];

//Getting default codes from Local Storage
let data1 = localStorage.getItem("IDE_1");
let data2 = localStorage.getItem("IDE_2");

if (data1) {
  TEAM_CODES = JSON.parse(data1);
} else {
  TEAM_CODES[0] = templates[0];
  TEAM_CODES[1] = templates[1];
  TEAM_CODES[2] = templates[2];
  TEAM_CODES[3] = templates[3];
  TEAM_CODES[4] = templates[4];
}

if (data2) {
  PERSONAL_CODES = JSON.parse(data2);
} else {
  PERSONAL_CODES[0] = templates[0];
  PERSONAL_CODES[1] = templates[1];
  PERSONAL_CODES[2] = templates[2];
  PERSONAL_CODES[3] = templates[3];
  PERSONAL_CODES[4] = templates[4];
}

//To choose which compiler_option is currently running for personal code and team's code
let personal_current = 0;
let team_current = 0;

var code1 = document.getElementById("team_code");
var code2 = document.getElementById("personal_code");

var editor1 = CodeMirror.fromTextArea(code1, {
  lineNumbers: true,
  matchBrackets: true,
  autoCloseBrackets: true,
  tabSize: 2,
});
var editor2 = CodeMirror.fromTextArea(code2, {
  lineNumbers: true,
  matchBrackets: true,
  autoCloseBrackets: true,
  tabSize: 2,
});

addCompilerOptions1(editor1, 0, team_current);
addCompilerOptions2(editor2, 0, personal_current);

// Running the code

// IDE Access Parameters (Need to be changed every 14 days)
var endpoint = "780dfb37.compilers.sphere-engine.com";
var accessToken = "05cc18c6b4517ed81603377261e667e2";
const proxyUrl = "https://cors-anywhere.herokuapp.com/";
const mainUrl = "https://" + endpoint + "/api/v4/submissions?";

var personal_compiler = compilers[0];
var team_compiler = compilers[0];
