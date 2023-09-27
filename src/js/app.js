const API = 'http://localhost:3000/users'

// Находим элементы на странице

// Create User Element
const addBtn = document.querySelector('#addBtn')
const name = document.querySelector('#name')
const surname = document.querySelector('#surname')
const age = document.querySelector('#age')
const url = document.querySelector('#url')

// User List
const list = document.querySelector('#list')

// Edit User Element
const saveEditBtn = document.querySelector('#editSave')
const editName = document.querySelector('#editName')
const editSurname = document.querySelector('#editSurname')
const editAge = document.querySelector('#editAge')
const editUrl = document.querySelector('#editUrl')

// Search
const searchInput = document.querySelector('#searchInput')
const search = document.querySelector('#search')
const cancel = document.querySelector('#cancel')

// Modal
const overflow = document.querySelector('#overflow')
const modal = document.querySelector('[data-modal]')

// Add Event Handler

// Create New User
addBtn.addEventListener('click', addNewUser)

// Reading All Users In DB
window.addEventListener('DOMContentLoaded', async () => {
	await readUser(API)
})

// Show Edit User Information
window.addEventListener('click', showEditUserInformation)

// Update User
saveEditBtn.addEventListener('click', updateNewUser)

// Delete User
list.addEventListener('click', deleteNewUser)

// Modal Overflow
overflow.addEventListener('click', () => {
	modal.classList.add('hidden')
})

// Search
search.addEventListener('click', searchUser)

// Cancel Search
cancel.addEventListener('click', () => {
	// Render
	readUser(API)

	// Clear Input Value'
	searchInput.value = ''
})

// Function

// Add New User
async function addNewUser(e) {
	e.preventDefault()

	let obj = {
		name: name.value,
		surname: surname.value,
		age: age.value,
		url: url.value,
		id: Date.now(),
	}

	if (
		!name.value.trim() ||
		!surname.value.trim() ||
		!age.value.trim() ||
		!url.value.trim()
	) {
		alert('Заполните все поля')
		return
	}

	// Create User
	await createUser(API, obj)

	// Clear Input Value
	name.value = ''
	surname.value = ''
	age.value = ''
	url.value = ''

	// Render
	await readUser(API)
}

// HTML Structure
function structureHTML({ name, surname, age, url, id }) {
	list.insertAdjacentHTML(
		'beforeend',
		`
        <div class="max-w-max mx-auto border border-solid border-gray-500 p-3 rounded-xl mb-10 special" id=${id}>
        <img src=${url}
            class="w-[350px] h-[300px] hover:scale-105 transition-all duration-500" alt="img">
        <div class="w-full flex flex-col items-center mb-3">
            <h4 class="text-2xl font-bold pb-2 specialName">${name}</h4>
            <p class="text-2xl pb-2">${surname}</p>
            <p class="text-[20px]">${age}</p>
        </div>
        <div class="w-full flex justify-around">
            <button class="border border-solid border-gray-500 rounded-xl py-2 px-4 text-white bg-red-500 hover:bg-red-800 delete"
                id="delete">Delete
            </button>
            <button class="border border-solid border-gray-500 rounded-xl py-2 px-4 text-white bg-green-500 hover:bg-green-800 edit"
                id="edit">Edit
            </button>
        </div>
    </div>
  `
	)
}

// Delete New User
async function deleteNewUser(e) {
	e.preventDefault()

	const el = e.target.closest('.special')

	if (e.target.classList.contains('delete')) {
		await deleteUser(API, el.id)

		el.remove()

		await readUser(API)
	}
}

// Show Information Edit User
async function showEditUserInformation(e) {
	e.preventDefault()

	if (e.target.classList.contains('edit')) {
		const id = e.target.closest('.special').id

		modal.classList.remove('hidden')

		await fetch(`${API}/${id}`)
			.then(res => res.json())
			.then(data => {
				editName.value = data.name
				editSurname.value = data.surname
				editAge.value = data.age
				editUrl.value = data.url

				saveEditBtn.setAttribute('id', id)
			})
	}
}

// Update New User
async function updateNewUser(e) {
	e.preventDefault()

	const id = e.target.id

	let obj = {
		name: editName.value,
		surname: editSurname.value,
		age: editAge.value,
		url: editUrl.value,
		id: id,
	}

	if (
		!editName.value.trim() ||
		!editSurname.value.trim() ||
		!editAge.value.trim() ||
		!editUrl.value.trim()
	) {
		alert('Заполните все поля')
		return
	}

	await updateUser(API, id, obj)

	modal.classList.add('hidden')

	await readUser(API)
}

// Search User
function searchUser() {
	if (!searchInput.value.trim()) {
		alert('Поле поиска пустое')
		return
	}

	// Search Input value
	let value = searchInput.value

	// Find User
	findUser(API, value)

	// Clear Input value
	searchInput.value = ''
}

// Fetch requests

// Create
async function createUser(url, body) {
	await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})
}

// Read
async function readUser(url) {
	list.innerHTML = ''

	const res = await fetch(url)
	const data = await res.json()
	// console.log(data)

	data.forEach(user => {
		structureHTML(user)
	})
}

// Update
async function updateUser(url, id, body) {
	await fetch(`${url}/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})
}

// Delete
async function deleteUser(url, id) {
	await fetch(`${url}/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	})
}

// Find
async function findUser(url, value) {
	const res = await fetch(`${url}?q=${value}`)
	const data = await res.json()

	list.innerHTML = ''
	data.forEach(user => {
		structureHTML(user)
	})
}
