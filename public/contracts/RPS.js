class RPS{
    constructor(pubKey){
        this.complete = false
        this.player1 = pubKey
        this.player1Move = null
        this.player2 = null
        this.player2Move = null
        this._owners = [pubKey]
        this.saltAddress = null
        this.saltPath = null
        this.encryptedMove = null
        this.winner = null 
    }

    hash(value) {
        var hash = 0;
        if (value.length == 0) {
            return hash;
        }
        for (var i = 0; i < value.length; i++) {
            var char = value.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; 
        }
        return hash;
      }

    addPlayer(pubKey){
        if(this.complete === false){
            this.player2 = pubKey
            if(!!this.encryptedMove){
                this._owners = [pubKey]
            }
        }
    }

    move0(encryptedMove, saltAddress, saltPath){
        if(this.complete === false && this.encryptedMove === null){
            this.encryptedMove = encryptedMove
            this.saltAddress = saltAddress
            this.saltPath = saltPath
        }
    }

    move1(move){
        if(this.complete === false && this.player2Move === null){
            this.player2Move = move
            this._owners = [this.player1]
        }
    }

    finalize(move, salt){
        let result = ''
        if(this.complete === false && this.player1Move === null){
            if(this.hash(move + salt) !== this.encryptedMove){
                this.winner = this.player2 
                result = 'Player 2 Wins - Player 1 Tried to Cheat'
            }else{
                this.calculateWinner(this.player1Move, this.player2Move)
                result = "The winner is: " + this.winner 
            }
        }
        return result
    }

    calculateWinner(p1move, p2move){
        if(p1move === p2move){
            this.winner = 'A Draw'
        }else{
            if(p1move === "rock"){
                if(p2move === "scisors"){
                    this.winner = this.player1
                    this.winner = this.player1
                }else{
                    this.winner = this.player2
                }
            }

            if(p1move === "paper"){
                if(p2move === "rock"){
                    this.winner = this.player1
                }else{
                    this.winner = this.player2
                }
            }

            if(p1move === 'scisors'){
                if(p2move === 'paper'){
                    this.winner = this.player1 
                }else{
                    this.winner = this.player2 
                }
            }
        }
        this.complete = true;
    }
}