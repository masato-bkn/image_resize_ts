import { S3Client, GetObjectCommand, GetObjectCommandOutput } from "@aws-sdk/client-s3"

const fs = require("fs");

type GetObjectInput = { Bucket: string, Key: string };
type GetImage = (args: GetObjectInput) => Promise<GetObjectCommandOutput>
const getImage: GetImage = async (args) => {
    const client = new S3Client({region: "ap-northeast-1"});
    return await client.send(new GetObjectCommand(args))
}

type WriteImage = (buffer: Buffer) => Promise<void>
const writeImage: WriteImage = async (buffer) => {
    const writer = fs.createWriteStream("2017080701000265900017011.jpeg")
    writer.on("finish", () => {
        console.log("success");
      })
    writer.write(buffer);
    writer.end();
}

type StreamToBuffer = (stream) => Promise<Buffer>
const streamToBuffer: StreamToBuffer = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });

const main = async (): Promise<void> => {
    // s3から画像を取得する
    const data = await getImage({
        Bucket: process.env.BUCKET,
        Key: "2017080701000265900017011.jpeg"
    });

    // 画像を生成する
    const buffer = await streamToBuffer(data.Body)
    writeImage(buffer)
}

main()
