import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import config from '#config'
import { DicoFile, KreyolLang } from './spellcheck.types'

const streamToString = (stream): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = []
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })

/* const streamToBuffer = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  }); */

const getObjectContent = (client: S3Client, command: GetObjectCommand) =>
  new Promise((resolve, reject) => {
    client
      .send(command)
      .then(
        (result) => {
          const { Body } = result
          streamToString(Body).then((data) => resolve(data))
        },
        (reason) => {
          // console.log('small error');
          reject(reason)
        }
      )
      .catch((error) => {
        // console.log('big error');
        reject(error)
      })
  })

/**
 * Read dictionary files for a kreyol
 * @param {string} kreyol Wich kreyol
 */
// eslint-disable-next-line no-unused-vars
async function readDicoFiles(kreyol: KreyolLang): Promise<DicoFile> {
  const s3Options = {
    credentials: {
      accessKeyId: config.aws.keyId,
      secretAccessKey: config.aws.keySecret,
    },
    region: config.aws.region,
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const client = new S3Client(s3Options)
  const affixParams = {
    Bucket: config.aws.bucketName,
    Key: `dico/cpf_${kreyol}.aff`,
  }
  const dicParams = {
    Bucket: config.aws.bucketName,
    Key: `dico/cpf_${kreyol}.dic`,
  }

  const getAffix = new GetObjectCommand(affixParams)
  const getDic = new GetObjectCommand(dicParams)

  const affixP = getObjectContent(client, getAffix)
  const dicP = getObjectContent(client, getDic)

  /*   const affix = Buffer.from(await affixP)
  const dictionary = Buffer.from(await dicP)
  return { affix: affix, dictionary: dictionary }
 */
  const values = await Promise.all([affixP, dicP])
  const dicofiles = {
    affix: values[0] as string,
    dictionary: values[1] as string,
  }

  return dicofiles
}

export default { readDicoFiles }
