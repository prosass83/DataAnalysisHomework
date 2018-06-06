// Get references to the tbody element, input field and button
var $tbody = document.querySelector("tbody");
var $filterInput = document.querySelector("#filter");
var $searchBtn = document.querySelector("#search");
var $searchInput = document.querySelector("#searchString");

// Add an event listener to the searchButton, call handleSearchButtonClick when clicked
$searchBtn.addEventListener("click", handleSearchButtonClick);

// Set filteredAddresses to dataSet initially
var filteredAddresses = dataSet;

// renderTable renders the filteredAddresses to the tbody
function renderTable() {
  $tbody.innerHTML = "";
  for (var i = 0; i < filteredAddresses.length; i++) {
    // Get get the current address object and its fields
    var address = filteredAddresses[i];
    var fields = Object.keys(address);
    // Create a new row in the tbody, set the index to be i + startingIndex
    var $row = $tbody.insertRow(i);
    for (var j = 0; j < fields.length; j++) {
      // For every field in the address object, create a new cell and set its inner text to be the current value at the current address's field
      var field = fields[j];
      var $cell = $row.insertCell(j);
      $cell.innerText = address[field];
    }
  }
}

function handleSearchButtonClick() {
    // Format the user's search by removing leading and trailing whitespace, lowercase the string
    var filterSearchText = $searchInput.value.trim().toLowerCase();
    var filterSearchType = $filterInput.value.trim().toLowerCase();
  
    // Set filteredAddresses to an array of all addresses whose "datetime" matches the filter
    switch (filterSearchType) {
      case "datetime":
        console.log("Here. The filter type used is: ")
        console.log(filterSearchType)
        console.log("And the value to search for is: ")
        console.log($searchInput.value)
        filteredAddresses = dataSet.filter(function(address) {
        var addressState = address.datetime.toLowerCase();
    
        // If true, add the address to the filteredAddresses, otherwise don't add it to filteredAddresses
        return addressState === filterSearchText;
      });
        break;
      case "city":
        console.log("Here. The filter type used is: ")
        console.log(filterSearchType)
        filteredAddresses = dataSet.filter(function(address) {
        var addressState = address.city.toLowerCase();
    
        // If true, add the address to the filteredAddresses, otherwise don't add it to filteredAddresses
        return addressState === filterSearchText;
      });
        break;
      case "state":
        console.log("Here. The filter type used is: ")
        console.log(filterSearchType)
        filteredAddresses = dataSet.filter(function(address) {
        var addressState = address.state.toLowerCase();
    
        // If true, add the address to the filteredAddresses, otherwise don't add it to filteredAddresses
        return addressState === filterSearchText;
      });
        break;
      case "country":
        console.log("Here. The filter type used is: ")
        console.log(filterSearchType)
        filteredAddresses = dataSet.filter(function(address) {
        var addressState = address.country.toLowerCase();
    
        // If true, add the address to the filteredAddresses, otherwise don't add it to filteredAddresses
        return addressState === filterSearchText;
      });
      break;
      case "shape":
        console.log("Here. The filter type used is: ")
        console.log(filterSearchType)
        filteredAddresses = dataSet.filter(function(address) {
        var addressState = address.shape.toLowerCase();
    
        // If true, add the address to the filteredAddresses, otherwise don't add it to filteredAddresses
        return addressState === filterSearchText;
      });
        break;
      }
    renderTable();
  }

// Render the table for the first time on page load
renderTable();
