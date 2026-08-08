import { db } from "../index";

export async function getExternalAuthors() {
  return db.query.externalAuthor.findMany({
    orderBy: (externalAuthor, { asc }) => [asc(externalAuthor.name)],
  });
}
