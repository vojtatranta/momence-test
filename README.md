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

Third, you can run all tests:
```
$ yarn test --watchAll=false
```


## Challenges

Dates. Dates in Javascript with timezones are the problem. Obviously, there are multiple ways to approach. The correct (and the easiest one) would be to use only UTC timezone for both client and the API. However, given the Czech context I decide to take a more complicated route and use date on client and on the server in Czech context only.

The correct way how to handle this would be a business decisions. Adding UTC-only API easy though. The UX is the question here.

## Improvements

### Backend

- Backend in general is not needed at all, but I just wanted to jump into it, I haven't written Node.js backend in a while :).
- Caching of the ČNB request. Should be easy, the cache key should be date. Question is where to store these cached data.
- Compilation of backend code. `ts-node` is absolutely not for production.
- Better validation and error handling. The error hadling is very simply made. The messages should be better.
- Backend (and frontend) error logging. If ČNB people change the output it will crash and we won't know about it.
- Look into why `.catch()` in the root doesn't capture instances of errors properly in the route handler.
- Add `iso` endpoint to pass `zulu ISO` format of date to acquire ČNB exchange rates.
- Test the responses of the backend.

### Frontend

- Poor UX of the "having to click Přepočítat button to get new result". To fix that, there should be way of telling the user tha the displayed result is outdated.
- Demonstrate ability to run without the server (veeery easy).
- Pesky decimal inputs. Basically, `type=number` for input is not helpful. There must be a library that solves inputing of decimals and parsing the correct result out of it. I could find but that would not be any challenge.
- Consolidate usage of `Maybe` monade. I wanted to use `Maybe` monad in JSX for a long time but I haven't had a chance. It looks okayish now, but some improvements would make the readability far better. I still think it is better than ternary operators in JSX. Sure, using `<If></If>` is be better. But that's so uncool :),
- Add more tests. Especially for components like the decimal CZK amount input.
- Add Cypress for UI tests
