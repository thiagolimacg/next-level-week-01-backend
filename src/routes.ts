import express, { request, response, json } from 'express';
import knex from './database/connection'

const routes = express.Router();

routes.get('/items', async (request, response) => {
    const items = await knex('items').select('*');
    const serializedItems = items.map(item => {
        return {
            id: item.id,
            title: item.title,
            image_url: `http://localhost:3333/uploads/${item.image}`, 
        }
    });
    return response.json(serializedItems);
});

routes.post('/points', async (request, response) => {
    const {name, email, whatsapp, latitude, longitude, city, uf, items} = request.body;
    
    const trx = await knex.transaction();

    const insertedIds = await trx('points').insert({
        //full sintaxe, ex: name(propriedade): name(variável), email: email
        //short sintaxe, é possível utilizar quando o nome da variável é igual ao nome da propriedade do objeto
        image: 'image-fake', name, email, whatsapp, latitude, longitude, city, uf
    });

    const point_id = insertedIds[0];

    const pointItems = items.map((item_id: number) => {
        return {
            item_id,
            point_id,
        }
    });

    await trx('points_items').insert(pointItems);

    return response.json({success: true});
})

export default routes;