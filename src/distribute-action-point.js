import { Wallet } from "ethers";
import moment from "moment";
import "dotenv/config";
import csv from "csvtojson";
import { fileURLToPath } from "url";
import { dirname } from "path";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function readCsv(csvFilePath) {
  const jsonArray = await csv().fromFile(csvFilePath);
  return jsonArray;
}

// todo
const privateKey = process.env.PRIVATE_KEY;
const message = "admin add";

const fileReader = async () => {
  const FilePath = `${__dirname}/csv/data.csv`;
  const list = await readCsv(FilePath);
  return list;
};

const getApIssueInput = async () => {
  const apIssueList = await fileReader();
  console.log(apIssueList);
  if (apIssueList.length === 0) {
    console.info(`\n csv data is not empty \n`);
    return;
  }
  const timestamp = moment().unix();
  const rawData = `UniPass:AP:Issue:${timestamp}:${JSON.stringify(apIssueList)}`;

  const wallet = new Wallet(privateKey);
  const adminSig = await wallet.signMessage(rawData);
  const input = {
    timestamp,
    apIssueList,
    adminSig,
    message,
  };

  return input;
};

const distributeActionPoint = async () => {
  const data = await getApIssueInput();

  console.log(data);
  if (!data) {
    return;
  }
  const url = process.env.ISSUE_URL;
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  };

  console.log(config);
  axios
    .request(config)
    .then(response => {
      console.info("==========｜input｜===========\n");

      console.info(data);

      console.info("\n==========｜response｜===========");
      console.info(response.data);
    })
    .catch(error => {
      console.error({
        status: error.response.status,
        errorMessage: error.response.data,
      });
    });
};

distributeActionPoint();
