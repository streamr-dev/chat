import express from "express";
const app = express();
import { StreamrClient } from "streamr-client";

const PORT = process.env.PORT || 3000;

app.use(express.json());

const account = StreamrClient.generateEthereumAccount();

const client = new StreamrClient({
  auth: {
    privateKey: account.privateKey,
  },
});

let stream: any;

const createStream = async () => {
  stream = await client.createStream({
    id: "/foo/bar", // or 0x1234567890123456789012345678901234567890/foo/bar or mydomain.eth/foo/bar
  });
  console.log(`Stream ${stream.id} has been created!`);
};

createStream();

app.post("/send", async (req, res) => {
  console.log(req.query);
  await stream.publish({
    message: req.query.message,
  });
  res.send("Message Sent!");
});

app.get("/getmessages", async (req, res) => {
  await client.subscribe(
    {
      stream: stream.id,
    },
    (message, metadata) => {
      console.log(message);
      res.send(message);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Listening at PORT ${PORT}`);
});
