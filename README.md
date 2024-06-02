# jnj-server-lib-ts

JnJ Server with Typescript

# Install

```bash
# boot app
bootapp -l node -u jnjsoftko -n jnj-server-lib-ts -d "JnJ Server with Typescript" -t bare-basic-ts

# npm install
npm i express
```

# Edit

> `src/index.ts`

```ts
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

// ** Local
app.get("/hello", async (req, res) => {
  res.json({ hello: "world" });
});

// ** server port: 3000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
```

# build & start

```bash
yarn build

node dist/index.js
```

# check

```bash
http://localhost:3000/hello

# result
{"hello":"world"}
```
