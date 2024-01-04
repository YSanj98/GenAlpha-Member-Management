const app = require('./app');

if(process.env.NODE_ENV == 'production') {
    require('dotenv').config({ path: path.join(__dirname, 'config', '.env') }); // Define the path to your .env file
  }

  const server = app.listen(process.env.PORT, () => {
    console.log(`App running on http://localhost:${process.env.PORT}`);
    });