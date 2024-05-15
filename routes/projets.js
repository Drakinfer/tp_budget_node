import express from 'express';
import prisma from '../lib/prisma.js';


const router = express.Router();


router.get('/', async (req, res) => {
    const allProjets = await prisma.projet.findMany();
    res.send(allProjets)
})

router.post('/', async (req, res) => {
    const { NOM, BUDGET, NE } = req.body;
  
    try {
      const projet = await prisma.projet.create({
        data: { NOM, BUDGET, NE }
      });
      res.json(projet);
    } catch (error) {
      console.error('Erreur lors de la création du projet : ', error);
      res.status(500).send('Erreur lors de la création du projet');
    }
  });

router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const projet = await prisma.projet.findUnique({
        where: { id }
      });
      res.json(projet);
    } catch (error) {
      console.error('Erreur lors de la récupération du projet : ', error);
      res.status(500).send('Erreur lors de la récupération du projet');
    }
  });

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { NOM, BUDGET, NE } = req.body;
  
    try {
      const projet = await prisma.projet.update({
        where: { id },
        data: { NOM, BUDGET, NE }
      });
      res.json(projet);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du projet : ', error);
      res.status(500).send('Erreur lors de la mise à jour du projet');
    }
  });

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.projet.delete({
        where: { id }
      });
      res.send('Projet supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du projet : ', error);
      res.status(500).send('Erreur lors de la suppression du projet');
    }
  });

export default router;