const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.favoriteFruit) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    favoriteFruit: req.body.favoriteFruit,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred.' });
  });

  return domoPromise;
};

const deleteDomo = (req, res) => Domo.DomoModel.deleteByOwnerName(
  req.session.account._id,
  req.body.name,
  (err) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.status(204).send();
  },
);

const getDomos = (req, res) => Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }

  return res.json({ domos: docs });
});

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeDomo;
module.exports.delete = deleteDomo;
