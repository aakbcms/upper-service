# Service checker
The node.js application can be used to get notification about services required by DDB CMS.

## Checks
All end-points are check by using a socket connection to verify that the end-point exits and is alive.

* SIP2 FBS request - request 99.
* FBS CMS rest API - Login and authentication.
* OpenSearch - search request.

## Installation

* npm install

## Run

* npm run start