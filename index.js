const express = require('express');
const fs = require('fs');

const app = express();

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
