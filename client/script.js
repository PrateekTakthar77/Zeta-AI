import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat-container');

let loadInterval;
// ... will be shown while the AI is loading the answer
function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = ''
    }
  }, 300)
}
// the answer came one by one not complete imediately

function typeText() {
  let index = 0;

  let interval = setInterval(() => {
    if (index < Text.length) {
      element.innerHTML += text.chartAT(index);
      index++
    } else {
      clearInterval(interval)
    }
  }, 20)
}
function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value,uniqueId){
  return(
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class = "chat">
        <div className = "profile">
          <img 
          src="${isAi ? bot :user}"
          alt="${isAi?'bot':'user'}"
          />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>
    `    
  )
}

const handleSubmit = async (e) =>{
  e.preventDefault();
  const data = new FormData(form);

  // user chat box
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();
  // bot chat box
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ",uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv)

  // fetch data from server -> bot's response

  const response = await fetch('http://localhost5000',{
    method:'POST',
    headers:{
      'content-type': 'application/json'
    },
    body:JSON.stringify({
      prompt:data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e)=>{
  if(e.keyCode === 13){
    handleSubmit(e);
  }
})
// npm run server/dev