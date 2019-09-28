import app from './App';

const port = Number(process.env.PORT) || 3000;

app.listen(port, '', 0, (err: any) => {
  if (err) {
    return console.log(err);
  }

  return console.log(`server is listening on http://localhost:${port}`);
});
