import { Wallet } from "ethers";
import moment from "moment";
import "dotenv/config";
import axios from "axios";
import { concat, sha256, toUtf8Bytes } from "ethers/lib/utils.js";

const privateKey = process.env.PRIVATE_KEY;
const gasTankBalance = 1000000000000000;
const sub = "snap";
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
    appName: "snap",
    enableCustomPolicy: true,
    customPolicyPublicKey: "0x099e9CBDEe9FE8EC5bFf99Efc01932C9C72EE339", // todo snap app gas fee sig public key
    callbackUrl: "https://t.wallet.unipass.vip/snap-server/api/v1/transaction/callback", // todo snap app callback url
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
