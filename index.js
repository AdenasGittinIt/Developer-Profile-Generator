const inquirer = require("inquirer");
const fs = require("fs"),  convertFactory = require("electron-html-to");
const axios = require("axios");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);


let readyToConvert = false;

function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      message: "What is your GitHub Username?",
      name: "gHUsername"
    },
    {
      type: "list",
      message: "Select your favorite from the following:",
      choices: [
        "green",
        "blue",
        "pink",
        "red",
      ],
      name: "faveColor"
    }
  ]);
}

function generatePdf(html) {
  let conversion = convertFactory({
    converterPath: convertFactory.converters.PDF
  });

  conversion(
    {
      html: html,
      waitForJs: true,
      waitForJsVarName: readyToConvert
    },

    function(err, result) {
      if (err) {
        return console.log(err);
      }
      result.stream.pipe(fs.createWriteStream(
        `${userName}.pdf`
      ));
      conversion.kill();
      console.log(`${userName}.pdf ready for pickup in your current directory`)
    }
  )

}

promptUser()
  .then(function(name) {
    console.log(name.gHUsername, name.faveColor);
    userName = name.gHUsername;

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
    });
    let countStars = 0

    axios
    .get(`https://api.github.com/users/${userName}/repos`)
    .then(function(res) {
      
      let i = 0
      while(i < res.data.length) {
        countStars = countStars + res.data[i++].stargazers_count
      }

      info.stars = countStars
     
      const generateHTML = require("./generateHTML")
      const html = generateHTML(info);
      console.log(info);
      writeFileAsync(`${userName}.html`, html);
      return generatePdf(html)
     

    })
  })
  .then(function() {
    console.log(`${userName}.html is ready to convert to PDF`);
    readyToConvert = true;
  })
  .catch(function(err) {
    console.log(err);
  });