import express from "express";
const app = express();
import { StreamrClient, Stream, StreamOperation } from "streamr-client";
import { createServer } from "http";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const account = StreamrClient.generateEthereumAccount();

const client = new StreamrClient({
  auth: {
    privateKey: process.env.PRIVATE_KEY,
  },
});

let stream: Stream;

const createStream = async () => {
  stream = await client.getStream(
    "0x13327af521d2042f8bd603ee19a4f3a93daa790d/streamr-chat-messages"
  );
};

createStream();

app.post("/send", async (req, res) => {
  await stream.publish({
    message: req.query.message,
  });
  res.send("Message Sent!");
});

app.post("/adduser", async (req, res) => {
  const user = req.body.user;
  if (stream.hasPermission(StreamOperation.STREAM_PUBLISH, user) === null) {
    stream.grantPermission(StreamOperation.STREAM_PUBLISH, user as string);
  }
  if (stream.hasPermission(StreamOperation.STREAM_SUBSCRIBE, user) === null) {
    stream.grantPermission(StreamOperation.STREAM_SUBSCRIBE, user as string);
  }
  res.send("User added");
});

app.get("/generateuser", async (req, res) => {
  const user = await StreamrClient.generateEthereumAccount();
  res.send(user);
});

app.listen(PORT, () => {
  console.log(`Listening at PORT ${PORT}`);
});
