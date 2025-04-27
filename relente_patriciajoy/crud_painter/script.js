const endPoint = `https://dimgrey-parrot-643194.hostingersite.com/` +
  `exercises/games.php`;

// CREATE Artist
function createData() {
  const firstname = document.querySelector("#firstname").value;
  const lastname = document.querySelector("#lastname").value;
  const nationality = document.querySelector("#nationality").value;
  const artstyle = document.querySelector("#art_style").value;
  const artwork = document.querySelector("#art_work").value;

  // Validate form fields
  if (!firstname || !lastname || !nationality || !artstyle || !artwork) {
    alert("Please fill out all fields.");
    return;
  }

  fetch("main.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      firstname,
      lastname,
      nationality,
      artstyle,
      artwork
    }),
  })

    .then(res => res.text())
    .then(data => {
      alert(data); // Alert the response from PHP
      window.location.reload();
    })
    .catch(err => {
      console.error("Error:", err);
    });
}

// DELETE Artist
function deleteData(artist_id) {
  if (!confirm("Are you sure you want to delete this artist?")) return;

  fetch("main.php", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      artist_id
    }),
  })
    .then(res => res.text())
    .then(data => {
      alert(data);
      window.location.reload(); // Reload table after deletion
    })
    .catch(err => {
      console.error("Error:", err);
    });
}

// READ Artists and Display Table
function readData() {
  fetch("main.php")
    .then((response) => response.json())
    .then((userList) => {
      const table = document.querySelector("#artist_list");

      // Reset table header
      table.innerHTML = `
        <tr>
          <th>Artist ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Nationality</th>
          <th>Artistic Style</th>
          <th>Art Work</th>
        </tr>
      `;

      // Populate table rows
      userList.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${user.artist_id}</td>
          <td contenteditable="false">${user.firstname}</td>
          <td contenteditable="false">${user.lastname}</td>
          <td contenteditable="false">${user.nationality}</td>
          <td contenteditable="false">${user.artistic_style}</td>
          <td contenteditable="false">${user.artwork}</td>
          <td>
            <button onclick="toggleEdit(this, ${user.artist_id})">
              Update
            </button>
            <button onclick="deleteData(${user.artist_id})">Delete</button>
          </td>
        `;
        table.appendChild(row);
      });
    })
    .catch(err => {
      console.error("Error:", err);
    });
}

function toggleEdit(button, artist_id) {
  const row = button.parentElement.parentElement;
  const cells = row.querySelectorAll("td");

  // Constants for editable table cell range
  const EDITABLE_START_INDEX = 1;
  const EDITABLE_END_INDEX = 5;

  const isUpdateMode = button.innerText === "Update";

  if (isUpdateMode) {
    for (let i = EDITABLE_START_INDEX; i <= EDITABLE_END_INDEX; i++) {
      cells[i].setAttribute("contenteditable", "true");
    }
    button.innerText = "Save";
    return;
  }

  const firstname = cells[1].innerText;
  const lastname = cells[2].innerText;
  const nationality = cells[3].innerText;
  const artistic_style = cells[4].innerText;
  const artwork = cells[5].innerText;

  fetch("main.php", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      artist_id,
      firstname,
      lastname,
      nationality,
      artistic_style,
      artwork
    }),
  })
    .then(res => res.text())
    .then(data => {
      alert(data);
      for (let i = EDITABLE_START_INDEX; i <= EDITABLE_END_INDEX; i++) {
        cells[i].setAttribute("contenteditable", "false");
      }
      button.innerText = "Update";
    })
    .catch(err => {
      console.error("Error:", err);
    });
}