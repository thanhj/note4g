import { APIGatewayTokenAuthorizerEvent, Context, AuthResponse, PolicyDocument, APIGatewaySimpleAuthorizerResult } from 'aws-lambda';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
const COGNITO_USERPOOL_ID = process.env.COGNITO_USERPOOL_ID;
const COGNITO_WEB_CLIENT_ID = process.env.COGNITO_WEB_CLIENT_ID;


// const jwtVerifier = CognitoJwtVerifier.create({
//     userPoolId: COGNITO_USERPOOL_ID,
//     tokenUse: 'id',
//     clientId: COGNITO_WEB_CLIENT_ID,

// });
const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: COGNITO_USERPOOL_ID!,
    clientId: COGNITO_WEB_CLIENT_ID,
    tokenUse: 'id',
})

const generatePolicy = (principalId, effect, resource): AuthResponse => {
    var authResponse = {} as AuthResponse;
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

export const handler = async (event: APIGatewayTokenAuthorizerEvent, context: Context, cb: any) => {

    // lambda authorizer code goes here
    var token = event.authorizationToken;
    // arn:aws:execute-api:us-east-1:827726978788:86heudi5f6/*/POST/notes

    var tmp = event.methodArn.split(':');
    var apiGatewayArnTmp = tmp[5].split('/');
    var genericResource = tmp[0] + ':' + tmp[1] + ':' + tmp[2] + ':' + tmp[3] + ':' + tmp[4] + ':' + apiGatewayArnTmp[0] + '/*/*';
    console.log(genericResource);
    console.log(token);
    try {
        const payload = await jwtVerifier.verify(token,{
            clientId: COGNITO_WEB_CLIENT_ID!,
        } );
        console.log(payload);
        cb(null, generatePolicy(payload.username, 'Allow', genericResource));
    } catch (err) {
        console.log(err);
        cb('Unauthorized');
    }
}