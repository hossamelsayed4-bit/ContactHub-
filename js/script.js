

var inputNameElement = document.getElementById("inputName");
var inputPhoneElement = document.getElementById("inputPhone");
var inputEmailElement = document.getElementById("inputEmail");
var inputAddressElement = document.getElementById("inputAddress");
var inputGroupElement = document.getElementById("inputGroup");
var notesElement = document.getElementById("exampleFormControlTextarea1");
var favoriteCheckbox = document.getElementById("inlineCheckbox1");
var emergencyCheckbox = document.getElementById("inlineCheckbox2");

var contacts = [];
var currentIndex = null;
var deleteIndex = null;

var storedContacts = localStorage.getItem("contacts");
if (storedContacts) {
  try {
    contacts = JSON.parse(storedContacts) || [];
  } catch {
    contacts = [];
  }
}

function nameValidation() {
  var regex = /^[a-zA-Z ]{2,50}$/;
  var msgName = document.getElementById("msgName");

  if (regex.test(inputNameElement.value.trim())) {
    inputNameElement.classList.add("is-valid");
    inputNameElement.classList.remove("is-invalid");
    msgName.classList.add("d-none");
    return true;
  }

  inputNameElement.classList.add("is-invalid");
  inputNameElement.classList.remove("is-valid");
  msgName.classList.remove("d-none");
  return false;
}

function phoneValidation() {
  var regex = /^01[0-2,5][0-9]{8}$/;
  var msgPhone = document.getElementById("msgPhone");

  if (regex.test(inputPhoneElement.value.trim())) {
    inputPhoneElement.classList.add("is-valid");
    inputPhoneElement.classList.remove("is-invalid");
    msgPhone.classList.add("d-none");
    return true;
  }

  inputPhoneElement.classList.add("is-invalid");
  inputPhoneElement.classList.remove("is-valid");
  msgPhone.classList.remove("d-none");
  return false;
}

function emailValidation() {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var msgEmail = document.getElementById("msgEmail");
  var value = inputEmailElement.value.trim();

  if (value === "" || regex.test(value)) {
    inputEmailElement.classList.add("is-valid");
    inputEmailElement.classList.remove("is-invalid");
    msgEmail.classList.add("d-none");
    return true;
  }

  inputEmailElement.classList.add("is-invalid");
  inputEmailElement.classList.remove("is-valid");
  msgEmail.classList.remove("d-none");
  return false;
}

function updateCounters() {
  var totalEl = document.getElementById("totalCount");
  var favEl = document.getElementById("favoritesCount");
  var emergencyEl = document.getElementById("emergencyCount");

  if (!totalEl || !favEl || !emergencyEl) return;

  totalEl.textContent = contacts.length;
  favEl.textContent = contacts.filter((c) => c.favorite).length;
  emergencyEl.textContent = contacts.filter((c) => c.emergency).length;
}

function renderSideLists() {
  var favContainer = document.getElementById("favoritesList");
  var emergencyContainer = document.getElementById("emergencyList");

  if (!favContainer || !emergencyContainer) return;

  var favorites = contacts.filter((c) => c.favorite);
  var emergencies = contacts.filter((c) => c.emergency);

  // Favorites
  favContainer.innerHTML = favorites.length
    ? favorites
        .map(
          (c) => `
        <div class="side-item">
          <div class="side-avatar">${c.name.charAt(0)}</div>
          <div>
            <strong>${c.name}</strong>
            <div class="side-phone">${c.phone}</div>
          </div>
        </div>
      `
        )
        .join("")
    : "<p>No favorites yet</p>";

  // Emergency
  emergencyContainer.innerHTML = emergencies.length
    ? emergencies
        .map(
          (c) => `
        <div class="side-item">
          <div class="side-avatar emergency-avatar">${c.name.charAt(0)}</div>
          <div>
            <strong>${c.name}</strong>
            <div class="side-phone">${c.phone}</div>
          </div>
        </div>
      `
        )
        .join("")
    : "<p>No emergency contacts yet</p>";
}

