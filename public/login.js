const loginForm = document.querySelector("#post");
const usernameInput = loginForm.querySelector("input#username");
const teamidInput = loginForm.querySelector("input#room");
const errorNode = document.querySelector("#error");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  errorNode.textContent = "";
  const username = usernameInput.value;
  const teamid = teamidInput.value;
  if (username.includes(" ")) {
    return (errorNode.textContent = "Username must not contain any space.");
  }

  if (teamid.includes(" ")) {
    return (errorNode.textContent = "Team ID must not contain any space.");
  }

  // Form validated, navigate to main app

  window.location.assign(`code/code.html?username=${username}&room=${teamid}`);
});
