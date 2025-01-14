const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const xml2js = require('xml2js');
const ConversionHistory = require('./models/ConversionHistory');

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://currencycalculator:currencycalculator@cluster0.leke2.mongodb.net/', {

}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

async function fetchCurrencyRates() {
  try {
    const response = await axios.get('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml');
    const result = await xml2js.parseStringPromise(response.data);
    const rates = result['gesmes:Envelope'].Cube[0].Cube[0].Cube;
    const ratesObject = { EUR: 1 };
    rates.forEach((rate) => {
      ratesObject[rate.$.currency] = parseFloat(rate.$.rate);
    });
    return ratesObject;
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    return null;
  }
}

let currencyRates = {};
let lastUpdate = null;

async function updateRates() {
  const newRates = await fetchCurrencyRates();
  if (newRates) {
    currencyRates = newRates;
    lastUpdate = new Date();
    console.log('Currency rates updated:', currencyRates);
  }
}

// Update currency rates every hour
setInterval(updateRates, 3600000);

// Initial fetch of currency rates
updateRates();

app.get('/api/rates', (req, res) => {
  res.json({ rates: currencyRates, lastUpdate });
});

app.post('/api/convert', (req, res) => {
  const { sourceCurrency, targetCurrency, amount } = req.body;
  const sourceRate = currencyRates[sourceCurrency];
  const targetRate = currencyRates[targetCurrency];

  if (!sourceRate || !targetRate) {
    return res.status(400).json({ error: 'Invalid currency' });
  }

  const result = (amount / sourceRate) * targetRate;
  res.json({ result: result.toFixed(2) });
});

app.post('/api/history', async (req, res) => {
  try {
    const history = new ConversionHistory(req.body);
    await history.save();
    res.status(201).json(history);
  } catch (error) {
    res.status(400).json({ error: 'Error saving conversion history' });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const history = await ConversionHistory.find().sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching conversion history' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

