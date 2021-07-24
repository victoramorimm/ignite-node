import { createConnection, getConnectionOptions } from "typeorm";
import path from "path";

interface IOptions {
  host: string;
}

getConnectionOptions().then((options) => {
  const newOptions = options as IOptions;

  newOptions.host = "database_ignite";

  createConnection({
    ...options,
    entities: [
      path.resolve(__dirname, "..", "modules", "**", "entities", "**"),
    ],
  });
});
