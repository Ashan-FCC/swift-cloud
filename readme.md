### swift-cloud
 An Api to search for Taylor Swift songs to spot trends and quirks

Deployed to Heroku

Find the docs at
https://swift-cloud-799ab6467e8a.herokuapp.com/docs


### Local Development

1. Clone the repository
2. This project uses nodejs v20.13 and pnpm for the package manager. Install pnpm using `npm install -g pnpm`
3. Install dependencies using `pnpm install`
5. Run elasticsearch via docker using `docker-compose up -d elasticsearch`
6. Index the source data to elasticsearch by running `pnpm run index`
7. Run the api using `pnpm run api`
8. You can query the api at `http://localhost:{port}/v1/swift-cloud/songs`


The project will work out of the box with `.env.base` file, but if you wish to override any envrionment variables, create a new file `.env`
Any values specified in the `.env` file will override the values in `.env.base`

### Docs

Docs will be hosted at `http://localhost:{port}/docs` after running the api.
They're also available at https://swift-cloud-799ab6467e8a.herokuapp.com/docs

### Running tests

To run tests `pnpm run test`

The unit tests are run by jest and have no dependency on elasticsearch

To run integration tests, a shell script is used. This script will start a new elasticsearch instance, run the data indexer and then run the tests. 
The elasticsearch instance will be destroyed after the tests are run.

### Future improvements

1. Save the source data in S3 and stream this data when running data indexer
2. Separate data for integration tests. Currently the integration tests use the same data as the api
3. Improve configs, use @nestjs/config and use DI to inject elasticsearch service