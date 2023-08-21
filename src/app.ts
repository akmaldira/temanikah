import { LOG_FORMAT, NODE_ENV, PORT } from "@config";
import { AppDataSource } from "@database/datasource";
import { IRoutes } from "@interfaces/route.interface";
import errorMiddleware from "@middlewares/error.middleware";
import { logger, stream } from "@utils/logger";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

class App {
  public app: Application;
  public env: string;
  public port: string | number;

  constructor(routes: IRoutes[]) {
    this.app = express();
    this.env = NODE_ENV;
    this.port = PORT || 3000;

    logger.info("Running environment: " + this.env);
    logger.info("App initializing...");
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      logger.info(`App listening on http://localhost:${this.port}`);
    });
  }

  private connectToDatabase(): void {
    AppDataSource.initialize()
      .then(() => logger.info("Database connected"))
      .catch((err: any) => logger.error("Database error", err));
  }

  private initializeMiddlewares(): void {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors());
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: IRoutes[]): void {
    routes.forEach(route => {
      this.app.use("/", route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        components: {
          schemas: {},
        },
        info: {
          title: "Temanikah - OpenAPI 3.0",
          version: "1.0.0",
          description: "API Temanikah",
          license: {
            name: "MIT",
            url: "https://opensource.org/licenses/MIT",
          },
        },
      },
      apis: ["swagger.yaml"],
    };

    const specs = swaggerJSDoc(options);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }
}

export default App;
