#!/bin/bash

# Step 1: Spin up Elasticsearch container
docker-compose -f docker-compose.test.yml up -d

echo "Waiting for Elasticsearch to be ready..."
until curl -s http://localhost:9300/_cluster/health | grep -q '"status":"green\|yellow"'; do
  echo "Elasticsearch is not ready yet. Retrying in 5 seconds..."
  sleep 5
done

# Step 3: Run indexing
NODE_ENV=test ts-node ./src/cli.ts

# Step 4: Run the integration tests
NODE_ENV=test pnpm run itest

# Step 5: Tear down the Docker container
docker-compose -f docker-compose.test.yml down -v
