function AddToTable() {
    const nameInput = document.querySelector(".Prenom");
    const surnameInput = document.querySelector(".Nom");
    const dateInput = document.querySelector(".DateHeure");
    const moneyInput = document.querySelector(".Somme");
    const optionSelect = document.querySelector('select');
    const table = document.getElementById("myTable");

    // Validate inputs
    if (nameInput.value === "" || !isNaN(nameInput.value)) {
        nameInput.classList.add("is-invalid");
        return;
    }

    if (surnameInput.value === "") {
        surnameInput.classList.add("is-invalid");
        return;
    }

    if (dateInput.value === "") {
        dateInput.classList.add("is-invalid");
        return;
    }

    const moneyValue = parseInt(moneyInput.value);
    if (isNaN(moneyValue) || moneyValue <= 0) {
        alert("La somme doit commencer par 1 Fcfa");
        moneyInput.classList.add("is-invalid");
        return;
    }

    // Remove validation styles
    nameInput.classList.remove("is-invalid");
    surnameInput.classList.remove("is-invalid");
    dateInput.classList.remove("is-invalid");
    moneyInput.classList.remove("is-invalid");

    // Create a new row
    const newRow = table.insertRow(1);
    newRow.insertCell(0).textContent = nameInput.value;
    newRow.insertCell(1).textContent = surnameInput.value;
    newRow.insertCell(2).textContent = dateInput.value;
    if(optionSelect.value === "Retrait"){
        newRow.insertCell(3).textContent = -moneyValue + " FCFA";
    }
    else{
        newRow.insertCell(3).textContent = moneyValue + " FCFA";
    }
    newRow.insertCell(4).textContent = optionSelect.value;

    // Calculate and update the total sum
    const totalSumElement = document.getElementById("SommeTotale");
    const currentTotal = parseInt(totalSumElement.textContent);
    const newRowAmount = moneyValue;
    const newTotal = currentTotal + newRowAmount;

    if (optionSelect.value === "Retrait" && newRowAmount <= currentTotal) {
        const newTotal = currentTotal - newRowAmount;
        totalSumElement.textContent = newTotal + " Fcfa";
    }
    else if (optionSelect.value === "Retrait" && newRowAmount > currentTotal) {
        alert("Vous ne pouvez retirer une somme qui est plus grande que la somme actuelle de la caisse");
        totalSumElement.textContent = currentTotal + " Fcfa";
        table.deleteRow(newRow.rowIndex);
    } 
    else {
        totalSumElement.textContent = newTotal + " Fcfa";
    }


    // Create "Modifier" and "Supprimer" buttons
    const modifyButton = createActionButton("Modifier", function() {
        modifyRow(newRow);
        const row = this.closest("tr");
        const moneyCell = row.cells[3]; // Assuming the money value is in the 4th cell (index 3)
        const moneyValue = parseFloat(moneyCell.textContent);

        // Subtract the money value from newTotal
        const totalSumElement = document.getElementById("SommeTotale");
        const currentTotal = parseFloat(totalSumElement.textContent);
        const newTotal = currentTotal - moneyValue;

        totalSumElement.textContent = newTotal + " Fcfa";

        // Delete the row
        row.remove();
    });
    // function supprimer
    const deleteButton = createActionButton("Supprimer", function() {
        const row = this.closest("tr");
        const moneyCell = row.cells[3]; // Assuming the money value is in the 4th cell (index 3)
        const moneyValue = parseFloat(moneyCell.textContent);

        // Delete the row
        row.remove();
    });

    // Append buttons to the "Action" cell
    const actionCell = newRow.insertCell(5);
    actionCell.appendChild(modifyButton);
    actionCell.appendChild(deleteButton);

    // Clear input fields
    nameInput.value = "";
    surnameInput.value = "";
    dateInput.value = "";
    moneyInput.value = "";
    optionSelect.value = "Dépot";
    

    // Define the number of rows to display per page
    const rowsPerPage = 5;
    let currentPage = 1;

    //display rows for the current page
    function updateTable() {
        const table = document.getElementById("myTable");
        const rows = table.rows;
    
        const DebutIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = DebutIndex + rowsPerPage;
    
        for (let l = 1; l < rows.length; l++) {
            rows[l].style.display = (l > DebutIndex && l <= endIndex) ? "" : "none";
        }
    }
    updateTable();
    // Pagination event listeners
    document.getElementById("prevPage").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updateTable();
        }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
        const table = document.getElementById("myTable");
        const totalRows = table.rows.length - 1; // Subtract the header row
        const totalPages = Math.ceil(totalRows / rowsPerPage);

        if (currentPage < totalPages) {
            currentPage++;
            updateTable();
        }
    });

    // Initialize and update the table
    window.addEventListener("load", () => {
        updateTable();
    });

}
// Button modifier et supprimer
function createActionButton(text, clickHandler) {
    const button = document.createElement("button");
    button.textContent = text;
    button.className = `btn btn-${text === "Modifier" ? "warning" : "danger"} me-3 btn-sm`;
    button.onclick = clickHandler;
    return button;
}

// function modifier
function modifyRow(row) {
    const nameInput = document.querySelector(".Prenom");
    const surnameInput = document.querySelector(".Nom");
    const dateInput = document.querySelector(".DateHeure");
    const moneyInput = document.querySelector(".Somme");
    const optionSelect = document.querySelector('select');

    nameInput.value = row.cells[0].textContent;
    surnameInput.value = row.cells[1].textContent;
    dateInput.value = row.cells[2].textContent;
    moneyInput.value = parseFloat(row.cells[3].textContent);
    optionSelect.value = row.cells[4].textContent;

}

// Barre de recherche
const searchInp = document.getElementById("search");
searchInp.addEventListener("input", function () {
    const filter = searchInp.value.toLowerCase();
    const table = document.getElementById("myTable");
    const rows = table.getElementsByTagName("tr");

    Array.from(rows).slice(1).forEach(row => {
        const cols = row.getElementsByTagName("td");
        let shouldDisplay = false;

        Array.from(cols).slice(0, 2).forEach(col => {
            if (col) {
                const text = col.textContent || col.innerText;
                if (text.toLowerCase().indexOf(filter) > -1) {
                    shouldDisplay = true;
                }
            }
        });

        row.style.display = shouldDisplay ? "" : "none";
    });
});
