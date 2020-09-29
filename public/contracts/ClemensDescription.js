class RPS {
    constructor(player1, player2) {
      this._owners = [player2]
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
          hash = hash & hash; // Convert to 32bit integer
      }
      return hash;
    }
  
    move0(hash) {
      this.hash = hash
      this._owners = [this.player2]
    }
  
    move1(move) {
      this.move1 =  move
      this._owners =  [this.player1]
    }
  
    move2(move, salt) {
      if(this.hash(move +  salt) !== this.hash)
        this.winner = this.player1
  
      else if(this.move1 === 'rock' && this.move2 === 'paper')
        this.winner = player1
  
      else {
          // continue the conditions 
      }
  
     this._owner = [this.winner]
    }
  }
  
  
  
  
  class Vote {
    constructor(voter, organizer) {
      this._owners = [owners]
      this.organizer = organizer
    }
  
    vote(bool) {
      this.myVote = bool
      this._owner = [this.organizer]
    }
  }
  
  class MoneyToken {
    //TODO: Implement Fungible Token 
  }
  
  class Election {
    constructor(recipient, 
                voters,//: Array<PubKey>, 
                organizer//: PubKey
    ) 
    {
      this._owner = [organizer]
      this.recipient  = recipient
      this.voters = voters
      this.votes = []
  
      for(const voter in voters) {
        this.votes.push(new Vote(voter, organizer))
      }
    }
  
    countVotes(votes//: Array<Vote>
        ) {
      const voteIds = votes.map(vote => vote._id)
      if(voteIds !== this.voters) throw new Error('Illegal count')
      const voteCount = "number of <true> votes in votes"
  
      if(voteCount > this.voters.length / 2) {
    for(const moneyToken of this.moneyTokens)
          moneyToken._owners = [this.recipient]
      }
    }
  
    fund(moneyToken//: MoneyToken
        ) {
      moneyToken._owner = this.organizer
      this.moneyTokens.push(moneyTokens)
    }
  }
  
  class RPS {
    constructor(player1,//: pubKey, 
                player2 //: pubkey
                ) 
    {
    this._owners = [player2]
       this.winner = null
    }
  
    hash(value) {
      //TODO: Implement naive hash 
    }
  
    move0(hash) {
      this.hash = hash
      This._owners = [this.player2]
    }
  
    move1(move) {
      this.move1 =  move
      This._owners = [this.player1]
    }
  
    move2(move, salt) {
      if(this.hash(move +  salt) !== this.hash)
        this.winner = this.player1
  
      else if(this.move1 === 'rock' && this.move2 === 'paper')
        this.winner = player1
  
      else ...
  
     this._owner = [this.winner]
    }
  }
  
  
  
  
  
  class Vote {
    constructor(voter, organizer) {
      this._owners = [owners]
      this.organizer = organizer
    }
  
    vote(bool//: boolean
    ) {
      this.myVote = bool
      this._owner = [this.organizer]
    }
  }
  
  class MoneyToken {
     //... fungible token
  }
  
  class Election {
    constructor(recipient, 
                organizer, //: PubKey, 
                votes//: Array<Vote>
    ) {
      this._owner = [organizer]
      this.recipient  = recipient
      this.votes = votes
      this.moneyTokens = []
    }
  
    countVotes(votes//: Array<Vote>
    ) {
      const voteIds = this.votes.map(vote => vote._id)
      if(voteIds !== this.voters) throw new Error('Illegal count')
  
      const voteCount = "number of <true> votes in votes"
  
      if(voteCount > this.voters.length / 2) {
    for(const moneyToken of this.moneyTokens)
          moneyToken._owners = [this.recipient]
      }
    }
  
    fund(moneyToken//: MoneyToken
    
    ) {
      moneyToken._owner = this.organizer
      this.moneyTokens.push(moneyTokens)
    }
  }














  if (this.votes[pubKey] ==  null)
  this.votes[pubKey] = vote
  if(this.votes.length === this.voters.length){
      let sum, votecount = 0
      Object.keys(this.votes).forEach(function (key) { 
          sum += this.votes[key]
      })
      if((sum/votecount) > 0.5){
          this.result = "approved"
      } else {
          this.result = "denied"
      }
      
  }
}