import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

router.get('/', async (req, res) => {
const allAffs = await prisma.aff.findMany();
    res.send(allAffs)
})

router.post('/', async (req, res) => {
    const { NP, NC, ANNEE } = req.body;
  
    try {
      const aff = await prisma.aff.create({
        data: { NP, NC, ANNEE }
      });
      res.json(aff);
    } catch (error) {
      console.error('Erreur lors de la création de l\'affectation : ', error);
      res.status(500).send('Erreur lors de la création de l\'affectation');
    }
  });

router.get('/aff/:NP/:NC/:ANNEE', async (req, res) => {
    const { NP, NC, ANNEE } = req.params;
  
    try {
      const aff = await prisma.aff.findUnique({
        where: { NP_NC_ANNEE: { NP, NC: parseInt(NC), ANNEE: parseInt(ANNEE) } }
      });
      res.json(aff);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'affectation : ', error);
      res.status(500).send('Erreur lors de la récupération de l\'affectation');
    }
  });

router.put('/aff/:NP/:NC/:ANNEE', async (req, res) => {
    const { NP, NC, ANNEE } = req.params;
    const { newNC, newANNEE } = req.body;
  
    try {
      const aff = await prisma.aff.update({
        where: { NP_NC_ANNEE: { NP, NC: parseInt(NC), ANNEE: parseInt(ANNEE) } },
        data: { NC: newNC, ANNEE: newANNEE }
      });
      res.json(aff);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'affectation : ', error);
      res.status(500).send('Erreur lors de la mise à jour de l\'affectation');
    }
  });

router.delete('/aff/:NP/:NC/:ANNEE', async (req, res) => {
    const { NP, NC, ANNEE } = req.params;
  
    try {
      await prisma.aff.delete({
        where: { NP_NC_ANNEE: { NP, NC: parseInt(NC), ANNEE: parseInt(ANNEE) } }
      });
      res.send('Affectation supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'affectation : ', error);
      res.status(500).send('Erreur lors de la suppression de l\'affectation');
    }
  });

export default router;