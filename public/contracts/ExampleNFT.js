class ExampleNFT{
    constructor(publicKey, name, description, url){
        this._owners = [publicKey]
        this.name = name
        this.description = description
        this.url = url
    }

    sendTo(toAddress) {
        this._owners = [toAddress]
    }
}