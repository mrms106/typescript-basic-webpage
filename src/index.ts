const getUsername=document.querySelector("#user") as HTMLInputElement
const formSubmit = document.querySelector("#form") as HTMLFormElement
const main_container=document.querySelector(".main_container") as HTMLElement


// contract of an object
interface UserData{
    id:number;
    login:string;
    avatar_url:string;
    location:string;
    url:string
}

// reusable fun
async function myCustomfetcher<T>(url:string,options?:RequestInit):Promise<T>{
  const respose=await fetch(url,options)
  if(!respose.ok){
    throw new Error(
       ` network responce is not ok-status ${respose.status}`
    )
}
const data=await respose.json()
console.log((data))
return data;
}
// display ui
const shoResultUI=(singlUser:UserData)=>{
    const{avatar_url,login,url,location}=singlUser
     main_container.insertAdjacentHTML(
        "beforeend",
        `<div class='card'> 
    <img src=${avatar_url} alt=${login} />
    <hr />
    <div class="card-footer">
      <img src="${avatar_url}" alt="${login}" /> 
      <a href="${url}"> Github </a>
    </div>
    </div>`
     )
}
// default fun call
function fetchUserData(url:string){
    myCustomfetcher<UserData[]>(url,{}).then((userINfo)=>{
          for(const singlUser of userINfo){
            shoResultUI(singlUser)
          }
    })
}
fetchUserData("https://api.github.com/users")

// perform search

formSubmit.addEventListener("submit",async(e)=>{
  e.preventDefault();
  const serchTerm =getUsername.value.toLowerCase();

  try{
    const url="https://api.github.com/users"
    const allUserData=await myCustomfetcher<UserData[]>(url,{})
    const matchUser=allUserData.filter((user)=>{
        return  user.login.toLowerCase().includes(serchTerm)
    });
    main_container.innerHTML=""
    if(matchUser.length===0){
        main_container.insertAdjacentHTML(
            "beforeend",
            '<p class="empty-msg">no matching users found</p>'
        )
    }else{
        for(const singlUser of matchUser){
            shoResultUI(singlUser)
        }
    }
  }catch(err){
    console.log(err)
  }
})