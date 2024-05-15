import express from 'express';
import prisma from '../lib/prisma.js';


const router = express.Router();

router.get('/', async (req, res) => {
    const allChercheurs = await prisma.chercheur.findMany();
    res.send(allChercheurs)
})

router.post('/', async (req, res) => {
    const { NOM, PRENOM, NE } = req.body;
  
    try {
      const chercheur = await prisma.chercheur.create({
        data: { NOM, PRENOM, NE }
      });
      res.json(chercheur);
    } catch (error) {
      console.error('Erreur lors de la création du chercheur : ', error);
      res.status(500).send('Erreur lors de la création du chercheur');
    }
  });

router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const chercheur = await prisma.chercheur.findUnique({
        where: { NC: parseInt(id) }
      });
      res.json(chercheur);
    } catch (error) {
      console.error('Erreur lors de la récupération du chercheur : ', error);
      res.status(500).send('Erreur lors de la récupération du chercheur');
    }
  });

 router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { NOM, PRENOM, NE } = req.body;
  
    try {
      const chercheur = await prisma.chercheur.update({
        where: { NC: parseInt(id) },
        data: { NOM, PRENOM, NE }
      });
      res.json(chercheur);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du chercheur : ', error);
      res.status(500).send('Erreur lors de la mise à jour du chercheur');
    }
  });

  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.chercheur.delete({
        where: { NC: parseInt(id) }
      });
      res.send('Chercheur supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du chercheur : ', error);
      res.status(500).send('Erreur lors de la suppression du chercheur');
    }
  });

export default router;