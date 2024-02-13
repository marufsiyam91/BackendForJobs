const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Serve JSON data from file
app.get('/data', (req, res) => {
  fs.readFile('data.json', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});

// Serve a single data item based on ID
app.get('/data/:id', (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile('data.json', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const jsonData = JSON.parse(data);
    const singleData = jsonData.find(item => item.id === id);
    if (!singleData) {
      res.status(404).send('Data not found');
      return;
    }
    res.json(singleData);
  });
});

// Update a single data item based on ID (PUT request)
app.put('/data/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const newData = req.body; // Assuming the request body contains the updated data
  fs.readFile('data.json', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    let jsonData = JSON.parse(data);
    const index = jsonData.findIndex(item => item.id === id);
    if (index === -1) {
      res.status(404).send('Data not found');
      return;
    }
    jsonData[index] = { ...jsonData[index], ...newData };
    fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), err => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.json(jsonData[index]);
    });
  });
});

// Delete a single data item based on ID (DELETE request)
app.delete('/data/:id', (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile('data.json', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    let jsonData = JSON.parse(data);
    const index = jsonData.findIndex(item => item.id === id);
    if (index === -1) {
      res.status(404).send('Data not found');
      return;
    }
    const deletedItem = jsonData.splice(index, 1)[0];
    fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), err => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.json(deletedItem);
    });
  });
});


app.post('/data', (req, res) => {
  const newData = req.body; // Assuming the request body contains the new data
  fs.readFile('data.json', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    let jsonData = JSON.parse(data);
    // Generate a unique ID for the new data item
    const newId = Math.max(...jsonData.map(item => item.id), 0) + 1;
    const newItem = { id: newId, ...newData };
    jsonData.push(newItem);
    fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), err => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.status(201).json(newItem); // Respond with the created data item
    });
  });
});





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});







