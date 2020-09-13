// lib/server.ts
import app from "./app";

let PORT: any = 3000;
if (process.env.PORT != undefined) PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));