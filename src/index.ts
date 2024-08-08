const getUsername=document.querySelector("#user") as HTMLInputElement;
const formSubmit=document.querySelector("#form") as HTMLFormElement;
const main_container=document.querySelector(".main_container") as HTMLElement;

interface UserData{
    id:number,
    login:string,
    avatar_url:string,
    url:string,
    html_url:string
}

async function myCustomFetcher<T>(url:string):Promise<T>{
    let response=await fetch(url);
    if(!response.ok){
        throw new Error(`Network response was not ok - status: ${response.status}`)
    }
    let data=await response.json();
    return data;
}

const showUser=(singleUser:UserData)=>{
    const {avatar_url,login,url,html_url}=singleUser;
    main_container.insertAdjacentHTML("beforeend",
        `<a href="${html_url}">
            <div class="card">
            <img src="${avatar_url}" alt="${login}"/>
            <p class="username">${login}</p>
            <hr/>
            <div class="card-footer">
                <img src="${avatar_url}" alt="${login}"/>
                <a href="${html_url}" class="link">GitHub</a>
            </div>
            </div>
        </a>`
    );
}
function fetchUserData(url:string){
    myCustomFetcher<UserData[]>(url).then((UserInfo)=>{
        for(const currUser of UserInfo){
            showUser(currUser)
        }
    });
}

fetchUserData("https://api.github.com/users");

getUsername.addEventListener("input",()=>{
    searchFunctionality();
});

formSubmit.addEventListener("submit",(event)=>{
    event.preventDefault();
    searchFunctionality();
})

async function searchFunctionality(){
    const searchTerm=getUsername.value.toLowerCase();
    const url="https://api.github.com/users";
    const allUsersData:UserData[]= await myCustomFetcher<UserData[]>(url);
    const matchingUser=allUsersData.filter((user)=>{
        return user.login.toLowerCase().includes(searchTerm);
    });
    main_container.innerHTML="";
    if(matchingUser.length===0){
        main_container.insertAdjacentHTML("beforeend",
            `
            <p class="empty-msg">No matching users found.</p>
            `
        )
    }
    else{
        for(const singleUser of matchingUser){
            showUser(singleUser);
        }
    }
}