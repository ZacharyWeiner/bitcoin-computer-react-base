class BasicVoteable{
    constructor(publicKey, name, description){
        this._owners = [publicKey]
        this.name = name
        this.voters = [publicKey]
        this.description = description 
        this.votes = []
    }
    addVoter(pubKey){
        this._owners.push(pubKey)
        this.voters.push(pubKey)
    }
    vote(publicKey, vote){
        this.votes.push(publicKey + ":" + vote)
    }
}
