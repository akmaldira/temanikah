# Getting Started

This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.

## Run Locally

Clone the project

```bash
  git clone https://github.com/akmaldira/temanikah.git
```

Go to the project directory

```bash
  cd temanikah
```

Install dependencies

```bash
  yarn install
```

Environment variable

```bash
  // for development
  sudo nano .env.development //fill required env variable

  // for production
  sudo nano .env.development //fill required env variable
```

Migrate database

```bash
  yarn migration:run
```

Start the server as development

```bash
  yarn dev
```

Start the server as production

```bash
  yarn start
```

## Deployment

To deploy this project run

- Deploy with pm2

```bash
  yarn deploy:prod
```

- Deploy with docker

```bash
  cooming soon
```
