const ps = require('prompt-sync');
const prompt = ps();
const fs = require('fs');
const { platform } = require('os');







function main(){
    console.log('=========== Password Manager ===========')
    console.log("0  Untuk Keluar dari aplikasi")
    console.log("1  Untuk Menyimpan Password")
    console.log("2  Untuk melihat list password")
    let command = prompt("> ")
    if(command == "1"){
        addPassword()
    }else if(command == "2"){
        showList()
    }else if(command == "0") {
        process.exit()
    }else{
        console.log("Perintah tidak dikenali")
    }
}



function showList(){
    // reading a JSON file asynchronously
fs.readFile("userData.json", (error, data) => {
    // if the reading process failed,
    // throwing the error
    if (error) {
      // logging the error
      console.error(error);
  
      throw err;
    }
  
    // parsing the JSON object
    // to convert it to a JavaScript object
    let Database = JSON.parse(data);
  
    // printing the JavaScript object
    // retrieved from the JSON file
    if(Database !== '{}'){
        console.log(Database)
    }else{
        console.log('Daftar Password Masih Kosong')
    }
  });
    
}


function addPassword(){
    let passwordPlatform = prompt("Masukkan platform yang anda gunakan : ")
    let passwordName = prompt("Masukkan nama password Anda : ")
    let passwordCode = prompt("Masukkan Password yang ingin anda simpan : ")
    
    
    fs.readFile('userData.json', 'utf8', (err, data) => {
        if (err) {
            console.error("An error occurred reading the file:", err);
            return;
        }
    
        // Parse the JSON data
        let obj = JSON.parse(data);
    
    
        // Modify your JSON object
        obj[passwordPlatform] = {
            "Nama" : passwordName,
            "Password" : passwordCode
        };
    
    
        // Convert it back to a string to prepare for output
        const updatedJson = JSON.stringify(obj, null, 2);
    
        // Write it back to the file
        fs.writeFile('userData.json', updatedJson, 'utf8', err => {
            if (err) {
                console.error("An error occurred writing the file:", err);
            } else {
                console.log("File has been updated");
            }
        });
    });
    
    
}


main()


