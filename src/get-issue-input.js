import { Wallet } from "ethers";
import moment from "moment";
import "dotenv/config";

const apIssueList = [
  //to do
  {
    address: "0xC26722967F124BA3953F8C09FE7BCD0A8157F653",
    ap: 1,
  },
];
// todo
const privateKey = process.env.PRIVATE_KEY;

const getApIssueInput = async () => {
  const timestamp = moment().unix();
  const rawData = `UniPass:AP:Issue:${timestamp}:${JSON.stringify(
    apIssueList
  )}`;

  const wallet = new Wallet(privateKey);
  const adminSig = await wallet.signMessage(rawData);
  const input = {
    timestamp,
    apIssueList,
    adminSig,
  };
  console.info("==========｜｜===========\n");

  console.info(JSON.stringify(input));

  console.info("\n==========｜｜===========");
  return input;
};
getApIssueInput();
