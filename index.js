const StreamrClient = require('streamr-client')

const [
  STREAM_ID = null, 
  API_KEY = 'tester1-api-key' // don't get too excited, this is only the developer environment api key
] = process.argv.slice(2)

console.log(STREAM_ID, API_KEY)

const URL = 'ws://127.0.0.1:8890/api/v1/ws'
const REST_URL = 'http://localhost:8890/api/v1'

// Create the client and give the API key to use by default
const client = new StreamrClient({
  url: URL,
  restUrl: REST_URL,
  apiKey: API_KEY
})

console.log(`
Streamr client info:
 url: ${URL}
 restUrl: ${REST_URL}
 apiKey: ${API_KEY}

Stream info:
 id: ${STREAM_ID}
`) 

let tryAgainCount = 5
// Wrap event generation and producion into this method
const produceNewEvent = () => {
  // Here is the event we'll be sending
  const msg = {
    numero: Math.random() * 2 - 1,
  }

  // Produce the event to the Stream
  client.produceToStream(STREAM_ID, msg)
    .then(() => {
      console.log('Sent successfully: ' + JSON.stringify(msg))
    })
    .catch((err) => {
      console.error(err)
      if (tryAgainCount) {
        console.log(`Trying again ${tryAgainCount} time${tryAgainCount > 1 && 's' || ''}`)
        tryAgainCount--
      } else {
        console.log('Exiting')
        process.exit(1)
      }
    })
}

if (!STREAM_ID) {
  throw new Error('No STREAM_ID')
}

produceNewEvent()
setInterval(produceNewEvent, 2000)
