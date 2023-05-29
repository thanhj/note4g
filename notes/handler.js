'use strict';
const DynamoDB = require('aws-sdk/clients/dynamodb');
const documentClient = new DynamoDB.DocumentClient({ region: 'us-east-1'});
const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME;

const send = (statusCode, data, callback) => {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(data)
  };
  callback(null, response);
};

module.exports.createNote = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    let data = JSON.parse(event.body);
    let params = {
      TableName: NOTES_TABLE_NAME,
      Item: {
        notesId: data.id,
        title: data.title,
        content: data.content
      },
      ConditionExpression: 'attribute_not_exists(notesId)'
    };
    await documentClient.put(params).promise();
    send(201, data, callback);
  } catch (err) {
    console.log(err);
    send(500, err, callback);
  }
};

module.exports.updateNote = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let notesId = event.pathParameters.id;
  
  try {
    let data = JSON.parse(event.body);
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: {
        notesId: notesId
      },
      UpdateExpression: 'set #title = :title, #content = :content',
      ExpressionAttributeNames: {
        '#title': 'title',
        '#content': 'content'
      },
      ExpressionAttributeValues: {
        ':title': data.title,
        ':content': data.content
      },
      ConditionExpression: 'attribute_exists(notesId)',
      ReturnValues: 'UPDATED_NEW'
    };
    await documentClient.update(params).promise();
    send(200, data, callback);
  } catch (err) {
    console.log(err);
    send(500, err, callback);
  }
};

module.exports.deleteNote = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let noteId = event.pathParameters.id;
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: {
        notesId: noteId
      },
      ConditionExpression: 'attribute_exists(notesId)'
    };
    await documentClient.delete(params).promise();
    send(200, 'Note is deleted!', callback);
  } catch (err) {
    console.log(err);
    send(500, err, callback);
  }
};

module.exports.getAllNotes = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const params = {
      TableName: NOTES_TABLE_NAME
    };
    const data = await documentClient.scan(params).promise();
    send(200, data, callback);
  } catch (err) {
    console.log(err);
    send(500, err, callback);
  }
};
