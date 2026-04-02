const express = require('express');
const { port } = require('./config');

const app = express();
app.use(express.json());

app.use('/health', require('./routes/health'));
app.use('/terrain', require('./routes/terrain'));
app.use('/risk', require('./routes/risk'));

app.listen(port, () => {
  console.log(`TrailGuard backend listening on http://localhost:${port}`);
});