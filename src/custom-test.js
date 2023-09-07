import { Wallet } from "ethers";
import moment from "moment";
import "dotenv/config";
import axios from "axios";
import { concat, sha256, toUtf8Bytes } from "ethers/lib/utils.js";

const privateKey = process.env.PRIVATE_KEY;
const gasTankBalance = 1000000000000000;
const sub = "unipass app";
const provider = 4;
const status = 1;

const toBAppInfoInput = async () => {
  const timestamp = moment().unix();
  const params = {
    status,
    provider,
    sub,
    gasTankBalance,
  };
  const message = concat([toUtf8Bytes(JSON.stringify(params))]);
  const hash = sha256(message);
  const rawData = `${hash}:${timestamp}`;
  const wallet = new Wallet(privateKey);
  const adminSig = await wallet.signMessage(rawData);

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
  const url = process.env.CUSTOM_INFO_URL;
  let config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  console.info("==========｜input｜===========\n");
  console.info(JSON.stringify(data), url);
  try {
    const response = await axios.post(url, data, config);

    console.info("\n==========｜response｜===========");
    console.info(response.data.data.authorization);
    return response.data.data.authorization;
  } catch (error) {
    console.error("\n==========error===========");
    console.error(error);
  }
};

const createAppInfo = async () => {
  let authorization = await toBAppInfo();
  if (!authorization) {
    console.error("\n==========error===========");
    console.error("authorization not find");
  }
  const data = {
    appName: "unipass app",
    appId: "9e145ea3e5525ee793f39027646c4513",
    enableCustomPolicy: true,
    customPolicyPublicKey: "0xc13D5DaC4429a1EC60B7479f8Eca766bC0BF93d1", // todo snap app gas fee sig public key
    callbackUrl: "", // todo snap app callback url
  };
  const url = process.env.CUSTOM_CREATE_APP;
  let config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authorization}`,
    },
  };
  console.info("==========｜input｜===========\n");
  console.info(JSON.stringify(data), url);
  try {
    const response = await axios.post(url, data, config);

    console.info("\n==========｜response｜===========");
    console.info(response.data);
  } catch (error) {
    console.error("\n==========error===========");
    console.error(error);
  }
};

createAppInfo();
