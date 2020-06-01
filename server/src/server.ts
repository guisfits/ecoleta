import express from 'express';

const app = express();

app.get('/users', (request, response) => {
    response.json([
        {
            "Guilherme": {
                "age": 26,
                "hobbies": [
                    "video-game",
                    "guitar",
                    "skate"
                ]
            }
        }
    ])
});

app.listen(3333)
