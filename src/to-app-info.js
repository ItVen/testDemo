import { Wallet } from "ethers";
import moment from "moment";
import "dotenv/config";
import axios from "axios";
import { concat, sha256, toUtf8Bytes } from "ethers/lib/utils.js";

const privateKey = process.env.PRIVATE_KEY;
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiMnjZufewcKB5uXIkSc/
XrzjpEPo345ks4JDmmk5k0VtpKsrE/5kpEZ+oxZKx6Lcgu0yEEShSL1ptqWsny0U
nokqnduQzFm1c2uBakls+Mx/fQvwBQD2mxvoN7GdHifOvByTh1MgYQfo4nba9J8L
SVHHw11TpPy9m7/Owsj+oSfuf40R7YMNnMXm/aZ7Rj6AtTQpdI+gvs8O0btd9ArM
CPs7SJHl66mADE6b9MIMaWlowA+KaY+2/lTlX+QZatXMQwozX94xYEYvQ/gu2AYZ
RxMdPaxfDPyNsC4I97cIXzL5MfI+f0ZbmPmObgXaietS5LHUYG5TmTvdUM3LcTku
6QIDAQAB
-----END PUBLIC KEY-----`;

const idToken =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IjYwODNkZDU5ODE2NzNmNjYxZmRlOWRhZTY0NmI2ZjAzODBhMDE0NWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2ODU1OTkwNTksImF1ZCI6IjQ2MzQwMjc3NzUxMy1za2hzMW9nNGNsdjYycXIwNGRrNjRpY2dtczVrZXFsNi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMzc3NzUzMDUyMDUyMDEzMDM2MSIsImhkIjoibGF5Mi5kZXYiLCJlbWFpbCI6ImV0aGFuQGxheTIuZGV2IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6IjQ2MzQwMjc3NzUxMy1za2hzMW9nNGNsdjYycXIwNGRrNjRpY2dtczVrZXFsNi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsIm5hbWUiOiJFdGhhbiBZYW5nIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdGVma2NqT2gxUkhrbXhKNHpwdHA3RXpNVWI4TXFUSGFSQVBkZ1FDPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkV0aGFuIiwiZmFtaWx5X25hbWUiOiJZYW5nIiwiaWF0IjoxNjg1NTk5MzU5LCJleHAiOjE2ODU2MDI5NTksImp0aSI6ImFmYmEzNjM3ZGFhY2U1MGRmNWJjM2JjMWY1ZDUxMWQ3ODM5OWJlY2UifQ.H8kWtKEubHIlfNFDvD3x8qTvpgqFHFWRFETm8Osq8gyjONI7I5xOXgsm_IBMTeTlbzSehUbXe5Au1AUXp05GmBtcr79SP8aegqL1U4oeZv9p7INaDU7iS-fqwdq9KsFx2JYTTt5ENx24Qqh6VedrWUHWVDE9JypJ265y3AkIezFN1rcC23izrnI4pxpstO9BPa_cS9zoSJaa-3ZXhgj0J5gsEeXE6LgGtSbgPinjzF_btEleJht5Yy4ypdwGpte7Gks9twXEgftDzqvrGV06HW8O1OcyHmtzHtzCtRhv-GVSCxxmZk3O99U29iPupdJ7p0R6HkmkxNV9jBQMGcbFCg";

const web3authClientId =
  "BE55t_lrVDA-HYx5lAJ6KeF8SVPYKDuB8fgEwegbvk1Jrfb8BsysgTW0HaErAM4d2NHXDZVTMDJFAjEcSKAISdI";
const web3authEnv = "mainnet";
const jwtVerifierIdKey = "email";
const verifierName = "UniPass-Google-Verifier";
const customerId = 0;

const appName = "snap"; //第三方appName
const appId = "9e145ea3e5525ee793f39027646c4511";
const enableCustomPolicy = true;
const customPolicyPublicKey = "0x099e9CBDEe9FE8EC5bFf99Efc01932C9C72EE339";
const callbackUrl = "https://t.snap.unipass.vip/snap-server/api/v1/transaction/callback";

const toBAppInfoInput = async () => {
  const jwtPubkey = {
    publicKey,
    idToken,
    // kid: "xxx",
    // alg: "xxx",
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
    callbackUrl,
    customPolicyPublicKey,
    enableCustomPolicy,
    customerId,
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
