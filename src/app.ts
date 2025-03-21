import initApp from "./server";
const port = process.env.PORT;
import https from "https";
import fs from "fs";

initApp().then((app) => {
  if (process.env.NODE_ENV != "production") {
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  } else {
    const prop = {
      key: fs.readFileSync("client-key2.pem"),
      cert: fs.readFileSync("client-cert2.pem"),
      

    };
    https.createServer(prop, app).listen(port);
  }

  
});