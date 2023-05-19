import { Wallet } from "ethers";
import { keccak256, solidityPack } from "ethers/lib/utils.js";
import moment from "moment";
import "dotenv/config";
import axios from "axios";

const privateKey = process.env.PRIVATE_KEY;
const publicKey = `-----BEGIN PUBLIC KEY-----
xxx
-----END PUBLIC KEY-----`;

const idToken = "eyJhxxx";
const web3authClientId = "xxx";
const jwtVerifierIdKey = "xxx";
const verifierName = "UniPass-xxx";

const appName = "xxx"; //第三方appName
const appId = "xxx"; // 为空则服务器随机生成

const toBAppInfoInput = async () => {
  const jwtPubkey = {
    publicKey,
    idToken,
  };
  const timestamp = moment().unix();
  const rawData = `UniPass:ToB:${timestamp}:${appName}`;

  const wallet = new Wallet(privateKey);
  console.info({ adminAddress: wallet.address });
  const adminSig = await wallet.signMessage(rawData);

  const input = {
    jwtPubkey: JSON.stringify(jwtPubkey),
    timestamp,
    appName,
    adminSig,
    jwtVerifierIdKey,
    verifierName,
    web3authClientId,
    appId,
  };

  return input;
};

const toBAppInfo = async () => {
  const data = await toBAppInfoInput();
  if (!data) {
    return;
  }
  const url = process.env.APP_INFO_URL;
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  };
  console.info(JSON.stringify(data));
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

toBAppInfo();
