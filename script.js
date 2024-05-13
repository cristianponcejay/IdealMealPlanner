$(document).ready(function() {
    // Filter functionality
    $('.buttons').click(function() {
        // Add 'active' class to the clicked button and remove it from siblings
        $(this).addClass('active').siblings().removeClass('active');
        var filter = $(this).attr('data-filter');
        // Show or hide boxes based on filter
        if (filter == 'all') {
            $('.diet .box').show(400); // Show all boxes
        } else {
            $('.diet .box')
                .hide(200) // Hide all boxes with animation
                .filter('.' + filter)
                .show(400); // Show filtered boxes with animation
        }
    });

    // Popup functionality for meal plan
    $('.meal-planner tbody tr').on('click', 'td:not(.action-cell)', function() {
        var mealName = $(this).text().trim(); // Get clicked meal name
        var modal = $('#food-modal'); // Get modal element
        // Example data, replace with actual data retrieval
        var ingredients = "Example ingredients";
        var instructions = "Example instructions";
        var nutritionFacts = "Example nutrition facts";
        // Set modal content
        modal.find('#food-name').text(mealName);
        modal.find('#ingredients').text(ingredients);
        modal.find('#instructions').text(instructions);
        modal.find('#nutrition-facts').text(nutritionFacts);
        // Show modal
        modal.css("display", "block"); // Show the modal
    });

    // Close modal when clicking on close button or outside the modal
    $('.close, #food-modal').click(function(e) {
        if (e.target.id == 'food-modal' || $(e.target).hasClass('close')) {
            $('#food-modal').css("display", "none"); // Hide the modal
        }
    });
});

// Function to set meal name
function mealName(meal) {
    document.getElementById('inputMeal').value = meal;
}

// XML Document initialization
let xmlStorage;
if (localStorage.getItem('xmlStorage') === null) {
    // Create new XML document if not exists in local storage
    xmlStorage = document.implementation.createDocument(null, 'data');
    localStorage.setItem('xmlStorage', new XMLSerializer().serializeToString(xmlStorage));
} else {
    // Parse XML document from local storage
    let parser = new DOMParser();
    xmlStorage = parser.parseFromString(localStorage.getItem('xmlStorage'), 'application/xml');
}

// Display existing data on page load
displayData();

// Event listener for form submission
document.getElementById("mealform").addEventListener('submit', function(event) {
    event.preventDefault();
    let day = document.getElementById('day').value;
    let mealname = document.getElementById('inputMeal').value;
    let list = xmlStorage.getElementsByTagName('add');
    if (list.length === 7) {
        return alert('The week planner is full');
    }
    if (day === '' || mealname === '') {
        alert("Fill up all the fields");
    } else {
        let data = xmlStorage.createElement('add');
        data.innerHTML = `<day>${day}</day><meal>${mealname}</meal>`;
        xmlStorage.documentElement.appendChild(data);
        localStorage.setItem('xmlStorage', new XMLSerializer().serializeToString(xmlStorage));
        displayData();
        // Clear input fields after submission
        document.getElementById("day").value = '';
        document.getElementById('inputMeal').value = '';
    }
});

// Function to display data from XML
function displayData() {
    let dataList = document.getElementById('data-list');
    dataList.innerHTML = '';
    let entries = xmlStorage.getElementsByTagName('add');
    for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        let day = entry.getElementsByTagName('day')[0].textContent;
        let mealname = entry.getElementsByTagName('meal')[0].textContent;
        // Create row for each entry and append to data list
        let row = `<tr><td>${day}</td><td>${mealname}</td><td><i class="fas fa-trash-alt delete-icon" onclick="deleteData(${i})"></i></td></tr>`;
        dataList.innerHTML += row;
    }
}

// Function to delete data entry
function deleteData(index) {
    // Remove entry from XML document and update local storage
    xmlStorage.documentElement.removeChild(xmlStorage.getElementsByTagName('add')[index]);
    localStorage.setItem('xmlStorage', new XMLSerializer().serializeToString(xmlStorage));
    displayData(); // Update displayed data
}