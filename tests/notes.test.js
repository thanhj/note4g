'use strict';

let init = require('./steps/init');
let { an_authenticated_user } = require('./steps/given');
let { we_invoke_create_a_note } = require('./steps/when');
let idToken;

describe ('Given an authenticated user', () => {

    beforeAll(async () => {
        init();
        let user = await an_authenticated_user();
        idToken = user.AuthenticationResult.IdToken;
        console.log(idToken);
    });

    describe ('When we invoke POST /notes endpoint', () => {
        it('Should create a new note', async () => {
            const body = {
                content: 'Hello, world!', 
                title: 'My first note',
                id: '1002',
            };
            let result = await we_invoke_create_a_note({idToken, body});
            expect(result.statusCode).toEqual(200);
        });
    });



});