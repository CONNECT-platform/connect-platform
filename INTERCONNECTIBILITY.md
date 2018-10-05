![interconnect](assets/interconnect.png)
# INTER-CONNECTIBILITY

a service is called (in the context of this document) **inter-connectible** if it provides its public API 
in the same manner that CONNECT instances do. services that are **inter-connectible** can be connected 
to via CONNECT-platform's services feature, which allows them to automatically add wrapper nodes for each public end-point
of the service, making using this services within the platform extremely convenient. additionally we also believe 
(firmly, no kidding) that this is a nice format for communicating micro-service APIs (in a little bit higher level
and hence more human readable format than alternatives at least).

## location

the public API should be accessible on `/api` sub-path of the root URL of the service. for example, if the service is to be accessible via `https://example.io`, then the API should be accessible via `https://example.io/api`. the term **root URL** here simply means the addresses of all end-points of the API should be sub-paths of this URL, so for example if the root URL of your service is `https://another.example.io/some/arbitrary/sub-path/`, then the api should reside on `https://another.example.io/some/arbitrary/sub-path/api` and the absolute address of all of the end-points should start with `https://another.example.io/some/arbitrary/sub-path/`.

## format

### general

the public API should be in a simple, plain JSON text format (i.e. text that is written in compliance with JSON format). to be more specific, it should be a JSON array containing the signatures of all of the publicly available end-points. it should be returned in response to `GET` requests to the `/api` address.

this is an example of proper response:

```JSON
[
  {
    "path": "/",
    "public": true,
    "outputs": ["msg"]
   }
]
```

which means there is an end-point accessible on the root URL of the service, which requires no inputs and provides a JSON object with a key `msg` as an output. more on that in the following section.
