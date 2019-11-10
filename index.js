const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const html = require("./generateHTML");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

// function promptUser() {
//   return
    inquirer.prompt([{
    type: "input",
    message: "What is your GitHub Username?",
    name: "inputUsername"
  }, {
    type: "input",
    message: "What is your favorite color?",
    name: "faveColor"
  }
  ])  
      .then(function(name){
      console.log(name.inputUsername, name.faveColor )

      userName = name.inputUsername

      axios
      .get(`https://api.github.com/users/${userName}`)
      .then(function (res) {

      info = {
        color: name.faveColor,
        followers: res.data.followers,
        following: res.data.following,
        repos: res.data.public_repos,
        location: res.data.location,
        profilePic: res.data.avatar_url,
        profileUrl: res.data.html_url,
        blog: res.data.blog,
        bio: res.data.bio,
        name: res.data.name,
      }  
      
      console.log(info)

    });

    let countStars = 0

    axios
    .get(`https://api.github.com/users/${userName}/repos`)
    
    .then(function (res) {
  
      let i = 0
      while(i < res.data.length){
        countStars = countStars + res.data[i++].stargazers_count
      }

      info.stars = countStars
      console.log(info);
      
      
      generateHTML(info);
      
    });

  })
// }
// // google npm html to pdf

// promptUser()
//   .then(function(answers) {
//     const html = generateHTML(answers);

//     return writeFileAsync("index.html", html);
//   })
//   .then(function() {
//     console.log("Successfully wrote to index.html");
//   })
//   .catch(function(err) {
//     console.log(err);
//   });

