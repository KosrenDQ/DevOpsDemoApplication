import { Config, MongoConfig, KafkaConfig, AuthConfig } from './config.interface';

export class ConfigService {
  private readonly config: Config;

  constructor() {

    // Create auth configuration
    const auth: AuthConfig = {};
    auth.algorithms = ['RS256'];
    auth.issuer = process.env.AUTH_ISSUER || 'https://159.69.34.172.xip.io/auth/realms/edu';
    auth.realm = process.env.AUTH_REALM || 'edu';
    auth.resource = process.env.AUTH_RESOURCE || 'university-service';
    auth.publicKey = process.env.AUTH_PUBLIC_KEY || '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnUdHa5+JE80pUWFOBRu8HVQkidEEYBt8fJd2H4oYkO3E5zoMg3IjfD2I6SiyL3XYINuNBaiH0/fV7F1gzADAjW3izOHZcLQUjvxkI0L6lvH8jrT7ooYOyy7qVbI686EswzdRbtEzA+eq3EKGoawGIKCoQPuGeB+PmQxV8yK/PRS3Kr6NoqV78LIMk6w88Jkl0480ZZg+utM2Hfk9Qhy/03Mt0Ravq/ZBHu9o/ocy4Kelw0Gwi31q87p8N1m9ourbCqdKzFFScTb3LarSPtEteEUXdSLCZ/cg3HqHOG+0etHK4d8RbxqoT3T9MYe9I7wNYqhdS2BGAS0qQ+uoOegNnQIDAQAB\n-----END PUBLIC KEY-----';

    // Create mongo configuration
    const mongo: MongoConfig = {};
    const user = process.env.MONGO_USER || '';
    const password = process.env.MONGO_PASSWORD || '';
    const credentials = user && password ? `${user}:${password}@` : '';
    const mongoHost = process.env.MONGO_HOST || 'localhost';
    const mongoPort = process.env.MONGO_PORT || '27017';
    const database = process.env.MONGO_DATABASE || '';
    mongo.uri = process.env.MONGO_URI || `mongodb://${credentials}${mongoHost}:${mongoPort}/${database}`;

    // Create kafka configuration
    const kafka: KafkaConfig = {}
    kafka.clientId = 'university';
    kafka.prefix = process.env.KAFKA_PREFIX || 'local';
    const kafkaHost = process.env.KAFKA_HOST || 'localhost';
    const kafkaPort = process.env.KAFKA_PORT || '9093';
    kafka.brokerUris = [ `${kafkaHost}:${kafkaPort}` ];

    // Create service configuration
    this.config = {
      port: +process.env.PORT || 3000,
      prefix: process.env.PREFIX || '/api',
      auth,
      mongo,
      kafka,
    }
  }

  public getConfig(): Config {
    return this.config;
  }
}