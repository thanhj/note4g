'use strict';

const {
  DynamoDBClient, 
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand
} = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-1' });

const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME;

const send = (statusCode, data) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(data)
  };
};

module.exports.createNote = async (event) => {

  try {
    let data = JSON.parse(event.body);
    let params = {
      TableName: NOTES_TABLE_NAME,
      Item: {
        notesId: { S: data.id},
        title: { S: data.title},
        content: { S: data.content}
      },
      ConditionExpression: 'attribute_not_exists(notesId)'
    };
    const response = await client.send(new PutItemCommand(params));

    return send(200, response);
  } catch (err) {
    console.log(err);
    return send(500, err);
  }
};

module.exports.updateNote = async (event) => {
  let notesId = event.pathParameters.id;
  
  try {
    let data = JSON.parse(event.body);
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: {
        notesId: { S: notesId}
      },
      UpdateExpression: 'set #title = :title, #content = :content',
      ExpressionAttributeNames: {
        '#title': 'title',
        '#content': 'content'
      },
      ExpressionAttributeValues: {
        ':title': { S: data.title},
        ':content': { S: data.content}
      },
      ConditionExpression: 'attribute_exists(notesId)',
      ReturnValues: 'UPDATED_NEW'
    };
    const response = await client.send(new UpdateItemCommand(params));
    return send(200, response);
  } catch (err) {
    console.log(err);
    return send(500, err);
  }
};

module.exports.deleteNote = async (event) => {
  let noteId = event.pathParameters.id;
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: {
        notesId: { S: noteId}
      },
      ConditionExpression: 'attribute_exists(notesId)'
    };
    const response = await client.send(new DeleteItemCommand(params));
    return send(200, response);
  } catch (err) {
    console.log(err);
    return send(500, err);
  }
};

module.exports.getAllNotes = async (event) => {
  try {
    const params = {
      TableName: NOTES_TABLE_NAME
    };
    const response = await client.send(new ScanCommand(params));
    return send(200, response);
  } catch (err) {
    console.log(err);
    return send(500, err);
  }
};
