import NodeRSA from "node-rsa";
import { Wallet } from "ethers";
import moment from "moment";
import "dotenv/config";
import axios from "axios";
const privateKey = process.env.PRIVATE_KEY;

const adminVersion = async () => {
  let data = {
    version: "0.2.2",
    platform: "Android",
    minCompatibleVersion: "0.1.0",
    versionInfo: "test",
    releaseDate: "2023-09-01 00:00:00",
  };
  let message = JSON.stringify(data);
  const wallet = new Wallet(privateKey);
  let adminSig = await wallet.signMessage(message);
  console.log(wallet.address);
  return { ...data, adminSig };
};

const version = async () => {
  const data = await adminVersion();
  if (!data) {
    return;
  }
  const url = process.env.PAYMENT_ADMIN_VERSION;
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  };
  try {
    const response = await axios.post(url, data, config);

    console.info("\n==========｜response｜===========");
    console.info(response.data);
    let userInfo = rsaDecrypted(response.data.data);
    console.info(userInfo);
  } catch (error) {
    console.error("\n==========error===========");
    console.error(error);
  }
};

version();
