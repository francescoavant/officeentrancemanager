const contactForm = document.querySelector('.contact-form');


let name= document.getElementById('name');
let email= document.getElementById('email');
let subject= document.getElementById('subject');
let message= document.getElementById('message');

contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    let formData= {
        name: name.value,
        email: email.value,
        subject: subject.value,
        message: message.value
    }
    
    let xhr= new XMLHttpRequest();
    xhr.open('POST', '/');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.onload = function(){
        console.log(xhr.responseText);
        if(xhr.responseText == 'successo'){                     //dopo invio della mail i campi del form vengono ripuliti
            alert ('Email inviata');                            //in caso di invio andato a buon fine, viene mostrato un alert all'utente
            name.value='';
            email.value='';
            subject.value='';
            message.value='';
        }else{
            alert('qualcosa non ha funzionato');
        }
    }
    xhr.send(JSON.stringify(formData));
});