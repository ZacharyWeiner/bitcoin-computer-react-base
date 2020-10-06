class Vote {
    constructor(to, distributor, name, numberOfVotes, can1name, can1PK, can2name, can2PK, can3name, can3PK) {
      this.votes = numberOfVotes
      this._owners = [to]
      this.name = name
      this.can1name = can1name
      this.can2name = can2name
      this.can3name = can3name
      this.cand1PK = can1PK
      this.cand2PK = can2PK 
      this.cand3PK = can3PK
      this.distributor = distributor
    }
  
    
    voteA(publicKey) {
      this._owners = [this.cand1PK]
    }
  
    voteB(publicKey) {
      this._owners = [this.cand2PK]
    }
  
    voteC(publicKey) {
      this._owners = [this.cand3PK]
    }
  }   