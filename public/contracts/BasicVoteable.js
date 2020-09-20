class BasicVoteable {
    constructor(owners, description){
        this.votes = {}
        this._owners = owners
        this.description = description 
        this.result = "undecided"
    }
    addVoter(pubKey){
        this._owners.push(pubKey)
    }
    vote(pubKey, vote){
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
    }
