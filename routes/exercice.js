import express from 'express';
import prisma from '../lib/prisma.js';


const router = express.Router();

router.get('/1', async (req, res) => {
    try {
      const budgets = await prisma.projet.findMany({
        select: {
          BUDGET: true,
        },
        where: {
          BUDGET: {
            not: null,
          },
        },
        orderBy: {
          BUDGET: 'desc',
        },
        distinct: ['BUDGET'],
      });
  
      res.json(budgets);
    } catch (error) {
      console.error('Erreur lors de la récupération des budgets : ', error);
      res.status(500).send('Erreur lors de la récupération des données');
    }
  });
  
  router.get('/2', async (req, res) => {
    const { min, max } = req.query;
  
    if (!min || !max) {
      return res
        .status(400)
        .send("Vous devez spécifier les paramètres 'min' et 'max'.");
    }
  
    try {
      const projets = await prisma.projet.findMany({
        where: {
          BUDGET: {
            gte: parseFloat(min),
            lte: parseFloat(max),
          },
        },
        orderBy: {
          BUDGET: 'asc',
        },
      });
  
      res.json(projets);
    } catch (error) {
      console.error('Erreur lors de la récupération des projets : ', error);
      res.status(500).send('Erreur lors de la récupération des données');
    }
  });
  
  router.get('/3', async (req, res) => {
    try {
      const chercheurs = await prisma.chercheur.findMany();
  
      const equipeIds = chercheurs.map(chercheur => chercheur.NE);
      const equipes = await prisma.equipe.findMany({
        where: {
          NE: {
            in: equipeIds
          }
        }
      });

      const equipeMap = equipes.reduce((map, equipe) => {
        map[equipe.NE] = equipe.NOM;
        return map;
      }, {});

      const result = chercheurs.map(chercheur => ({
        NOM: chercheur.NOM,
        PRENOM: chercheur.PRENOM,
        NOM_EQUIPE: equipeMap[chercheur.NE] || 'Aucune équipe'
      }));
  
      res.json(result);
    } catch (error) {
      console.error('Erreur lors de la récupération des chercheurs : ', error);
      res.status(500).send('Erreur lors de la récupération des données');
    }
  });


  router.get('/4', async (req, res) => {
    try {
      const equipes = await prisma.equipe.findMany({
        include: {
          _count: {
            select: { projet: true },
          },
        },
      });
  
      const resultat = equipes.map((equipe) => ({
        Nom: equipe.NOM,
        NombreDeProjets: equipe._count.projet,
      }));
  
      res.json(resultat);
    } catch (error) {
      console.error('Erreur lors de la récupération des équipes : ', error);
      res.status(500).send('Erreur lors de la récupération des données');
    }
  });
  
  router.get('/5', async (req, res) => {
    const { annee, valeurX } = req.query;
  
    if (!annee || !valeurX) {
      return res.status(400).json({ error: 'Les paramètres annee et valeurX sont requis.' });
    }
  
    try {
      const anneeInt = parseInt(annee);
      const valeurXFloat = parseFloat(valeurX);
  
      const projets = await prisma.projet.findMany({
        where: {
          BUDGET: {
            gt: valeurXFloat
          }
        },
        select: {
          NP: true
        }
      });
  
      const projetIds = projets.map(projet => projet.NP);
  
      const affs = await prisma.aff.findMany({
        where: {
          ANNEE: anneeInt,
          NP: {
            in: projetIds
          }
        },
        select: {
          NC: true
        }
      });

      const participationCount = affs.reduce((acc, aff) => {
        acc[aff.NC] = (acc[aff.NC] || 0) + 1;
        return acc;
      }, {});

      const chercheurIds = Object.keys(participationCount).filter(NC => participationCount[NC] > 2);

      const chercheurs = await prisma.chercheur.findMany({
        where: {
          NC: {
            in: chercheurIds.map(id => parseInt(id))
          }
        },
        select: {
          NOM: true,
          PRENOM: true
        }
      });
  
      res.json(chercheurs);
    } catch (error) {
      console.error('Erreur lors de la récupération des chercheurs : ', error);
      res.status(500).send('Erreur lors de la récupération des données');
    }
  });

  router.get('/6', async (req, res) => {
  const { nom, annee } = req.query;

  if (!nom || !annee) {
    return res.status(400).json({ error: 'Les paramètres nom et annee sont requis.' });
  }

  try {
    const anneeInt = parseInt(annee);

    // Trouver le chercheur spécifié par nom
    const chercheur = await prisma.chercheur.findFirst({
      where: { NOM: nom },
      select: { NC: true }
    });

    if (!chercheur) {
      return res.status(404).json({ error: 'Chercheur non trouvé' });
    }

    const chercheurId = chercheur.NC;

    // Trouver les projets auxquels le chercheur spécifié a participé durant l'année donnée
    const projets = await prisma.aff.findMany({
      where: {
        NC: chercheurId,
        ANNEE: anneeInt
      },
      select: { NP: true }
    });

    const projetIds = projets.map(projet => projet.NP);

    // Trouver les chercheurs qui ont participé aux mêmes projets durant l'année donnée
    const affs = await prisma.aff.findMany({
      where: {
        NP: { in: projetIds },
        ANNEE: anneeInt,
        NC: { not: chercheurId }
      },
      select: { NC: true }
    });

    const chercheurIds = affs.map(aff => aff.NC);

    // Trouver les chercheurs correspondants
    const result = await prisma.chercheur.findMany({
      where: {
        NC: { in: chercheurIds }
      },
      select: {
        NOM: true,
        PRENOM: true
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Erreur lors de la récupération des chercheurs : ', error);
    res.status(500).send('Erreur lors de la récupération des données');
  }
});
  
  router.get('/7', async (req, res) => {
    const annee = parseInt(req.query.annee);
    const budget = parseFloat(req.query.budget);

    try {
        const affs = await prisma.aff.findMany({
            where: {
            ANNEE: annee,
        },
        select: {
            NP: true,
        },
        });

        const projetIds = affs.map(aff => aff.NP);

    const projets = await prisma.projet.findMany({
      where: {
        NP: {
          in: projetIds,
        },
        BUDGET: {
          gt: budget,
        },
      },
    });

    res.json(projets.map(proj => ({
      Nom: proj.NOM,
      Budget: proj.BUDGET,
    })));
  } catch (error) {
    console.error('Erreur lors de la récupération des projets : ', error);
    res.status(500).send('Erreur lors de la récupération des données');
  }
  });
  
  router.get('/8', async (req, res) => {
    const { nomA, nomB } = req.query;
  
    try {
      if (!nomA || !nomB) {
        return res.status(400).json({ error: 'Les paramètres nomA et nomB sont requis.' });
      }
  
      // Récupérer les identifiants des chercheurs avec les noms donnés
      const chercheurs = await prisma.chercheur.findMany({
        where: {
          OR: [
            { NOM: nomA },
            { NOM: nomB }
          ]
        },
        select: { NC: true }
      });
  
      if (chercheurs.length === 0) {
        return res.status(404).json({ error: 'Chercheurs non trouvés' });
      }
  
      const chercheurIds = chercheurs.map(chercheur => chercheur.NC);
  
      // Récupérer les enregistrements 'aff' pour les chercheurs trouvés
      const affs = await prisma.aff.findMany({
        where: {
          NC: {
            in: chercheurIds
          }
        },
        select: {
          NP: true
        }
      });
  
      const projetIds = affs.map(aff => aff.NP);
  
      // Récupérer les projets correspondants
      const projets = await prisma.projet.findMany({
        where: {
          NP: {
            in: projetIds
          }
        }
      });
  
      res.json(projets);
    } catch (error) {
      console.error('Erreur lors de la récupération des projets : ', error);
      res.status(500).send('Erreur lors de la récupération des données');
    }
  });

export default router;