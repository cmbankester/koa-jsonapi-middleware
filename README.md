# koa-jsonapi-middleware

A Koa.js middleware for adding spec-compliant JSON-API content negotiation

## Usage

```bash
npm install --save koa-jsonapi-middleware
```

In your application:

```javascript
import koa     from 'koa';
import jsonapi from 'koa-jsonapi-middleware';

const app = koa();

// before any middlewarese/handlers that are capable of altering `this.body`
app.use(jsonapi());

...
```
