# Expeditus

Expeditus is a URL shortener. It's also a test project for a few different
technologies:

- [Deno](https://deno.com)
- [Hono](https://hono.dev)
- [SQLite](https://www.sqlite.org)
- [HTMX](https://htmx.org)
- OAuth sign-in (limited to [Github](https://github.com) here)

There are a few 3rd-party libraries that handle some important functionality:

- [Hono sessions](https://github.com/jcs224/hono_sessions) - for easy
  cookie-based sessions
- [Hono OAuth providers middleware](https://github.com/honojs/middleware/tree/main/packages/oauth-providers) -
  for the Github auth stuff
- [Deno SQLite 3 drivers](https://github.com/denodrivers/sqlite3/tree/main) -
  for the database

## Why build Expeditus?

I wanted to learn a stack of new tech all at once, but I wanted a project that
ideally did something actually useful. A URL shortener doesn't do _much_, but
what it _does_ do hits on enough common website functionality that it seemed
like a good place to start.

Every project I've got on my list talks to databases and requires some kind of
authenticated sign-in. I wanted to figure out how to do those things in a
minimal way that doesn't require a lot of custom code or infrastructure. The
minimal approach appeals to me but it's also effectively necessary given the
relative new-ness of Deno - in my (limited) experience, the more complex the NPM
library, the less likely it is to work with Deno out of the box (looking your
way, Prisma 😭).

## What is an 'expeditus'?

Expeditus is the
[patron saint of programmers and navigators](https://www.catholic.org/saints/saint.php?saint_id=347).
It seemed appropriate.

## Dev Setup

### Required tooling

You'll need to set up Deno and SQLite. Deno has
[set up instructions](https://docs.deno.com/runtime/getting_started/installation/);
for SQLite, consult the docs for your favorite local package manager. You'll
probably also want the official
[Deno VS Code extension](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
and a VS Code extension for working with a local SQLite database.

### Environment Configuration

Expeditus needs some local configuration to run properly; this can be injected
via env vars, but it's much easier to create a `.env` file locally. You need
values for the following variables:

| Env var         | Why?                                                                                                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`  | The location of your SQLite database. I have this set to `./data/dev.db` for local development.                                                                                                                                       |
| `AUTH_SECRET`   | This is used to encrypt the session cookie. It can be any 32-character string.                                                                                                                                                        |
| `GITHUB_ID`     | This is the ID of your Github application. You need one of those to do Github authentication via OAuth. [There are docs](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app); you should read them. |
| `GITHUB_SECRET` | This is the secret key for your Github app. It's really really really important that you not leak this.                                                                                                                               |

Fill all of those out in your `.env` file.

### Bootstrapping

A few easy steps:

1. Run `deno install` to install all of the project dependencies.
1. Run `deno task db:bootstrap` to create your local database, set up the table
   structures, and fill in some sample data. As a tip, you might want to change
   the test user in `seed.sql` to match your own Github username and email. If
   not, you can always just create a few URLs in the app's UI later.

### Local testing

- To run the project from the command line, run `deno task dev`.
- To watch for changes and restart automatically, run `deno task dev:watch`
- To run tests, run `deno test`. Right now, there are only a few tests for the
  DB infrastructure.

## Todos

- [ ] IoC Container for dependencies?
- [ ] Move reusable components into their own namespace
- [ ] Tailwind or other CSS styling
- [ ] UI improvements
- [ ] Redirect to app from root route if already logged in
- [ ]
