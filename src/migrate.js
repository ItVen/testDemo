import NodeRSA from "node-rsa";
import { Wallet } from "ethers";
import moment from "moment";
import "dotenv/config";
import axios from "axios";
const privateKey = process.env.PRIVATE_KEY;
function rsaDecrypted(encrypted) {
  let privatePem =
    "-----BEGIN RSA PRIVATE KEY-----\n" +
    "MIIBOQIBAAJAVY6quuzCwyOWzymJ7C4zXjeV/232wt2ZgJZ1kHzjI73wnhQ3WQcL\n" +
    "DFCSoi2lPUW8/zspk0qWvPdtp6Jg5Lu7hwIDAQABAkBEws9mQahZ6r1mq2zEm3D/\n" +
    "VM9BpV//xtd6p/G+eRCYBT2qshGx42ucdgZCYJptFoW+HEx/jtzWe74yK6jGIkWJ\n" +
    "AiEAoNAMsPqwWwTyjDZCo9iKvfIQvd3MWnmtFmjiHoPtjx0CIQCIMypAEEkZuQUi\n" +
    "pMoreJrOlLJWdc0bfhzNAJjxsTv/8wIgQG0ZqI3GubBxu9rBOAM5EoA4VNjXVigJ\n" +
    "QEEk1jTkp8ECIQCHhsoq90mWM/p9L5cQzLDWkTYoPI49Ji+Iemi2T5MRqwIgQl07\n" +
    "Es+KCn25OKXR/FJ5fu6A6A+MptABL3r8SEjlpLc=\n" +
    "-----END RSA PRIVATE KEY-----";
  let key = new NodeRSA(privatePem);
  const decrypted = key.decrypt(encrypted, "utf8");
  console.log(decrypted);
}

const migrateInput = async () => {
  let timestamp = moment().unix();
  let data = {
    appId: "f08cf70d63195cc284829daebd6d00a1", //迁移的appId
    address: "0xAF7960BC78C5FB5F9838E994F2392AEA7920CF49", //迁移的地址
    timestamp: `${timestamp}`,
    signature: "",
  };
  const digestStr = `appId=${data.appId}&address=${data.address}&timestamp=${data.timestamp}`;
  const wallet = new Wallet(privateKey);
  data.signature = await wallet.signMessage(digestStr);
  return data;
};

const migrate = async () => {
  const data = await migrateInput();
  if (!data) {
    return;
  }
  const url = process.env.MIGRATE_URL;
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  };
  console.info(JSON.stringify(data), url);
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

migrate();
