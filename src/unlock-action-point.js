import { Wallet } from "ethers";
import { keccak256, solidityPack } from "ethers/lib/utils.js";
import moment from "moment";
import "dotenv/config";
import axios from "axios";
const historyId = "";
const chainTxHash = "";
const UnlockStatus = {
  SUCCESS: "success",
  FAIL: "fail",
};
const status = UnlockStatus.SUCCESS;

const privateKey = process.env.PRIVATE_KEY;

const getUnlockActionPointInput = async () => {
  if (!historyId) {
    console.warn(`\nParameter historyId is not empty\n`);
    return;
  }
  if (!status) {
    console.warn(`\nParameter status is not empty\n`);
    return;
  }
  if (status === UnlockStatus.SUCCESS && !chainTxHash) {
    console.warn(
      `\nParameter chainTxHash is not empty when status is success\n`
    );
    return;
  }
  const timestamp = moment().unix();
  const rawData = keccak256(
    solidityPack(["uint32", "string", "uint32"], [historyId, status, timestamp])
  );

  const wallet = new Wallet(privateKey);
  const adminSig = await wallet.signMessage(rawData);
  const input = {
    historyId,
    status,
    timestamp,
    chainTxHash,
    adminSig,
  };

  return input;
};

const unlockActionPoint = async () => {
  const data = await getUnlockActionPointInput();
  if (!data) {
    return;
  }
  const url = process.env.UNLOCK_URL;
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  };

  axios
    .request(config)
    .then((response) => {
      console.info("==========｜input｜===========\n");

      console.info(data);

      console.info("\n==========｜response｜===========");
      console.info(response.data);
    })
    .catch((error) => {
      console.error({
        status: error.response.status,
        errorMessage: error.response.data,
      });
    });
};

unlockActionPoint();
