'user strict';
const _ = require('lodash');
var Promise = this.Promise || require('promise');
var agent = require('superagent-promise')(require('superagent'), Promise);

const makeHttpRequest = async (method, path, options) => {
    let root = process.env.TEST_ROOT;
    let url = `${root}/${path}`;
    let request = agent(method, url);
    let body = _.get(options, "body");
    let idToken = _.get(options, "idToken");
    console.log(`Invoking ${method} ${url}`);
    
    try {
        if (idToken) {
            request.set('Authorization', idToken);
        }
        if (body) {
            request.send(body);
        }
        let response = await request;
        return {
            statusCode: response.status,
            body: response.body
        }
    } catch (err) {
        console.log(err);
        return {
            statusCode: err.status,
            body: err.response.error
        }
    }
};

exports.we_invoke_create_a_note = (options) => {
    // Make an HTTP call
    let response = makeHttpRequest('POST', 'notes', options);
    return response;
};

exports.we_invoke_update_note = (options) => {
    let response = makeHttpRequest('PUT', `notes/${options.noteId}`, options);
    return response;
}

exports.we_invoke_delete_note = (options) => {
    let response = makeHttpRequest('DELETE', `notes/${options.noteId}`, options);
    return response;
}