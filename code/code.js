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

setTabKey(editor1);
setTabKey(editor2);