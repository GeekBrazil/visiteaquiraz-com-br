import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export const R2_PREFIX = "visiteaquiraz";
export const FOTOS_PREFIX = `${R2_PREFIX}/fotos/`;
export const FOTOS_INDEX_KEY = `${R2_PREFIX}/data/fotos.json`;
export const ARTICLES_INDEX_KEY = `${R2_PREFIX}/data/articles.json`;

let cachedClient: S3Client | null = null;

export function getMediaDomain(): string {
  return (process.env.NEXT_PUBLIC_MEDIA_URL || "https://midia.allancandido.com").replace(/\/+$/, "");
}

export function getR2Bucket(): string {
  return process.env.R2_BUCKET || "allan-midia";
}

export function hasR2Config(): boolean {
  return Boolean(
    process.env.R2_ENDPOINT &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY
  );
}

export function getR2Client(): S3Client {
  if (cachedClient) return cachedClient;
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("Configuração do Cloudflare R2 ausente (R2_ENDPOINT, R2_ACCESS_KEY_ID ou R2_SECRET_ACCESS_KEY).");
  }

  cachedClient = new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
  return cachedClient;
}

export async function readJsonFromR2<T>(key: string, fallback: T): Promise<T> {
  if (!hasR2Config()) return fallback;
  try {
    const res = await getR2Client().send(
      new GetObjectCommand({
        Bucket: getR2Bucket(),
        Key: key,
      })
    );
    const body = await res.Body?.transformToString("utf-8");
    if (!body) return fallback;
    return JSON.parse(body) as T;
  } catch (err: unknown) {
    const code = (err as { name?: string; $metadata?: { httpStatusCode?: number } })?.name;
    const status = (err as { $metadata?: { httpStatusCode?: number } })?.$metadata?.httpStatusCode;
    if (code === "NoSuchKey" || status === 404) return fallback;
    console.error(`[R2 readJson error] key=${key}`, err);
    return fallback;
  }
}

export async function writeJsonToR2(key: string, data: unknown): Promise<void> {
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: getR2Bucket(),
      Key: key,
      Body: JSON.stringify(data, null, 2),
      ContentType: "application/json; charset=utf-8",
      CacheControl: "no-store, max-age=0",
    })
  );
}

export async function uploadFileToR2(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: getR2Bucket(),
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
  return `${getMediaDomain()}/${key}`;
}

export async function deleteObjectFromR2(key: string): Promise<void> {
  if (!hasR2Config() || !key) return;
  await getR2Client().send(
    new DeleteObjectCommand({
      Bucket: getR2Bucket(),
      Key: key,
    })
  );
}

export async function listR2Prefix(prefix: string) {
  if (!hasR2Config()) return [];
  const res = await getR2Client().send(
    new ListObjectsV2Command({
      Bucket: getR2Bucket(),
      Prefix: prefix,
      MaxKeys: 500,
    })
  );
  return res.Contents || [];
}
