let cards = []
for (let j = 0; j <= 3; j++) {
   let mark
switch (j) {
      case 0: mark = '♠'; break;
      case 1: mark = '♣'; break;
      case 2: mark = '♥'; break;
      case 3: mark = '♦'; break;
      }
      for (let i = 2; i <=10; i++) {
         createNewCard(`${i}`, mark, i)
      }
   createNewCard('J', mark, 10)
   createNewCard('Q', mark, 10)
   createNewCard('K', mark, 10)
   createNewCard('A', mark, 11)
}
const startCards = cards.slice()
let players=[]
let playerActive = 1

class Player{
   constructor(name) {
      this.name = name
      this.number = players.length
      this.cards = ''
      this.points = 0
      this.haveAce = false
      this.recount = false
   }
   getCard() {
      let newCard
      if (cards.length === 0) {
         alert('В колоде закончились карты')
      } else {
         let newCardNumber = Math.floor(Math.random()*cards.length)
         newCard = cards[newCardNumber]
         cards.splice(newCardNumber, 1)
      }
      if (newCard.face === "A") {
         this.haveAce = true
         newCard.points = (this.points > 21)? 1: 11
      }
      this.cards += `${newCard.face}${newCard.mark}; `
      this.points += newCard.points
      if ((this.points > 21) && (this.haveAce === true) && (this.recount === false) ) {
         this.points -= 10
         this.recount = true
      }
      document.querySelectorAll('.player__cards')[this.number].innerHTML += `<span class='${newCard.mark}'>${newCard.face}${newCard.mark}</span> `
      document.querySelectorAll('.player__points')[this.number].innerHTML = `Счёт: ${this.points}`
      if (this.points === 21) {
         setTimeout(finishGame(), 10000)
         setTimeout(() => {
            document.querySelector('.player__activePlayer').innerHTML = `У игрока "${players[this.number].name}" блэкджек`
         }, 100)
      }
      if ((this.points > 21) && (this.number) === 0) {
         setTimeout(() => {
            finishGame()
         }, 2000)
         setTimeout(() => {
            document.querySelector('.player__activePlayer').innerHTML = `У игрока "${players[this.number].name}" перебор`
         }, 100)
         document.querySelector('#getCard').setAttribute('disabled', true)
         document.querySelector('#setNew').setAttribute('disabled', true)
      }
      else if (this.points > 21) {
         setTimeout(() => {
            setNewActivePlayer()
         }, 2000)
         setTimeout(() => {
            document.querySelector('.player__activePlayer').innerHTML = `У игрока "${players[this.number].name}" перебор`
         }, 100)
         document.querySelector('#getCard').setAttribute('disabled', true)
         document.querySelector('#setNew').setAttribute('disabled', true)
      }

   }
}

function createNewCard(face, mark, points) {
   let newCard = {
      face: face,
      mark: mark,
      points: points,
   }
   cards.push(newCard)
}

function createNewPlayer() {
   if (document.querySelector('#player__name').value !== '') {
      let newPlayer = new Player
      players.push(newPlayer)
      newPlayer.name = document.querySelector('#player__name').value
      let playerList = document.createElement('div')
      playerList.className = 'player'
      playerList.innerHTML =
      `<p class="player__name">Игрок: ${newPlayer.name}</p>
      <p class="player__cards">Карты в руках: </p>
      <p class="player__points">Счёт: </p>`
      document.querySelector(".player__list").appendChild(playerList)

   document.querySelector('#player__name').value = ''
   }
}

createNewPlayer()

function startGame() {
   if ((players.length > 1) && (players.length < 5)){
      if (document.querySelector('.startSets').classList.contains('hide') !== true) {
         (document.querySelector('.startSets').classList.add('hide'))
      }
      playerActive = 1 
      document.querySelector('#getCard').removeAttribute('disabled')
      document.querySelector('#setNew').removeAttribute('disabled')
         document.querySelector('#getCard').classList.remove('hide')
         document.querySelector('#startGame').classList.add('hide')
         document.querySelector('#setNew').classList.remove('hide')
         document.querySelector('#restartGame').classList.remove('hide')
         document.querySelector('.player__activePlayer').innerHTML = `Ходит игрок: ${players[playerActive].name}`
         for (let i = 0; i < players.length; ++i) {
            players[i].getCard()
            players[i].getCard()
         }
   } 
}

function getActivePlayerCard() {
   players[playerActive].getCard()
}

function setNewActivePlayer() {
   playerActive++
   if (playerActive === players.length) {playerActive = 0}
   document.querySelector('.player__activePlayer').innerHTML = `Ходит игрок: ${players[playerActive].name}`
   if (playerActive !== 0) {
      document.querySelector('#getCard').removeAttribute('disabled')
      document.querySelector('#setNew').removeAttribute('disabled')
   } else {
      while (players[playerActive].points < 17) {
         getActivePlayerCard()
      }
      finishGame()
   }
}

function finishGame() {
   document.querySelector('#getCard').setAttribute('disabled', true)
   document.querySelector('#setNew').setAttribute('disabled', true)
   document.querySelector('.player__activePlayer').innerHTML = `<p>Итоги игры:</p>`
   if (players[0].points > 21) {
      document.querySelector('.player__activePlayer').innerHTML += `<p>"${players[0].name}" проиграл</p>`
   } else {
      for (let i = 1; i < players.length; i++) {
         if ((players[i].points < players[0].points) || (players[i].points > 21)) {
            document.querySelector('.player__activePlayer').innerHTML += `<p>Игрок "${players[i].name}" проиграл</p>`
         } else if ((players[i].points > players[0].points) || (players[i].points === 21)) {
            document.querySelector('.player__activePlayer').innerHTML += `<p>Игрок "${players[i].name}" выиграл</p>`
         } else {
            document.querySelector('.player__activePlayer').innerHTML += `<p>Игрок "${players[i].name}" остался при своём</p>`
         }
      }
   }
}

function restartGame() {
   cards = Array.from(startCards)
   for (let i = 0; i < players.length; i++) {
      players[i].cards = ''
      players[i].points = 0
      players[i].haveAce = false
      players[i].recount = false
      document.querySelectorAll('.player__name')[i].innerHTML = `Игрок: ${players[i].name}`
      document.querySelectorAll('.player__cards')[i].innerHTML = `Карты: `
      document.querySelectorAll('.player__points')[i].innerHTML = `Счёт: `
   }
   startGame()
} 