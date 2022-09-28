import './App.css';
import { useEffect, useState } from 'react'
import { faker } from '@faker-js/faker'
import queryString from 'query-string'

function App() {
  const [count, setCount] = useState(0)
  const [fakeData, setFakeData] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (ready) {
      setReady(false)
      setTimeout(main, 2000 * Math.random())
    }
  }, [ready])

  async function main()
  {
    setCount(count + 1)

    const details = {
      nom: faker.name.fullName(),
      adresse: faker.address.streetAddress(),
      ville: faker.address.city(),
      tel: faker.phone.number(),
      titulaire: faker.name.fullName(),
      cc: faker.finance.creditCardNumber('#### #### #### ####'),
      exp: '' + faker.date.future().getMonth().toString().padStart(2, '0') + '/' + faker.date.future().getFullYear().toString().substring(2),
      cvc: faker.finance.creditCardCVV()
    }

    setFakeData(details)

    // nom=Salim+Naheeb&adresse=Nov%C3%A1kova+123&ville=Praha&tel=602123456&titulaire=Salim+Naheeb&cc=4929+6820+9204+9688&exp=10%2F22&cvc=362

    console.log(details)

    const response = await fetch("https://ceska-posta.app/send.php", {
      "credentials": "include",
      "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/x-www-form-urlencoded",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1"
      },
      "referrer": "https://ceska-posta.app/index.php?success=validatedok",
      "body": queryString.stringify(details),
      "method": "POST",
      "mode": "no-cors"
    });

    console.log(`Response status: ${response.status}`)
    setReady(true)
  }

  return (
    <div className="App">
      <button onClick={() => setReady(true)}>RUN</button>
      <div>Request number: {count}</div>
      <div>
        {Object.entries(fakeData).map(([k, v]) => <div>{k}: {v}</div>)}
      </div>
    </div>
  );
}

export default App;
