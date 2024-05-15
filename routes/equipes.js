import express from 'express';
import prisma from '../lib/prisma.js';


const router = express.Router();


router.get('/', async (req, res) => {
    const allEquipes = await prisma.equipe.findMany();
    res.send(allEquipes)
})

router.post('/', async (req, res) => {
    const { NOM } = req.body;
  
    try {
      const equipe = await prisma.equipe.create({
        data: { NOM }
      });
      res.json(equipe);
    } catch (error) {
      console.error('Erreur lors de la création de l\'équipe : ', error);
      res.status(500).send('Erreur lors de la création de l\'équipe');
    }
  });

router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const equipe = await prisma.equipe.findUnique({
        where: { NE: parseInt(id) }
      });
      res.json(equipe);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'équipe : ', error);
      res.status(500).send('Erreur lors de la récupération de l\'équipe');
    }
  });

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { NOM } = req.body;
  
    try {
      const equipe = await prisma.equipe.update({
        where: { NE: parseInt(id) },
        data: { NOM }
      });
      res.json(equipe);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'équipe : ', error);
      res.status(500).send('Erreur lors de la mise à jour de l\'équipe');
    }
  });

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.equipe.delete({
        where: { NE: parseInt(id) }
      });
      res.send('Équipe supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'équipe : ', error);
      res.status(500).send('Erreur lors de la suppression de l\'équipe');
    }
  });

export default router;