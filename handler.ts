'use strict';

import {
  DynamoDBClient, 
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand,
  UpdateItemCommandInput
} from '@aws-sdk/client-dynamodb'
import { APIGatewayEvent, Context, APIGatewayProxyCallback } from 'aws-lambda';

const client = new DynamoDBClient({ region: 'us-east-1' });

const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME;

const send = (statusCode, data) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(data)
  };
};

export const createNote = async (event: APIGatewayEvent, context: Context, cb: APIGatewayProxyCallback) => {
  
  try {
    let data = JSON.parse(event.body!);
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

    // return send(200, response);
    cb(null, send(200, response));
  } catch (err) {
    console.log(err);
    cb(null, send(500, err));

  }
};

export const updateNote = async (event: APIGatewayEvent, context: Context, cb: APIGatewayProxyCallback) => {
  let notesId = event.pathParameters?.id
  
  try {
    let data = JSON.parse(event.body!);
    const params: UpdateItemCommandInput = {
      TableName: NOTES_TABLE_NAME,
      Key: {
        notesId: { S: notesId as string}
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
    cb(null, send(200, response));
  } catch (err) {
    console.log(err);
    cb(null, send(500, err));
  }
};

export const deleteNote = async (event: APIGatewayEvent, context: Context, cb: APIGatewayProxyCallback) => {
  let notesId = event.pathParameters?.id;
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: {
        notesId: { S: notesId as string}
      },
      ConditionExpression: 'attribute_exists(notesId)'
    };
    const response = await client.send(new DeleteItemCommand(params));
    cb(null, send(200, response));
  } catch (err) {
    console.log(err);
    cb(null, send(500, err));
  }
};

export const getAllNotes = async (event: APIGatewayEvent, context: Context, cb: APIGatewayProxyCallback) => {
  console.log(JSON.stringify(event));
  try {
    const params = {
      TableName: NOTES_TABLE_NAME
    };
    const response = await client.send(new ScanCommand(params));
    cb(null, send(200, response));
  } catch (err) {
    console.log(err);
    cb(null, send(500, err));
  }
};
