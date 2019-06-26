import fs from 'fs'
import path from 'path'
import readline from 'readline'
import { google } from 'googleapis'

interface Options {
  dir: string
  outDir: string
  scopes: string[]
}

interface Credentials {
  installed: {
    client_id: string
    client_secret: string
    redirect_uris: string[]
  }
}

export default (options: Options) => {
  const content = fs.readFileSync(path.join(options.dir, 'credentials.json'), 'utf8')
  const credentials: Credentials = JSON.parse(content)
  const { client_id, client_secret, redirect_uris } = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: options.scopes,
  })
  console.log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  rl.question('Enter the code from that page here: ', code => {
    rl.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err)
      const dest = path.join(options.outDir, 'token.json')
      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest)
      }
      fs.writeFileSync(dest, JSON.stringify(token), 'utf8')
      console.log('Token stored to', dest)
    })
  })
}
