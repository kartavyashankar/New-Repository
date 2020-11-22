function addDefault(){
    var template = `#include <bits/stdc++.h>
using namespace std;
    
int main(){
  return 0;
}`;
    return template;
}

function setTabKey(editor){
    editor.setOption("extraKeys", {
        Tab: function(cm) {
          var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
          cm.replaceSelection(spaces);
        }
    });
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}


// A function to choose mode must be inserted

// Also the mode must be choosen for display and running explicitly

var code1 = document.getElementById("team_code");
var code2 = document.getElementById("personal_code");
code1.value = addDefault();
code2.value = addDefault();
var editor1 = CodeMirror.fromTextArea(document.getElementById("team_code"), {
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    mode: "text/x-c++src"
});
var editor2 = CodeMirror.fromTextArea(document.getElementById("personal_code"), {
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    mode: "text/x-c++src"
});

//setTabKey(editor1);
setTabKey(editor2);



//                                  Running the code


// IDE Access Parameters (Need to be changed every 14 days)
var endpoint = '5f7b9d68.compilers.sphere-engine.com';
var accessToken = '18d67ae37ef25dcb576ade7d6e9ebf03';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const mainUrl = 'https://' + endpoint + '/api/v4/submissions?';


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
                if (result.streams.output) {
                    output_data = result.streams.output.uri;
                }
                var publish = document.getElementById(output);
                publish.value = 'Status Code: ' + status.name.toUpperCase() + '\n\nOutput Link: ' + output_data;
            }
        }
    )
    .catch(() => console.log("Some ERROR! Happened"));
}

function run_compile(editor, input, output){
    var compiler = 41;
    var source_code = editor.getValue();
    var input_data = document.getElementById(input).value;
    const url = proxyUrl + mainUrl;
    fetch(url +new URLSearchParams({
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