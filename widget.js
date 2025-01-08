

var root = document.getElementById("wrapper");

var searchBox = document.createElement("input");
searchBox.type = "text";
searchBox.id = "inputSearch";
searchBox.placeholder = "Search for Name or ID";
searchBox.className = "myCSS"
root.append(searchBox)

var primaryButton = document.createElement("button");
primaryButton.className = "primary";
primaryButton.innerHTML = "Click Here"
root.append(primaryButton);

var secondaryButton = document.createElement("button");
secondaryButton.className = "secondary";
secondaryButton.innerHTML = "Click Here"
root.append(secondaryButton);