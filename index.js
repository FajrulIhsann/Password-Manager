const ps = require('prompt-sync');
const prompt = ps();
const fs = require('fs');
const { platform } = require('os');
const crypto = require('crypto');


// Fungsi Hashing
function generateHash(data, algorithm = 'sha256') {
    const hash = crypto.createHash(algorithm);
    hash.update(data);
    return hash.digest('hex');
}

// Kunci rahasia (harus 32 byte untuk AES-256)
const key = crypto.createHash('sha256').update('kata-rahasia-ku').digest(); 

// IV (Initialization Vector) harus 16 byte
const iv = Buffer.alloc(16, 0); // 16 byte kosong, hanya untuk contoh sederhana

function encrypt(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function auth(){
    const auth1 = "c7c39e078e203379fc43a0faf63dd2b7b40bb2edbd8400fdb13458715d419a2a"
    console.log('=========== Password Manager ===========')
    console.log('\n')
    let passInput = prompt('Tolong Masukkan Passwordnya : ')

    if(generateHash(passInput) == auth1){
        console.log('Password Benar!\n')
        main()
    }else{
        console.log('Password Salah!')
        return 0;
    }

}


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
      // Membaca isi file data.json
    const rawData = fs.readFileSync('userData.json');
    const data = JSON.parse(rawData);

    // Menyimpan key utama ke dalam array
    const akunList = Object.keys(data);

    // Menyetak daftar key utama
    console.log('\nDaftar akun secara tersimpan:');
    akunList.forEach((akun, index) => {
     console.log(`${index + 1}. ${decrypt(akun)}`);
    });

    // Menyesuaikan input user dengan index array
    let unindexedplatformInput = prompt('Pilih Platform Yang Ingin Anda Lihat : ')
    let indexedPlatformInput = parseInt(unindexedplatformInput) - 1;

    //Menyuruh User untuk memilih Platform dari Akun yang disimpan
    if(indexedPlatformInput >= 0 && indexedPlatformInput < akunList.length) {
     const selectedKey = akunList[indexedPlatformInput];
     const akunData = data[selectedKey];

     console.log(`\nDetail akun "${decrypt(selectedKey)}":`);
     console.log(`Nama    : ${decrypt(akunData.Code1)}`);
     console.log(`Password: ${decrypt(akunData.Code2)}`);
    } else {
     console.log('\n❌ Index tidak valid. Silakan coba lagi.');
    }

    
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
        obj[encrypt(passwordPlatform)] = {
            "Code1" : encrypt(passwordName),
            "Code2" : encrypt(passwordCode)
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


auth()


