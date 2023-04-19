import { Wallet } from "ethers";
import moment from "moment";
import { keccak256, solidityPack } from "ethers/lib/utils.js";
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
  const FilePath = `${__dirname}/csv/relayer.csv`;
  const list = await readCsv(FilePath);
  return list;
};

const getApIssueInput = async () => {
  const list = await fileReader();
  if (list.length === 0) {
    console.info(`\n relayer csv data is not empty \n`);
    return;
  }
  const timestamp = moment().unix();
  const rawData = keccak256(
    solidityPack(["string", "uint32"], [JSON.stringify(list), timestamp])
  );

  const wallet = new Wallet(privateKey);
  const adminSig = await wallet.signMessage(rawData);
  const input = {
    timestamp,
    list,
    adminSig,
  };

  return input;
};

const distributeActionPoint = async () => {
  const data = await getApIssueInput();
  if (!data) {
    return;
  }
  const url = process.env.RELAYER_CONFIG_URL;
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  };

  axios
    .request(config)
    .then((response) => {
      console.info("==========｜input｜===========\n");

      console.info(data);

      console.info("\n==========｜response｜===========");
      console.info(response.data);
    })
    .catch((error) => {
      console.error({
        status: error.response.status,
        errorMessage: error.response.data,
      });
    });
};

distributeActionPoint();
