import app from './app';
import './db';
const PORT = process.env.PORT || 3000;

console.log('DB module loaded');


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
