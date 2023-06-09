import { Wallet } from "ethers";
import moment from "moment";
import "dotenv/config";
import axios from "axios";
import { concat, sha256, toUtf8Bytes } from "ethers/lib/utils.js";

const privateKey = process.env.PRIVATE_KEY;
const publicKey = `-----BEGIN PUBLIC KEY-----
xxx
-----END PUBLIC KEY-----`;

const idToken = null;

const web3authClientId = "xx";
const web3authEnv = "testnet";
const jwtVerifierIdKey = "xx";
const verifierName = "xx";

const appName = "xx"; //第三方appName
const appId = null; // 为空则服务器随机生成

const toBAppInfoInput = async () => {
  const jwtPubkey = {
    publicKey,
    idToken,
    kid: "xxx",
    alg: "xxx",
  };

  const timestamp = moment().unix();
  const params = {
    jwtPubkey: JSON.stringify(jwtPubkey),
    appName,
    jwtVerifierIdKey,
    verifierName,
    web3authClientId,
    appId,
    web3authEnv,
  };
  const message = concat([toUtf8Bytes(JSON.stringify(params))]);
  const hash = sha256(message);
  const rawData = `UniPass:ToB:${hash}:${timestamp}`;
  const wallet = new Wallet(privateKey);
  const adminSig = await wallet.signMessage(rawData);
  console.info({ adminAddress: wallet.address });

  const input = {
    ...params,
    timestamp,
    adminSig,
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
