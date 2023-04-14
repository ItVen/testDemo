import { Wallet } from "ethers";
import moment from "moment";
import "dotenv/config";

const apIssueList = [
  //to do
  {
    address: "0xe7ef0190f5b3ac910ef20773ad5cd7c3daffbd97",
    ap: "6000",
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
