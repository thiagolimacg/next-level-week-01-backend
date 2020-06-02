import express from 'express';

const routes = express.Router();

routes.get('/users', (request, response) => {
    return response.json([
        {
            "name": "Thiago Gonçalves"
        }
    ]);
});

export default routes;