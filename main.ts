import { S3Client, GetObjectCommand, GetObjectCommandOutput } from "@aws-sdk/client-s3"

const fs = require("fs");

const getImage = async ({bucket, path}: {
    bucket: string,
    path: string,
}): Promise<GetObjectCommandOutput> => {
    const client = new S3Client({region: "ap-northeast-1"});
    const data = await client.send(new GetObjectCommand({
        Bucket: bucket,
        Key: path,
      }))

    return data
}

const writeImage = async (buffer: Buffer): Promise<void> => {
    const writer = fs.createWriteStream("2017080701000265900017011.jpeg")
    writer.on("finish", () => {
        console.log("success");
      })
    writer.write(buffer);
    writer.end();
}

const streamToBuffer = (stream): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });

const main = async (): Promise<void> => {
    // s3から画像を取得する
    const data = await getImage({
        bucket: process.env.BUCKET,
        path: "2017080701000265900017011.jpeg"
    });

    // 画像を生成する
    const buffer = await streamToBuffer(data.Body)
    writeImage(buffer)
}

main()
