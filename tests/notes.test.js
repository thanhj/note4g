'use strict';

const init = require('./steps/init');
const { an_authenticated_user } = require('./steps/given');
const { 
    we_invoke_create_a_note, 
    we_invoke_update_note,
    we_invoke_delete_note
} = require('./steps/when');
let idToken;

describe ('Given an authenticated user', () => {

    beforeAll(async () => {
        init();
        let user = await an_authenticated_user();
        idToken = user.AuthenticationResult.IdToken;
        console.log(`IdToken: ${idToken}`);
    });

    describe ('When we invoke POST /notes endpoint', () => {
        it('Should create a new note', async () => {
            const body = {
                content: 'Hello, world!', 
                title: 'My first note',
                id: '1005'
            };
            let result = await we_invoke_create_a_note({idToken, body});
            expect(result.statusCode).toEqual(200);
        });
    });

    describe ('When we invoke PUT /notes/:id endpoint', () => {
        it('Should update the note', async () => {
            const noteId = '1005';
            const body = {
                content: 'Hello this is my updated note', 
                title: 'My updated test note'
            };
            let result = await we_invoke_update_note({idToken, body, noteId});
            expect(result.statusCode).toEqual(200);
        });
    });

    describe ('When we invoke DELETE /notes/:id endpoint', () => {
        it('Should delete the note', async () => {
            const noteId = '1005';
            let result = await we_invoke_delete_note({idToken, noteId});
            expect(result.statusCode).toEqual(200);
        });
    });


});