
import 'bootstrap/dist/css/bootstrap.min.css';


function generateRandomLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
    return alphabet[Math.floor(Math.random() * alphabet.length)]
  }

  function firstCleanup(words, letter){
    let cleaned=[];
        words.forEach(w =>{
                let lcword= w.toLowerCase().toString();
                let lcletter= letter.toLowerCase();
            if(lcword.startsWith(lcletter) && !cleaned.includes(lcword)){ //
                cleaned.push(lcword);
            }
        });

        return cleaned;

  }

  export { generateRandomLetter, firstCleanup}