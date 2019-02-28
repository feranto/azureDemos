var crypto = require("crypto");  

function getAuthorizationTokenUsingMasterKey(verb, resourceType, resourceId, date, masterKey) {  
    var key = new Buffer(masterKey, "base64");  

    var text = (verb || "").toLowerCase() + "\n" +   
               (resourceType || "").toLowerCase() + "\n" +   
               (resourceId || "") + "\n" +   
               date.toLowerCase() + "\n" +   
               "" + "\n";  

    var body = new Buffer(text, "utf8");  
    var signature = crypto.createHmac("sha256", key).update(body).digest("base64");  

    var MasterToken = "master";  

    var TokenVersion = "1.0";  

    return encodeURIComponent("type=" + MasterToken + "&ver=" + TokenVersion + "&sig=" + signature);  
}

