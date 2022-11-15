import { authenticate } from '@google-cloud/local-auth'
import fs from 'fs'
import path from 'path'

interface Options {
  dir: string
  outDir: string
  scopes: string[]
}

interface Credential {
  client_id: string
  client_secret: string
  redirect_uris: string[]
}

interface Credentials {
  installed?: Credential
  web: Credential
}

export default async (options: Options) => {
  const credentialsPath = path.join(options.dir, 'credentials.json')
  const content = fs.readFileSync(credentialsPath, 'utf8')
  const credentials: Credentials = JSON.parse(content)
  const credential = credentials.installed || credentials.web
  const client = await authenticate({
    scopes: options.scopes,
    keyfilePath: credentialsPath,
  })
  const token = {
    type: 'authorized_user',
    client_id: credential.client_id,
    client_secret: credential.client_secret,
    refresh_token: client.credentials.refresh_token,
  }
  const dest = path.join(options.outDir, 'token.json')
  if (fs.existsSync(dest)) {
    fs.unlinkSync(dest)
  }
  fs.writeFileSync(dest, JSON.stringify(token), 'utf8')
}
