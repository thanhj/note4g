const { CognitoJwtVerifier } = require('aws-jwt-verify');
const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: 'us-east-1_rDbYeYj5y',
    tokenUse: 'id',
    clientId: '6r9jdgobm0qkkvc7rtjb1hk362',

});

const generatePolicy = (principalId, effect, resource) => {

    var authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        let policyDocument = {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource
                }
            ]
        };
        authResponse.policyDocument = policyDocument;
    }
    authResponse.context = {
        foo: 'bar'
    };
    console.log(JSON.stringify(authResponse));
    return authResponse;
};

exports.handler = async (event, context, callback) => {

    // lambda authorizer code goes here
    var token = event.authorizationToken; // "allow" or "deny"
    console.log(token);
    try {
        const payload = await jwtVerifier.verify(token);
        console.log(payload);
        callback(null, generatePolicy(payload.username, 'Allow', event.methodArn));
    } catch (err) {
        console.log(err);
        callback('Unauthorized');
    }
}