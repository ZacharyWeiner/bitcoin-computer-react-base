class Votable {
    constructor(voters_array, description, recipient_address, value){
        this._owners = voters_array
        this.description = description
        this.recipient_address = recipient_address
        this.value = value
        this.votes = {}
        this.reciepts = {}
        this.voting_complete = false
        this.vote_result = null
        this.spend_complete = false
        this.votable_money_ids = []
    }
    addVoter(pubKey){

    }
    vote(pubKey, vote){
        this.votes[pubKey] = vote
        if (this.votes.length === this._owners.length) {
            this.voting_complete = true
        }
    }

    fund(pubKey, satoshis){
        //This should happen after 
        //return a new object owned by recipient new VoteableMoney([this.recipient_address])
        //add id of Votable money to Ids vm._id 
        this._amount = this._amount + satoshis
        if (this.reciepts[pubKey] > 0){
            this.reciepts[pubKey] = this.reciepts[pubKey] + satoshis
        }else{
            this.reciepts[pubKey] = satoshis
        }
    }

    spend(){
        if(this.spend_complete === false && this.voting_complete === true && this.vote_result === true){
            this._owners = [this.recipient_address]
            this.spend_complete = true
        }
    }

    redeem(){
        if(this.spend_complete === true && this.voting_complete === true && this.vote_result === true && this._owners[0]=== this.recipient_address){
            this._amount = 0
        }
    }
}