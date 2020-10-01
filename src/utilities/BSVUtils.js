import Mnemonic from 'bsv/mnemonic'
import Computer from 'bitcoin-computer'
export default class BSVUtils {
    static async generateElectionDetails(){
        let mn = Mnemonic.fromRandom();
        let publicKeys = [];
        let paths = ["m/44'/1'/0'/0", "m/44'/2'/0'/0", "m/44'/3'/0'/0"]

        let ownerComputer = new Computer({
            seed: mn.toString(), 
            chain: "BSV",
            path: "m/44'/0'/0'/0"
          })
        let ownerPk = await ownerComputer.db.wallet.getPublicKey().toString();
        paths.forEach(async (p)=>{
            let _computer = new Computer({
              seed: mn.toString(), 
              chain: "BSV",
              path: p
            })
            let pk = await _computer.db.wallet.getPublicKey()
            publicKeys.push(pk.toString())
          })
        
        return {'seed': mn.toString(),'owner': ownerPk,  'publicKeys': publicKeys};
    }
}