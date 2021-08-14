// S3からファイルを取得する
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"

const getImage = async () => {
    const client = new S3Client({region: "ap-northeast-1"});
    const data = await client.send(new GetObjectCommand({
        Bucket: process.env.BUCKET,
        Key: "2017080701000265900017011.jpeg",
      }))

    return data
}

const main = async () => {
    const data = await getImage();
    console.log(data);
}

main()
