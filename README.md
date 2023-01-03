# Simple ČNB exchange rates app for Momence

## Run it

Well, don't forget to install it.

```
$ yarn
```

First, start the server. (currently in dev-mode only using `ts-node`)

```
$ yarn server
```

Second, start the frontend application

```
$ yarn start
```

## Challenges

Dates. Dates in Javascript with timezones are the problem. Obviously, there are multiple ways to approach. The correct (and the easiest one) would be to use only UTC timezone for both client and the API. However, given the Czech context I decide to take a more complicated route and use date on client and on the server in Czech context only.

The correct way how to handle this would be a business decisions. Adding UTC-only API easy though. The UX is the question here.
