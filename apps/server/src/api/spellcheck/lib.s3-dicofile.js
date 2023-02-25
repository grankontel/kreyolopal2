const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')
import config from '../../config'

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = []
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

const getObjectContent = (client, command) =>
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
async function readDicoFiles(kreyol) {
  const s3Options = {
    credentials: {
      accessKeyId: config.aws.keyId,
      secretAccessKey: config.aws.keySecret,
    },
    region: config.aws.region,
  }
  const client = new S3Client(s3Options)
  const affixParams = {
    Bucket: config.aws.bucketName,
    Key: 'dico/cpf_GP.aff',
  }
  const dicParams = {
    Bucket: config.aws.bucketName,
    Key: 'dico/cpf_GP.dic',
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
  const dicofiles = { affix: values[0], dictionary: values[1] }

  return dicofiles
}

export default { readDicoFiles }
