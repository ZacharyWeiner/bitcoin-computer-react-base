class TicTacToe{
    constructor(player1PK, player2PK){
        this._owners= [player1PK, player2PK]
        this.player1 = player1PK
        this.player2 = player2PK
        this.moves = ["0","0","0","0","0","0","0","0","0"]
        this.mover = 0
        this.winner = null
    }

    getSymbol(){
        if(this.mover === 1){return "X"}
        return "O"
    }

    reassignMover(moverPk){
        if(this.mover === 0){this.mover = 1}
        else{this.mover = 0}
    }

    move(playerPK, position){
        if(this.winner !== null){throw new Error('This game is over')}
        if((this.mover === 0 && playerPK === this.player1) || (this.mover === 1 && playerPK === this.player2)){
            if (this.moves[position] === "0"){
                let temp = this.moves.slice()
                temp[position] = this.getSymbol()
                this.moves = temp
            }else{throw new Error('That space is already taken.')}
        }else{throw new Error("It is not your turn. ")}
        this.checkForWinner(playerPK)
        this.reassignMover(playerPK)
    }

    getAllIndexes(arr, val) {
        var indexes = [], i = -1;
        while ((i = arr.indexOf(val, i+1)) !== -1){
            indexes.push(i);
        }
        return indexes;
    }

    checkForWinner(playerPK){
        let symbol = this.getSymbol()
        let indexes = this.getAllIndexes(this.moves, symbol)
 
        //HorizontalWinner 
        if(indexes.includes(0) && indexes.includes(1) && indexes.includes(2) && indexes[0] !== "0"){this.winner = playerPK; return}
        if(indexes.includes(3) && indexes.includes(4) && indexes.includes(5) && indexes[0] !== "0"){this.winner = playerPK; return }
        if(indexes.includes(6) && indexes.includes(7) && indexes.includes(8) && indexes[0] !== "0"){this.winner = playerPK; return }

        //Vertical Winner
        if(indexes.includes(0) && indexes.includes(3) && indexes.includes(6) && indexes[0] !== "0"){this.winner = playerPK; return}
        if(indexes.includes(1) && indexes.includes(4) && indexes.includes(7) && indexes[0] !== "0"){this.winner = playerPK; return}
        if(indexes.includes(2) && indexes.includes(5) && indexes.includes(8) && indexes[0] !== "0"){this.winner = playerPK; return}

        //Diagonal Winner 
        if(indexes.includes(0) && indexes.includes(4) && indexes.includes(8) && indexes[0] !== "0"){this.winner = playerPK; return}
        if(indexes.includes(2) && indexes.includes(4) && indexes.includes(6) && indexes[0] !== "0"){this.winner = playerPK; return}
    }
}