//Pull It Together App

//A command line app that generates a PDF populated with 
//the developer's profile image
// GitHub username
//links to: user location via google maps, user github profile, user blog
//bio
//# of public repositories
//# of github stars
//# of users following

//GitHub API

// the baground color for the pdf should match the user specified color

//create inquirer question to get username, favorite color, 
//run the api call
//when I get the response save the required info to variables
//
//write those variables to a pdf file with the favorite color as the background
// Functional, deployed application.


// GitHub repository with a unique name and a README describing project.


// The application generates a PDF resume from the user provided GitHub profile.


// The generated resume includes a bio image from the user's GitHub profile.


// The generated resume includes the user's location and a link to their GitHub profile.


// The generated resume includes the number of: public repositories, followers, GitHub stars and following count.


// The background color of the generated PDF matches the color that the user provides.
// https://api.github.com/users/AdenasGittinIt/repos - loop through this api and get the sumation of all stargazer counts

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



    console.log(followers, following, publicRepos, location, profilePic);
  });

  let countStars = 0
  axios
  .get(`https://api.github.com/users/${userName}/repos`)
  .then(function (res) {
  
    let i = 0
    while(i<res.data.length){
        countStars = countStars+res.data[i++].stargazers_count
      
    }
    console.log(countStars);
    // stargazers_count
  });

})



