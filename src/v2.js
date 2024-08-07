 
import "dotenv/config";
import csv from "csvtojson";
import { fileURLToPath } from "url";
import { dirname } from "path"; 
import { generateCkbAddress,getArgsByPubkey,addressArgs} from "./ckbAddressGenerator.js"   
import { Parser } from 'json2csv';
import fs from 'fs';
import mysql from 'mysql';

export function saveJsonToCsv(jsonArray, csvFilePath) {
  try {
    const parser = new Parser();
    const csv = parser.parse(jsonArray);

    fs.writeFileSync(csvFilePath, csv);
    console.log(`CSV file saved to ${csvFilePath}`);
  } catch (err) {
    console.error('Error converting JSON to CSV:', err);
  }
}
 


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const V2CODE_HASH="0x614d40a86e1b29a8f4d8d93b9f3b390bf740803fa19a69f1c95716e029ea09b3"
const V3CODE_HASH="0xd01f5152c267b7f33b9795140c2467742e8424e49ebe2331caec197f7281b60a"

export async function readCsv(csvFilePath) {
  const jsonArray = await csv().fromFile(csvFilePath);
  return jsonArray;
}
 

const fileReader = async (name) => {
  const FilePath = `${__dirname}/csv/${name}.csv`;
  const list = await readCsv(FilePath);
  return list;
};


const testV2 = async () => {
    let list = await fileReader("V2Cell")
    list.map((item) => {
        let address = generateCkbAddress( V2CODE_HASH,`0x${item.args}`)
        console.log(address,item.capacity)
    }) 
};

const test = async (name,codehash) => {
    let list = await fileReader(name) 
    let addressMap = new Map()
    list.forEach((item) => {
        let address = generateCkbAddress(codehash, `0x${item.args}`) 
        let cellInfo = addressMap.get(address)
        
        if (!cellInfo) {
            cellInfo = {
                cell: 1,
                capacity:Number(item.capacity)
            } 
        } else {
             cellInfo = {
                cell: cellInfo.cell+1,
                capacity:cellInfo.capacity+Number(item.capacity)
            } 
        }
        addressMap.set(address,cellInfo)
    }) 
    
    let addressList = []
    addressMap.forEach((k, v) => { 
        let data = { ...k, address: v }
        data.capacity = data.capacity/100000000
        addressList.push(data)
    }) 

    saveJsonToCsv(addressList,`${name}_output.csv`)
};

const showV2Info = async (name) => {
    let list = await fileReader(name) 
    let addressMap = new Map()
    list.forEach((item) => {  
        let args = addressArgs(item.address)
        addressMap.set(item.address,item)
    })


   const connection = mysql.createConnection({
    host: 'localhost',
    user: 'aven',
    password: '123456',
    database: 'unipass'
   }); 
    
   connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
    });
 

    connection.query('SELECT email,phone,hex(master_pubkey_bin) as pubkeyHash FROM accounts', (error, results, fields) => {
    if (error) throw error; 
        let v2List = []
        results.map((item) => { 
            let args = getArgsByPubkey(item.pubkeyHash)
            let address = generateCkbAddress(V2CODE_HASH, args)  
            let data = addressMap.get(address)
            if (data) {
                console.log(item, args, address);  
                v2List.push({...data,email:item.email,phone:item.phone}) 
            }
        })
        saveJsonToCsv(v2List,`${name}s.csv`)
    });

    // Close the connection
    connection.end();

}

const showV3Info = async (name) => {
    let list = await fileReader(name) 
    let addressMap = new Map()
    list.forEach((item) => { 
        addressMap.set(item.address,item)
    })
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'aven',
        password: '123456',
        database: 'unipass-v3'
   }); 
   connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
    });
 
    connection.query('SELECT ori_email as email,phone,username FROM accounts where status != 4', (error, results, fields) => {
        if (error) throw error; 
        let v3List = []
        results.map((item) => { 
            if (item.username.startsWith("@_")) {
                return
            } 
            const args = item.username.slice(0, 42); 
            let address = generateCkbAddress(V3CODE_HASH, args)   
            let data = addressMap.get(address) 
            if (data) {  
                 console.log({...data,email:item.email,phone:item.phone});   
                v3List.push({...data,email:item.email,phone:item.phone}) 
            } 
            
        })
        saveJsonToCsv(v3List,`${name}s.csv`)   
    });

    // Close the connection
    connection.end();

}

showV3Info("V3output")


// showV2Info("V2output")

