import { Wallet } from "ethers";
import moment from "moment";
import "dotenv/config";
const address = "0xD425B40EB861FCDEA77C213D70F0DE7CEF5B75C6";
const usd = 0.01;

// todo
const privateKey = process.env.PRIVATE_KEY;

const getApIssueInput = async () => {
  const timestamp = moment().unix();
  const rawData = `UniPassApTx:${timestamp}:${address}:${usd}`;

  const wallet = new Wallet(privateKey);
  const sig = await wallet.signMessage(rawData);

  const input = {
    timestamp,
    address,
    sig,
    usd,
  };
  console.info("==========｜｜===========\n");

  console.info(JSON.stringify(input));

  console.info("\n==========｜｜===========");
  return input;
};
getApIssueInput();
