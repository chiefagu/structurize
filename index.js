#! /usr/bin/env node

const inquirer = require("inquirer");
const fs = require("fs");
const CURR_DIR = process.cwd();

const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const QUESTIONS = [
    {
        name: "project-choice",
        type: "list",
        message: "What project template would you like to generate?",
        choices: CHOICES
    },
    {
        name: "project-name",
        type: "input",
        message: "Enter a project name:",
        validate: function(input) {
            if (/^([A-Za-z\-\_\d])+$/.test(input)) {
                return true;
            } else {
                return "Invalid project name, name can only include letters, numbers, underscores and hash(es).";
            }
        }
    }
];

async function run() {
    try {
        const answers = await inquirer.prompt(QUESTIONS);
        const projectChoice = answers["project-choice"];
        const projectName = answers["project-name"];
        const templatePath = `${__dirname}/templates/${projectChoice}`;
        fs.mkdirSync(`${CURR_DIR}/${projectName}`);
        createDirectoryContents(templatePath, projectName);
        console.info("All done..");
    } catch (ex) {
        console.log(ex.message);
    }
}

function createDirectoryContents(templatePath, newProjectPath) {
    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach(file => {
        const originalFilePath = `${templatePath}/${file}`;

        const stats = fs.statSync(originalFilePath);

        if (stats.isFile()) {
            const contents = fs.readFileSync(originalFilePath);

            // Renaming .npmignore to .gitignore
            if (file === ".npmignore") file = ".gitignore";

            const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
            fs.writeFileSync(writePath, contents);
        } else if (stats.isDirectory()) {
            fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);
            createDirectoryContents(
                `${templatePath}/${file}`,
                `${newProjectPath}/${file}`
            );
        }
    });
}

run();
