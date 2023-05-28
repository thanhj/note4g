'use strict';
const DynamoDB = require('aws-sdk/clients/dynamodb');
const documentClient = new DynamoDB.DocumentClient({ region: 'us-east-1'});

module.exports.createNote = async (event) => {
  return {
    statusCode: 201,
    body: JSON.stringify('A new note created!')
  };
};

module.exports.updateNote = async (event) => {
  let noteId = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify('The note with id ' + noteId + ' updated!')
  };
};

module.exports.deleteNote = async (event) => {
  let noteId = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify('The note with id ' + noteId + ' deleted!')
  };
};

module.exports.getAllNotes = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify('All notes are returned!')
  };
};
