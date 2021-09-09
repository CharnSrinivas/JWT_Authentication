import express from 'express'
const PORT = 5000;
const app = express();

function main() {
    app.use(express.json())

    app.listen(PORT, () => {
        console.log('Listening to port ' + PORT);
    })

}
main();