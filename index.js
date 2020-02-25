


const Enquirer = require("enquirer");

const { prompt } = require("enquirer");
const axios = require("axios");
var fs = require("fs");

//Question put in  array and pass it to Enquirer
const questions = [
  {
    type: "input",
    name: "username",
    message: "What is your github username?"
  },
  {
    type: "input",
    name: "title",
    message: "What is your project's name?"
  },
  {
    type: "input",
    name: "description",
    message: "Please write a short description of your project"
  },
  {
    type: "input",
    name: "license",
    message: "What kind of license should your project have?"
  },
  {
    type: "input",
    name: "contributors",
    message: "Who are the current contributors of this repo?"
  },
  {
    type: "input",
    name: "dependencies",
    message: "What command should be run to install dependencies"
  },
  {
    type: "input",
    name: "test",
    message: "What command should be run to run tests?"
  },
  {
    type: "input",
    name: "usage",
    message: "What does the user need to know about using the repo?"
  },
  {
    type: "input",
    name: "installation",
    message: "What does the user need to know about contributing to the repo?"
  }
];

var markdownTemplateLiteral;
var AvatarURL;
//function to hit gitHub Api using Axios
async function getUserAvatar(username, enquireAnsObj) {
  const getAvtReq = () => {
    try {
      return axios.get(`https://api.github.com/search/users?q=${username}`); //+repos:%3E42+followers:%3E1000");
    } catch (error) {
      console.error(error);
    }
  };

        const getAvtData = async () => {
    const respData = getAvtReq()
      .then(response => {
        if (response) {
          AvatarURL = response.data.items[0].avatar_url;
          generateMarkdown(enquireAnsObj, AvatarURL);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  getAvtData();
}

        //function to write to file
        
function writeToFile(fileName, data) {
  const cwd = process.cwd();

  fs.appendFile(cwd + "/" + fileName, data, function(err) {
    if (err) throw err;
    console.log(`${fileName} has been created`);
  });
}

//function enquirer function
async function runEnquirer(questionsArray) {
  let answers = await prompt(questionsArray);
  return answers;
}

//function to generate Markdown
function generateMarkdown(enquirerObject, userAvatar) {
  let MkdwnDataObj = enquirerObject;

  let title = MkdwnDataObj.title;
  let description = MkdwnDataObj.description;
  let contributors = MkdwnDataObj.contributors;
  let license = MkdwnDataObj.license;
  let dependencies = MkdwnDataObj.dependencies;
  let test = MkdwnDataObj.test;
  let usage = MkdwnDataObj.usage;
  let installation = MkdwnDataObj.installation;

  markdownTemplateLiteral = `
#${title}

----
## Description
  
${description}
  
  
----
## Table of Contents
  
- [Installation](#installation)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [License](#license)
- [Badges](#badges)
- [License](#license)
  
----
## Installation
${installation}
  
## Usage
${usage}
  
## Dependencies
${dependencies}
  
## License
  
${license}
  
## Badges
  
## Contributing
${contributors}
  
## Tests
${test}
  
<img src="${userAvatar}" alt="Markdown Monster icon" style="margin-top: 40px; border-radius: 100%; width: 100px; height: auto;" />
  
----

  `;

  console.log(markdownTemplateLiteral);

  //This is the final step of the process
  //this function is called here due to nesting of functions to promote async behavior
  writeToFile(`${title}.md`, markdownTemplateLiteral);
}

function init() {
  //1. call Enquirer function here
  runEnquirer(questions).then(AnswerObj => {
    //2. getting User Avatar from gitHub
    //this calls GenerateMarkdown function to generate markdown
    getUserAvatar(AnswerObj.username, AnswerObj);
  });
}

init();
