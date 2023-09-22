let view = {
    displayMessage: function (msg) {
        let messageArea = document.querySelector('#messageArea');
        messageArea.innerHTML = msg;
    },

    displayHit: function (location) {
        let cell = document.getElementById(location);
        cell.classList.add('hit');
    },
    displayMiss: function (location) {
        let cell = document.getElementById(location);
        cell.classList.add('miss');
    }
}


let model = {
    boardSize: 7,
    numShips: 3,
    shipLenght: 3,
    shipsSunk: 0,

    ships: [
        ship1 = {
            locations: [0,0,0],
            hits: ['', '', '']
        },
        ship2 = {
            locations: [0,0,0],
            hits: ['', '', '']
        },
        ship3 = {
            locations: [0,0,0],
            hits: ['', '', '']
        },
    ],
    fire: function (guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            //location = ship.location;
            let index = ship.location.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('HIT!!!');
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!")
                    this.shipsSunk++;
                }
                view.displayMiss(guess);
                view.displayMessage("You missed!")
                return true;
            }
        }
        return false;
    },
    isSunk: function (ship) {
        for (let i = 0; i < this.shipLenght; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }

        }
        return true;
    },
    generateShipLocation: function(){
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do{
                locations = this.generateShip();
            }while(this.collision(locations))
            this.ships[i].locations = locations;
        }
        console.log("Ship Array ", this.ships);
    },
    generateShip:function(){
        let direction = Math.floor(Math.random() * 2);
        let row,col;
        if(direction === 1){
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLenght + 1));
        }
        else{
            row = Math.floor(Math.random() * (this.boardSize - this.shipLenght + 1));
            col = Math.floor(Math.random() * this.boardSize );
        }
        var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
    },
    collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}

}

let controller = {
    guess:0,

    processGuess:function(guess){
        let location = parseGuess(guess);
        if(location){
            this.guess++;
            let hit = model.fire(location);
            if(hit && model.shipsSunk == model.numShips){
                view.displayMessage('Ви потопили всі кораблі за ' + this.guess + ' вистрілів')
            }
        }
    }
}

function parseGuess(guess) {
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    if (guess == null || guess.lenght !== 2) {
        alert("Ви ввели невірно координати")
    }
    else {
        firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);
        if (isNaN(row) || isNaN(column)) {
            alert("Ви ввели невірно координати")
        }
        else if(row < 0 && row < model.boardSize || column < 0 || column >= model.boardSize){
            alert("Ви ввели невірно координати")
        }
        else{
            return row + column;
        }
    }
    return null;
}

function init(){
    let fireButton = document.getElementById('fireButton')
    fireButton.onclick = handleFireButton;

    let guessInput = document.getElementById('guessInput');
    guessInput.onpresskey = handleKeyPress;
}
function handleFireButton(){
    let guessInput = document.getElementById('guessInput');
    let guess = guessInput.value;
    controller.processGuess(guess);

    guessInput.value = "";
}
function handleKeyPress(e){
    let fireButton = document.getElementById('fireButton')
    if(e.keyCode === 13){
        fireButton.click();
        return false;
    }
}
// model.fire("23");
// model.fire("32");
// model.fire("25");
// model.fire("65");
// model.fire("43");

window.onload = init;