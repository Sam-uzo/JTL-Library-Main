const fs = require("fs");
const fsPromise = fs.promises;
const { format } = require("date-fns");
const path = require("path");
const { error } = require("console");
const pathFinder = (folder = "./", file) => {
  return path.join(__dirname, folder, file);
};
const Logger = async (data) => {
  try {
    if (!fs.existsSync(pathFinder("Analysis", ""))) {
      await fsPromise.mkdir(pathFinder("Analysis", ""));
      fs.existsSync(pathFinder("Analysis", "Logs.txt"))
        ? fsPromise.appendFile(pathFinder("Analysis", "Logs.txt"), `${data}\n`)
        : await fsPromise.writeFile(
            pathFinder("Analysis", "Logs.txt"),
            `${data}\n`,
          );
    } else {
      fs.existsSync(pathFinder("Analysis", "Logs.txt"))
        ? fsPromise.appendFile(pathFinder("Analysis", "Logs.txt"), `${data}\n`)
        : await fsPromise.writeFile(pathFinder("Analysis", "Logs.txt"));
    }
  } catch (error) {
    console.error(`Logger error: ${error.message}`);
  }
};

const errorLogger = async (errors) => {
  try {
    if (!fs.existsSync(pathFinder("Analysis", ""))) {
      await fsPromise.mkdir(pathFinder("Analysis", ""));
      fs.existsSync(pathFinder("Analysis", "Error.txt"))
        ? fsPromise.appendFile(
            pathFinder("Analysis", "Error.txt"),
            `${errors}\n`,
          )
        : await fsPromise.writeFile(
            pathFinder("Analysis", "Error.txt"),
            `${errors}\n`,
          );
    } else {
      fs.existsSync(pathFinder("Analysis", "Error.txt"))
        ? fsPromise.appendFile(
            pathFinder("Analysis", "Error.txt"),
            `${errors}\n`,
          )
        : await fsPromise.writeFile(
            pathFinder("Analysis", "Error.txt"),
            `${errors}\n`,
          );
    }
  } catch (error) {
    console.error(`errorLogger error: ${error.message}`);
  }
};

module.exports = { Logger: Logger, errorLogger: errorLogger };
