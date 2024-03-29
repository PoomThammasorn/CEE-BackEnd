const dotenv = require("dotenv");
const dateTime = require("./dateTime");
dotenv.config();
const { v4: uuidv4 } = require("uuid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  PutCommand,
  DeleteCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

exports.getPost = async (req, res) => {
  const params = {
    TableName: process.env.aws_post_table_name,
  };
  try {
    const data = await docClient.send(new ScanCommand(params));
    res.send(data.Items);
    // res.send("ไอ่ไนท์ ไอ่โง่");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.addPost = async (req, res) => {
  const post_id = uuidv4();
  const post_date = dateTime.getTime();
  console.log(post_date);
  // const post_like = 0;
  // const post_dislike = 0;
  const item = {
    post_id: post_id,
    ...req.body,
    post_date: post_date,
    // post_like: post_like,
    // post_dislike: post_dislike,
  };
  const params = {
    TableName: process.env.aws_post_table_name,
    Item: item,
  };
  try {
    const data = await docClient.send(new PutCommand(params));
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.deletePost = async (req, res) => {
  const post_id = req.params.post_id;
  console.log(post_id);
  const params = {
    TableName: process.env.aws_post_table_name,
    Key: {
      post_id: post_id,
    },
  };
  try {
    const data = await docClient.send(new DeleteCommand(params));
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
