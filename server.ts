import app from './app'
import config from './config'

const port = config.SERVER_PORT || 8001;


app.listen(port, () => {
  console.log(`[server]: Local server running at https://localhost:${port}`);
});

export default app;