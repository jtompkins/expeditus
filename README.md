# expeditus

## Dev Setup

- You need [Deno](https://deno.com) installed.
- You also need [Sqlite 3](https://www.sqlite.org/index.html) installed. The CLI
  is used to bootstrap the database.
- `deno install` to install all dependencies
- `deno task db:bootstrap` to create the local dev DB and fill it with some seed
  data
