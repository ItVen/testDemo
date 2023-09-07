import { OAuth2Client } from "google-auth-library";

// 请替换为你的客户端ID
const CLIENT_ID = "881600659404-68cjosnss4h5eu1pgsm8v8lvhsfcacr7.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);
// 请替换为你的id_token
const token =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY3NmRhOWQzMTJjMzlhNDI5OTMyZjU0M2U2YzFiNmU2NTEyZTQ5ODMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4ODE2MDA2NTk0MDQta2txZm9qam9lbm1sOXVwNjFlNnAxaGV0aWkyN29hanYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4ODE2MDA2NTk0MDQtNjhjam9zbnNzNGg1ZXUxcGdzbTh2OGx2aHNmY2FjcjcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDE1NjIwMjIyMTU0MDY5NTIwNjAiLCJoZCI6ImFjY291bnRsYWJzLmNvbSIsImVtYWlsIjoieGlhbmdAYWNjb3VudGxhYnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJYaWFuZyBMaSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQWNIVHRjeEpvTHVGdTRBSjNCNWx1T1FSWVR3Zy14SlFPNmRORnJxZGZTaVlxOEdwQT1zOTYtYyIsImdpdmVuX25hbWUiOiJYaWFuZyIsImZhbWlseV9uYW1lIjoiTGkiLCJsb2NhbGUiOiJ6aC1DTiIsImlhdCI6MTY4OTY0NTg2MCwiZXhwIjoxNjg5NjQ5NDYwfQ.jaYNlcjdErnSnLLTEM7ABQ9nOAdYq_JRkFKdMik4yRG_o9E_t-Zxd-wrhLtm3vZi7QJ4QCzj_LkIEcNV5u9cZwLId5Wo4hNaz7UrtZ8jeLBUeZQ8gKoQAIi8uQXaJQPaioLppW_KKwB1aLSwbXGYRaTqMW9NjO_Wzy6_JnqE-1nflHZOjbepL79MB-RRYoJl85lfI2wEoTeilrbvUqo56_B9-bjdKnaP3";

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  // 打印payload，可以查看令牌中的所有声明
  console.log(payload);

  // payload中的字段，比如 "sub"，代表着用户的唯一ID
  const userid = payload["sub"];
  console.log(userid);

  // 您还可以验证其他字段，例如检查"email_verified"是否为true等等
}

verify(token).catch(console.error);
