"use strict";
const getUsername = document.querySelector("#user");
const formSubmit = document.querySelector("#form");
const main_container = document.querySelector(".main_container");
async function myCustomFetcher(url) {
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Network response was not ok - status: ${response.status}`);
    }
    let data = await response.json();
    return data;
}
const showUser = (singleUser) => {
    const { avatar_url, login, url, html_url } = singleUser;
    main_container.insertAdjacentHTML("beforeend", `<a href="${html_url}">
            <div class="card">
            <img src="${avatar_url}" alt="${login}"/>
            <p class="username">${login}</p>
            <hr/>
            <div class="card-footer">
                <img src="${avatar_url}" alt="${login}"/>
                <a href="${html_url}" class="link">GitHub</a>
            </div>
            </div>
        </a>`);
};
function fetchUserData(url) {
    myCustomFetcher(url).then((UserInfo) => {
        for (const currUser of UserInfo) {
            showUser(currUser);
        }
    });
}
fetchUserData("https://api.github.com/users");
getUsername.addEventListener("input", () => {
    searchFunctionality();
});
formSubmit.addEventListener("submit", (event) => {
    event.preventDefault();
    searchFunctionality();
});
async function searchFunctionality() {
    const searchTerm = getUsername.value.toLowerCase();
    const url = "https://api.github.com/users";
    const allUsersData = await myCustomFetcher(url);
    const matchingUser = allUsersData.filter((user) => {
        return user.login.toLowerCase().includes(searchTerm);
    });
    main_container.innerHTML = "";
    if (matchingUser.length === 0) {
        main_container.insertAdjacentHTML("beforeend", `
            <p class="empty-msg">No matching users found.</p>
            `);
    }
    else {
        for (const singleUser of matchingUser) {
            showUser(singleUser);
        }
    }
}
