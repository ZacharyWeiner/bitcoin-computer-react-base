class RPSGame {
    constructor(){
        this.game_queue = {}
        this.games_in_play = {}
        this.game_results = {}
    }

    requestGame(publicKey, uuid){
        let existingGame = this.game_queue[uuid]
        if(existingGame){return}
        this.game_queue[uuid] = {uuid: {"player_1": publicKey}}
    }

    joinGame(publicKey, game_uuid){
        let existingGame = this.game_queue[game_uuid]
        existingGame['player_2'] = publicKey
    }
}