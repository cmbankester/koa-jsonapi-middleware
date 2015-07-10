// JSON-API Validation -- See: http://jsonapi.org/format/#content-negotiation
export default function(opts={}) {

  return function *(next) {
    this.set('Content-Type', 'application/vnd.api+json');
    if (!this.header.accept) {
      this.body   = {error: 'Header not found: "Accept: application/vnd.api+json"'};
      this.status = 400;
      return;
    }

    // Accept: application/vnd.api+json
    // All requests must have json-api HTTP accept header
    if (!this.header.accept || !/application\/vnd\.api\+json/.test(this.header.accept)) {
      this.body = {error: 'Header not found: "Accept: application/vnd.api+json"'};
      this.status = 400;
      return;
    }

    // Servers MUST respond with a 406 Not Acceptable status code if a request's
    // Accept header contains the JSON API media type and all instances of that
    // media type are modified with media type parameters.
    if (!/application\/vnd\.api\+json;?\s*($|,)/.test(this.header.accept)) {
      this.body = {error: '406 Not Acceptable'};
      this.status = 406;
      return;
    }

    // Content-type: application/vnd.api+json
    // POST PUT and PATCH must have json-api HTTP content-type header
    if (/^(POST|PUT|PATCH)$/.test(this.method)) {
      if (!this.header['content-type'] || !/application\/vnd\.api\+json/.test(this.header['content-type'])) {
        this.body = {error: 'Header not found: "Content-Type: application/vnd.api+json"'};
        this.status = 400;
        return;
      }
    }
    // Servers MUST respond with a 415 Unsupported Media Type status code if a
    // request specifies the header Content-Type: application/vnd.api+json with
    // any media type parameters.
    if (/application\/vnd\.api\+json;\s*\w+/.test(this.header['content-type'])) {
      throw new UnsupportedMediaTypeError();
      this.body = {error: '415 Unsupported Media Type'};
      this.status = 415;
      return;
    }

    yield next;

    // just in case koa overwrote the content type
    this.set('Content-Type', 'application/vnd.api+json');
  }
}
