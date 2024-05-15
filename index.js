import express from 'express';
import prisma from './lib/prisma.js'; // Assurez-vous que le chemin est correct par rapport à l'emplacement de index.js

import chercheursRouter from './routes/chercheurs.js';
import exercicesRouter from './routes/exercice.js';
import equipesRouter from './routes/equipes.js';
import projetsRouter from './routes/projets.js';
import affsRouter from './routes/affs.js';

const app = express();

app.use('/chercheurs/', chercheursRouter);
app.use('/exercices/', exercicesRouter);
app.use('/equipes/', equipesRouter);
app.use('/projets/', projetsRouter);
app.use('/affs/', affsRouter);


app.listen(3000, () => {
    console.log("Server started")
})