import * as Constants from './../constants/LocalStorageConstants.js'
import Computer  from 'bitcoin-computer'
export default class BitcoinComputerUtils {
    static async intiComputerAtPath(path){
        let err = {};
        let options = {}
        if(window.localStorage.getItem(Constants.SEED === null)){
            err[1] = "There is no seed stored in the local window"
        }else{
            options['seed'] = window.localStorage.getItem(Constants.SEED)
        }
        if(path === null){
            err[2] = "You must specify a path"
        }else{
            options['path'] = path
        }
        if(err !== {}){
            return err;
        }

        if(window.localStorage.getItem(Constants.NETWORK) !== null){
            options['network'] = window.localStorage.getItem(Constants.NETWORK);
        } else {
            options['network'] = 'testnet'
        }
        if(window.localStorage.getItem(Constants.CHAIN) !== null){
            options['chain'] = window.localStorage.getItem(Constants.NETWORK);
        }else{
            options['chain'] = "BSV";
        }

        return new Computer(options)
    }
}