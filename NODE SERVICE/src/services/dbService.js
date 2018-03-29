import mongodb from 'mongodb';
import BaseService from "./baseService.js";
import bpConfig from "./../helpers/bpConfig";
import bpServerLogger from './../helpers/bpServerLogger';


export default class dbService extends BaseService {
    constructor() {
        super("service", undefined)
        this.opendb()
        .then(() => {
          // bpServerLogger.log('db connection is open');
        })
        .catch(() => {
          console.log('could not open db connection');
      });
    }

  opendb() {
    return new Promise((resolve, reject) => {
      const MongoClient = mongodb.MongoClient;

      MongoClient.connect(bpConfig.getSetting('errorLogsDb').url)
        .then((client) => {
          this.db = client.db(bpConfig.getSetting('errorLogsDb').dbName);
          resolve();
        })
        .catch((err) => {
          console.log('Error in db Connection');
          throw err;
        });
    });
  }

  finddoc(query) {
    return new Promise((resolve, reject) => {
      const col = this.db.collection(bpConfig.getSetting('errorLogsDb').collName);
      console.log(query);
      const dbsort = {
        timeStamp: -1
      }
      
      col.find(query.condition).skip(query.skips).limit(query.limit).sort(dbsort).toArray()
        .then(resolve)
        .catch((err) => {
          reject(err);  
        })
    });
  }

}