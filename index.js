const inquirer = require("inquirer");
const fs = require("fs"),
  convertFactory = require('electron-html-to');
const axios = require("axios");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);


function promptUser() {
  return inquirer.prompt([{
    type: "input",
    message: "What is your GitHub Username?",
    name: "inputUsername"
  }, {
    type: "input",
    message: "What is your favorite color?",
    name: "faveColor"
  }
  ]);  
}

let readyToConvert = false;

promptUser()
  .then(function(name) {
    
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
      
      // console.log(info);
      
      const html = generateHTML(info);
      writeFileAsync(`${userName}.html`, html);
      return generatePdf(html);
      
    });    
  })
  .then(function() {
    console.log(`${userName}.html is ready to convert to PDF`);
    readyToConvert = true;
  })  
    .catch(function(err) {
    console.log(err);

  });


  function generatePdf(html) {
    let conversion = convertFactory({

      converterPath: convertFactory.converters.PDF

    });

    conversion({
      html: html,
      waitForJs: true,
      waitForJsVarName: readyToConvert,
    },
      function(err, result) {
        if (err) {
          return console.log(err);
        }

        result.stream.pipe(fs.createWriteStream(`${userName}.pdf`));
        
        conversion.kill(); 
        
        console.log(`${userName}.pdf is now available in your current directory`);
      });
    }
  

  const colors = {
    green: {
      wrapperBackground: "#E6E1C3",
      headerBackground: "#C1C72C",
      headerColor: "black",
      photoBorderColor: "#black"
    },
    blue: {
      wrapperBackground: "#5F64D3",
      headerBackground: "#26175A",
      headerColor: "white",
      photoBorderColor: "#73448C"
    },
    pink: {
      wrapperBackground: "#879CDF",
      headerBackground: "#FF8374",
      headerColor: "white",
      photoBorderColor: "#FEE24C"
    },
    red: {
      wrapperBackground: "#DE9967",
      headerBackground: "#870603",
      headerColor: "white",
      photoBorderColor: "white"
    }
  };
  function generateHTML(info) {
    return `<!DOCTYPE html>
    <html lang="en">
       <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
          <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
          <title>HTML for the PDF</title>
          <style>
              @page {
                margin: 0;
              }
             *,
             *::after,
             *::before {
             box-sizing: border-box;
             }
             html, body {
             padding: 0;
             margin: 0;
             }
             html, body, .wrapper {
             height: 100%;
             }
             .wrapper {
             background-color: ${colors[info.color].wrapperBackground};
             padding-top: 100px;
             }
             body {
             background-color: white;
             -webkit-print-color-adjust: exact !important;
             font-family: 'Cabin', sans-serif;
             }
             main {
             background-color: #E9EDEE;
             height: auto;
             padding-top: 30px;
             }
             h1, h2, h3, h4, h5, h6 {
             font-family: 'BioRhyme', serif;
             margin: 0;
             }
             h1 {
             font-size: 3em;
             }
             h2 {
             font-size: 2.5em;
             }
             h3 {
             font-size: 2em;
             }
             h4 {
             font-size: 1.5em;
             }
             h5 {
             font-size: 1.3em;
             }
             h6 {
             font-size: 1.2em;
             }
             .photo-header {
             position: relative;
             margin: 0 auto;
             margin-bottom: -50px;
             display: flex;
             justify-content: center;
             flex-wrap: wrap;
             background-color: ${colors[info.color].headerBackground};
             color: ${colors[info.color].headerColor};
             padding: 10px;
             width: 95%;
             border-radius: 6px;
             }
             .photo-header img {
             width: 250px;
             height: 250px;
             border-radius: 50%;
             object-fit: cover;
             margin-top: -75px;
             border: 6px solid ${colors[info.color].photoBorderColor};
             box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
             }
             .photo-header h1, .photo-header h2 {
             width: 100%;
             text-align: center;
             }
             .photo-header h1 {
             margin-top: 10px;
             }
             .links-nav {
             width: 100%;
             text-align: center;
             padding: 20px 0;
             font-size: 1.1em;
             }
             .nav-link {
             display: inline-block;
             margin: 5px 10px;
             }
             .workExp-date {
             font-style: italic;
             font-size: .7em;
             text-align: right;
             margin-top: 10px;
             }
             .container {
             padding: 50px;
             padding-left: 100px;
             padding-right: 100px;
             }
    
             .row {
               display: flex;
               flex-wrap: wrap;
               justify-content: space-between;
               margin-top: 20px;
               margin-bottom: 20px;
             }
    
             .card {
               padding: 20px;
               border-radius: 6px;
               background-color: ${colors[info.color].headerBackground};
               color: ${colors[info.color].headerColor};
               margin: 20px;
             }
             
             .col {
             flex: 1;
             text-align: center;
             }
    
             a, a:hover {
             text-decoration: none;
             color: inherit;
             font-weight: bold;
             }
    
             @media print { 
              body { 
                zoom: .75; 
              } 
             }
          </style>
       </head> 
       <body>
        <div class="jumbotron jumbotron-fluid">
          <div class="container">
            <h1 class="display-4">Hi! My name is ${info.name}</h1>
            <h2>A Little About Me: <span class="badge badge-secondary">${info.bio}</span></h2>
            <ul class="list-group">
              <li class="list-group-item">location ${info.location}</li>
              <li class="list-group-item">GitHub: ${info.profileUrl}</li>
              <li class="list-group-item">Blog: ${info.blog}</li>
            </ul>
            <img src='${info.profilePic}' height='200px' width='200px'>
          </div>
        </div>
       </body>    
      </html lang="en">
        `
  }