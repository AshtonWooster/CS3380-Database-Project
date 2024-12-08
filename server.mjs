import express from 'express';
import bodyParser from 'body-parser';


const PORT = 3000;

function main() {
    let app = express();
    app.use(bodyParser.json());

    app.get('/', (request, response) => {
        response.sendFile('static/index.html', { root: '.' });
    });

    app.use('/static', express.static('static'));

    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
}

main();