function displayContacts(list = contacts) {
  var container = document.getElementById("contactsContainer");
  var emptyState = document.getElementById("emptyState");

  container.innerHTML = "";

  if (list.length === 0) {
    emptyState.classList.remove("d-none");
    return;
  }

  emptyState.classList.add("d-none");

  list.forEach((c, index) => {
    container.innerHTML += `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card p-3 shadow-sm rounded-4">
          <div class="d-flex align-items-center mb-3">
            <div class="avatar me-2">${c.name.charAt(0)}</div>
            <div class="text-start">
              <h6 class="mb-1">${c.name}</h6>
              <small class="text-muted d-flex align-items-center">
                <i class="fa-solid fa-phone phone-icon"></i> ${c.phone}
              </small>
            </div>
          </div>

          <p class="mb-1 text-secondary d-flex"><strong><i class="fa-solid fa-envelope"></i></strong> ${
            c.email || "-"
          }</p>
          <p class="mb-1 text-secondary d-flex"><i class="fa-solid fa-location-dot"></i><strong></strong> ${
            c.address || "-"
          }</p>
          <p class="mb-1 group"><strong></strong> ${c.group || "-"}</p>

          <div class="d-flex justify-content-between p-1 mt-3 avatar-foot">

          <div class="d-flex gap-2">
          
          <i class="fa-solid fa-phone phone-icon phone-icon2"></i>    
          

          
          <i class="fa-solid fa-envelope envelope"></i>    
          
          </div>
          <div>
            <button class="btn btn-sm foot-btn" onclick="editContact(${index})">
              <i class="fa-solid fa-pen"></i>
            </button>

            <button class="btn foot-btn foot-btn2 ${
              c.favorite ? "btn-warning" : "btn-outline-warning"
            }"
              onclick="toggleFavorite(${index})">
              <i class="fa-solid fa-star"></i>
            </button>

            <button class="btn foot-btn foot-btn3 ${
              c.emergency ? "btn-danger" : "btn-outline-danger"
            }"
              onclick="toggleEmergency(${index})">
              <i class="fa-solid fa-heart-pulse"></i>
            </button>

            <button class="btn foot-btn foot-btn4"
              onclick="prepareDelete(${index}, '${c.name.replace(
      /'/g,
      "\\'"
    )}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
          </div>
        </div>
      </div>
    `;
  });
}

function addContact() {
  if (!nameValidation() || !phoneValidation() || !emailValidation()) return;

  var contact = {
    name: inputNameElement.value.trim(),
    phone: inputPhoneElement.value.trim(),
    email: inputEmailElement.value.trim(),
    address: inputAddressElement.value.trim(),
    group: inputGroupElement.value,
    notes: notesElement.value.trim(),
    favorite: favoriteCheckbox.checked,
    emergency: emergencyCheckbox.checked,
  };

  if (currentIndex === null) {
    contacts.push(contact);
  } else {
    contacts[currentIndex] = contact;
    currentIndex = null;
  }

  localStorage.setItem("contacts", JSON.stringify(contacts));
  clearForm();
  displayContacts();
  updateCounters();
  renderSideLists();

  var modal = bootstrap.Modal.getInstance(
    document.getElementById("exampleModal")
  );
  modal?.hide();
}

document.getElementById("saveContactBtn").addEventListener("click", addContact);

function clearForm() {
  document.querySelector("form").reset();
  inputNameElement.classList.remove("is-valid", "is-invalid");
  inputPhoneElement.classList.remove("is-valid", "is-invalid");
  inputEmailElement.classList.remove("is-valid", "is-invalid");
}

function editContact(index) {
  var c = contacts[index];
  if (!c) return;

  currentIndex = index;

  inputNameElement.value = c.name;
  inputPhoneElement.value = c.phone;
  inputEmailElement.value = c.email || "";
  inputAddressElement.value = c.address || "";
  notesElement.value = c.notes || "";
  favoriteCheckbox.checked = !!c.favorite;
  emergencyCheckbox.checked = !!c.emergency;
  inputGroupElement.value = c.group || "";

  new bootstrap.Modal(document.getElementById("exampleModal")).show();
}

function toggleFavorite(index) {
  if (!contacts[index]) return;
  contacts[index].favorite = !contacts[index].favorite;
  localStorage.setItem("contacts", JSON.stringify(contacts));
  displayContacts();
  updateCounters();
  renderSideLists();
}

function toggleEmergency(index) {
  if (!contacts[index]) return;
  contacts[index].emergency = !contacts[index].emergency;
  localStorage.setItem("contacts", JSON.stringify(contacts));
  displayContacts();
  updateCounters();
  renderSideLists();
}

function prepareDelete(index, name) {
  deleteIndex = index;
  document.getElementById("deleteModalName").innerText = name;
  new bootstrap.Modal(document.getElementById("deleteModal")).show();
}

function deleteContactConfirmed() {
  if (deleteIndex === null) return;
  contacts.splice(deleteIndex, 1);
  deleteIndex = null;
  localStorage.setItem("contacts", JSON.stringify(contacts));
  displayContacts();
  updateCounters();
  renderSideLists();
  var deleteModal = bootstrap.Modal.getInstance(
    document.getElementById("deleteModal")
  );
  deleteModal?.hide();
}


document.getElementById("searchInput").addEventListener("input", function () {
  var query = this.value.toLowerCase().trim();

  if (!query) {
    displayContacts();
    updateCounters();
    renderSideLists();

    return;
  }

  var filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      (c.email && c.email.toLowerCase().includes(query)) ||
      c.phone.includes(query)
  );

  displayContacts(filtered);
});

displayContacts();
updateCounters();
renderSideLists();

