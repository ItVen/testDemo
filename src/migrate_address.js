import NodeRSA from "node-rsa";
import { Wallet } from "ethers";
import moment from "moment";
import "dotenv/config";
import axios from "axios";
const privateKey = process.env.PRIVATE_KEY;

const migrateInput = async () => {
  let timestamp = moment().unix();
  let data = {
    appId: "f08cf70d63195cc284829daebd6d00a1", //迁移的appId
    email: "zzhengzhuo016@gmail.com", //查询的邮箱
    provider: 0,
    timestamp: `${timestamp}`,
    signature: "",
  };
  const digestStr = `appId=${data.appId}&email=${data.email}&provider=${data.provider}&timestamp=${data.timestamp}`;
  const wallet = new Wallet(privateKey);
  data.signature = await wallet.signMessage(digestStr);
  return data;
};

const migrate = async () => {
  const data = await migrateInput();
  if (!data) {
    return;
  }
  const url = process.env.MIGRATE_ADDRESS_URL;
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  };
  console.info(data);
  try {
    const response = await axios.post(url, data, config);

    console.info("\n==========｜response｜===========");
    console.info(response.data);
  } catch (error) {
    console.error("\n==========error===========");
    console.error(error);
  }
};

migrate();
