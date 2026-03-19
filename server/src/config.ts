import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { SSMClient, GetParametersByPathCommand } from "@aws-sdk/client-ssm";

const region = "us-east-1";

const secretsClient = new SecretsManagerClient({ region });
const ssmClient = new SSMClient({ region });

async function getSecret(secretName: string): Promise<Record<string, string>> {
  const response = await secretsClient.send(new GetSecretValueCommand({ SecretId: secretName }));
  return JSON.parse(response.SecretString || "{}");
}

async function getParameters(path: string): Promise<Record<string, string>> {
  const params: Record<string, string> = {};
  let nextToken: string | undefined;

  do {
    const response = await ssmClient.send(
      new GetParametersByPathCommand({ 
        Path: path, 
        Recursive: true,
        NextToken: nextToken
      })
    );

    for (const param of response.Parameters || []) {
      const key = param.Name?.split("/").pop() || "";
      params[key] = param.Value || "";
    }
    nextToken = response.NextToken;
  } while (nextToken);

  return params;
}

export async function loadConfig(): Promise<void> {
  const [rdsSecret, docdbSecret, parameters] = await Promise.all([getSecret("hookcatcher/production/rds"), getSecret("hookcatcher/production/docdb"), getParameters("/hookcatcher/production/")]);

  process.env.DB_HOST = parameters.DB_HOST;
  process.env.DB_PORT = parameters.DB_PORT;
  process.env.DB_NAME = parameters.DB_NAME;
  process.env.DB_USER = parameters.DB_USER;
  process.env.DB_PASSWORD = rdsSecret.password;
  process.env.DB_SSL = parameters.DB_SSL;
  process.env.MONGO_HOST = parameters.MONGO_HOST;
  process.env.MONGO_PORT = parameters.MONGO_PORT;
  process.env.MONGO_DB_NAME = parameters.MONGO_DB_NAME;
  process.env.MONGO_COLLECTION_NAME = parameters.MONGO_COLLECTION_NAME;
  process.env.MONGO_RETRY_WRITES = parameters.MONGO_RETRY_WRITES;
  process.env.PORT = parameters.PORT;

  //dynamic MONGO_URI
  const mongoUser = encodeURIComponent(docdbSecret.username);
  const mongoPassword = encodeURIComponent(docdbSecret.password);
  process.env.MONGO_URI = `mongodb://${mongoUser}:${mongoPassword}@${parameters.MONGO_HOST}:${parameters.MONGO_PORT}/?tls=true&tlsCAFile=/home/ssm-user/global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`;
}
