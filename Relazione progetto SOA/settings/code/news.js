const searchFrom= document.querySelector('.search');
const input = document.querySelector('.input');
const newsList = document.querySelector('.news-list');

searchFrom.addEventListener('submit', retrieve)

function retrieve(e){
    if(input.value==''){                            //effettuo un controllo sull'input, nel caso di invio senza valore viene mostrato in output un alert
        alert ('Attenzione: input mancante');           
        return
    }

    newsList.innerHTML=''; //Consente di effettuare un'altra richiesta dopo aver eliminato l'input precedentemente inserito
    e.preventDefault()

  const apiKey='991201da19e8452f8118fe37ac2f26e3';
  let topic= input.value;
  let url=`https://newsapi.org/v2/everything?q=${topic}&apiKey=${apiKey}&language=it`       
/*Utilizzo l'url dato dal fornitore della API (NewsApi).
Nell'url viene inserito l'input relativo al topic richiesto dall'utente e l'apiKey memorizzata come costante */
  fetch(url).then((res)=>{
      return res.json()
  }).then((data)=>{
      console.log(data)
    data.articles.forEach(article =>{
       let li= document.createElement('li');            //il tag li serve a definire gli indici di un elenco
        li.className="list-group-item list-group-item-dark";
       let a = document.createElement('a');             //il tag a identifica i collegamenti con le pagine delle notizie
       a.className="link-dark";
       a.setAttribute('href', article.url);
       a.setAttribute('target','_blank');           //nuovo tab al click del link della notizia
       a.textContent = article.title;
       li.appendChild(a);
      newsList.appendChild(li)
    })

  }).catch((error)=>{
      console.log(error)
  })
}
