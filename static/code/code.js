const socket = io();
const ulist = document.getElementById('ulist');
const tarea = document.getElementById('tarea');
const not = document.getElementById('not');
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// console.log({ username, room });

socket.emit('joinRoom', { username, room });

socket.on('message', message => {
    not.innerHTML = message;
});

socket.on('receive', receive => {
    editor1.setValue(receive);
});

socket.on('roomUsers', ({ room, users }) => {
    tarea.innerHTML = room;
    ulist.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
});

function rtshare(editor1) {
    var msg = editor1.getValue();
    // Emitting a message to the server
    // console.log(editor1.getValue());
    socket.emit('code', msg);
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function changeClass1(team_id){
    team_c.classList.remove("active");
    team_cpp.classList.remove("active");
    team_java.classList.remove("active");
    team_python.classList.remove("active");
    team_python3.classList.remove("active");

    team_id.classList.add("active");
}

function changeClass2(personal_id){
    personal_c.classList.remove("active");
    personal_cpp.classList.remove("active");
    personal_java.classList.remove("active");
    personal_python.classList.remove("active");
    personal_python3.classList.remove("active");

    personal_id.classList.add("active");
}

function initialize_code(){
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

function initialize_mode(){
    modes.push("text/x-c++src");
    modes.push("text/x-c++src");
    modes.push("text/x-c++src");
    modes.push("text/x-python");
    modes.push("text/x-python");
}

function initialize_compiler(){
    compilers.push(11);
    compilers.push(44);
    compilers.push(10);
    compilers.push(4);
    compilers.push(116);
}

function addDefault(editor){
    editor.setValue(templates[current]);
}

//Method used to set compilerId, compilerMode and default language code
function addCompilerOptions(editor, type){
    editor.setOption('mode', modes[type]);
    editor.setValue(CODES[type]);
    compiler = compilers[type];
    current = type;
}

function get_output(submissionId, output){
    const url = proxyUrl + 'https://' + endpoint + '/api/v4/submissions/' + submissionId + '?access_token=' + accessToken;
    fetch(url, {
        method: 'GET'
    })
    .then(function(response){  return response.json()  })
    .then(
        function(data){
            if (data.executing === true) {
                sleep(2000);
                get_output(submissionId, output);
            }
            else {
                var result = data.result;
                var status = result.status;
                var output_data = "No Output";
                var publish = document.getElementById(output);
                publish.value = 'Status Code: ' + status.name.toUpperCase() + '\nOutput:\n';
                if (result.streams.output) {
                    var output_link = result.streams.output.uri;
                    const url = proxyUrl + output_link;
                    fetch(url, {
                        method: 'GET'
                    })
                    .then(function(response){  return response.text()  })
                    .then(
                        function(data){
                            output_data = data;
                            publish.value = publish.value + output_data;
                        }
                    )
                    .catch(() => console.log("Some ERROR! Happened"));
                    
                }
                else{
                    publish.value = publish.value + output_data;
                }
            }
        }
    )
    .catch(() => console.log("Some ERROR! Happened"));
}

function run_compile(editor, input, output){
    var source_code = editor.getValue();
    var input_data = document.getElementById(input).value;
    var running = document.getElementById(output);
    running.value = "Code is running -----";
    const url = proxyUrl + mainUrl;
    fetch(url + new URLSearchParams({
        access_token: accessToken.toString(),
        compilerId: compiler.toString(),
        source: source_code.toString(),
        input: input_data.toString()
    }), {
        method: 'POST'
    })
    .then(function(response){  return response.json()  })
    .then(
        function(data){
            get_output(data.id, output);
        }
    )
    .catch(() => console.log("Some ERROR! Happened"));
}

function saveToStorage(editor){
    CODES[current] = editor.getValue();
    localStorage.setItem("IDE", JSON.stringify(CODES));
}

//Team's Code nav variables
var team_c = document.getElementById("c_1");
var team_cpp = document.getElementById("c++_1");
var team_java = document.getElementById("java_1");
var team_python = document.getElementById("python_1");
var team_python3 = document.getElementById("python3_1");

//Personal Code nav variables
var personal_c = document.getElementById("c_2");
var personal_cpp = document.getElementById("c++_2");
var personal_java = document.getElementById("java_2");
var personal_python = document.getElementById("python_2");
var personal_python3 = document.getElementById("python3_2");



var templates=[];
initialize_code(); //To define the templates for some programming languages

var modes=[];
initialize_mode();

var compilers=[];
initialize_compiler();

let CODES = ['','','','',''];

//Getting default codes from Local Storage
let data = localStorage.getItem("IDE");

if(data){
    CODES = JSON.parse(data);
}
else{
    CODES[0] = templates[0];
    CODES[1] = templates[1];
    CODES[2] = templates[2];
    CODES[3] = templates[3];
    CODES[4] = templates[4];
}

var current = 0;//To choose which compiler_option is currently running

var code1 = document.getElementById("team_code");
var code2 = document.getElementById("personal_code");

var editor1 = CodeMirror.fromTextArea(code1 , {
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    tabSize: 2
});



var editor2 = CodeMirror.fromTextArea(code2 , {
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    tabSize: 2
});

addCompilerOptions(editor1, 0);
addCompilerOptions(editor2, 0);

//                                  Running the code

// IDE Access Parameters (Need to be changed every 14 days)
var endpoint = '5f7b9d68.compilers.sphere-engine.com';
var accessToken = '18d67ae37ef25dcb576ade7d6e9ebf03';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const mainUrl = 'https://' + endpoint + '/api/v4/submissions?';

var compiler = compilers[0];
var sh = document.querySelector("[style='position: absolute; bottom: -1em; padding: 0px; width: 1px; height: 1em; outline: currentcolor none medium;']");
// sh.addEventListener('keyup', rtshare);
// editor1.addEventListener('keyup', rtshare);

// sleep(10000);
// const check = document.querySelector('.CodeMirror');
console.log(sh.value);