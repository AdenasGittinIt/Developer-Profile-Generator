const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
let userName = "AdenasGittinIt"


inquirer.prompt([{
  type: "input",
  message: "What is your GitHub Username?",
  name: "inputUsername"
}, {
  type: "input",
  message: "What is your favorite color?",
  name: "faveColor"
}
]).then(function(name){
  console.log(name.inputUsername, name.faveColor )

  userName = name.inputUsername

  axios
  .get(`https://api.github.com/users/${userName}`)
  .then(function (res) {

let followers = res.data.followers;
let following = res.data.following;
let publicRepos = res.data.public_repos;
let location = res.data.location;
let profilePic = res.data.avatar_url;
let profileUrl = res.data.html_url;
let blogUrl = res.data.blog;
let bio = res.data.bio;
let name = res.data.name;

console.log(res);
  console.log(
    name, 
    location, 
    bio,
    publicRepos, 
    followers, 
    following,  
    profilePic, 
    profileUrl, 
    blogUrl);
  });

  let countStars = 0
  axios
  .get(`https://api.github.com/users/${userName}/repos`)
  .then(function (res) {
  
    let i = 0
    while(i < res.data.length){
      
      countStars = countStars + res.data[i++].stargazers_count
      
    }
 
    console.log(countStars);
 
  });

})



// google npm html to pdf