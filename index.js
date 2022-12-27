const http = require('http')
const fs = require('fs')
const querystring = require('querystring');
const requests = require('requests')
const { unescape } = require('querystring')

const findCurrentPos = ()=>{
    //Finds users location
    requests(`https://ipinfo.io/json?token=${userLocationApiKey}`)
    .on('data', (chunk) => {
        tempCityObj = JSON.parse(chunk)
    })
    .on('end', (error) => {
        if (error) return city = 'New Delhi, In';
        city = tempCityObj.city + ',' + tempCityObj.country;
        console.log(city);
    })
}

const weatherApiKey = 'db9329c6a7b34854de9265bfe31d64bc';
const userLocationApiKey = 'ed4e8539aad36e';
var city = findCurrentPos();

const server = http.createServer((req, res) => {

    (function () {
        if (req.url == '/') {
            const myHome = fs.readFileSync('home.html', 'utf-8')
            var objectData;
            requests(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`)
                .on('data', (chunck) => {
                    objectData = JSON.parse(chunck);
                    if (objectData.cod != '200') res.end("Enter City Name and Country-Code properly");
                })
                .on('end', (err) => {
                    if (err) return console.log("Error while reading: ", err)
                    if (objectData.cod != '200') res.end("Enter City Name and Country-Code properly");
                    const realTimeData = replaceVal(myHome, objectData);
                    //console.log(objectData)
                    res.end(realTimeData);
                })
                .on('error', (err) => {
                    console.log('error')
                    res.end("Error")
                })
        }
        else {
            res.end("File Not Found")
        }
    })();
}
).listen(8000, "127.0.0.1", () => {
    console.log("Listening at port: 8000")
})

const replaceVal = (htmlObjectFile, tempVal) => {
    htmlObjectFile = htmlObjectFile.replace("{%temp%}", tempVal.main.temp)
    htmlObjectFile = htmlObjectFile.replace("{%desc%}", tempVal.weather[0].description)
    htmlObjectFile = htmlObjectFile.replace("{%feel%}", tempVal.main.feels_like)
    htmlObjectFile = htmlObjectFile.replace("{%city%}", tempVal.name)
    htmlObjectFile = htmlObjectFile.replace("{%country%}", tempVal.sys.country)
    htmlObjectFile = htmlObjectFile.replace("{%status%}", tempVal.weather[0].main)

    return htmlObjectFile;
}
