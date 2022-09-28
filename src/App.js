import './App.css'
import { useEffect, useState } from 'react'
import { faker } from '@faker-js/faker'
import queryString from 'query-string'

function App () {
  const [count, setCount] = useState(0)
  const [fakeData, setFakeData] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (ready) {
      setReady(false)
      setTimeout(main, 2000 * Math.random())
    }
  }, [ready])

  async function main () {
    setCount(count + 1)

    let name = faker.name.fullName()
    const details = {
      nom: name,
      adresse: faker.address.streetAddress(),
      ville: faker.address.city(),
      tel: faker.phone.number(),
      titulaire: name,
      cc: faker.finance.creditCardNumber('#### #### #### ####'),
      exp: '' + faker.date.future().getMonth().toString().padStart(2, '0') + '/' + faker.date.future().getFullYear().toString().substring(2),
      cvc: faker.finance.creditCardCVV()
    }

    setFakeData(details)

    // nom=Salim+Naheeb&adresse=Nov%C3%A1kova+123&ville=Praha&tel=602123456&titulaire=Salim+Naheeb&cc=4929+6820+9204+9688&exp=10%2F22&cvc=362

    await fetch('https://ceska-posta.app/send.php', {
      'credentials': 'include',
      'headers': {
        'User-Agent': faker.internet.userAgent(),
        'Content-Type': 'application/x-www-form-urlencoded',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1'
      },
      'referrer': 'https://ceska-posta.app/index.php?success=validatedok',
      'body': queryString.stringify(details),
      'method': 'POST',
      'mode': 'no-cors'
    })

    setReady(true)
  }

  return (
    <div className="App">
      <p>
        Po stisknutí tlačítka start začne prohlížeč posílat nesmyslná data na podvodnou stránku ceska-posta.app.
      </p>
      <p>
        Pro ukončení zavřete stránku.
      </p>
      {!fakeData && <button onClick={() => setReady(true)}>Start</button>}
      {fakeData &&
        <>
          <div>Request number: <strong>{count}</strong></div>
          <div>
            {Object.entries(fakeData).map(([k, v]) => <div>{k}: <em>{v}</em></div>)}
          </div>
        </>
      }
      <footer><a href="https://github.com/vkolencik/revenge">GitHub repo</a></footer>
    </div>
  )
}

export default App
