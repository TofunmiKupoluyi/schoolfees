var express= require("express");
var Flutterwave= require("flutterwave");
var mysql = require("mysql");
var session = require("express-session");
var bodyParser= require("body-parser");
var connection = mysql.createConnection({
    host:process.env.MYSQL_HOST || "localhost",
    user:process.env.MYSQL_USERNAME|| "root",
    password:process.env.MYSQL_PASSWORD||"",
    database:process.env.MYSQL_DB||"schoolfees",
})
var app= express();
var flutterwave= new Flutterwave("tk_9eFaO7BCLXiWhTyJRAnq","tk_snN5ZPBHxO");
var router = express.Router();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.listen(process.env.PORT || 300);
app.use("/static", express.static("./static"));
app.use(session({secret:"wriwoem2k39903"}));
app.get("/", function(request, response){
    response.sendfile("./home.html");
});
app.post("/", function(request, response){
    var firstName= request.body.firstName;
    var lastName = request.body.lastName;
    var relationship= request.body.relationship;
    var email = request.body.email;
    request.session.firstName= firstName;
    request.session.lastName= lastName;
    request.session.relationship= relationship;
    request.session.email= email;
    data={
        firstName: firstName,
        lastName: lastName,
        relationship: relationship,
        email:email,
    }
    console.log(data);
    response.json(data);
});
app.get("/student", function(request, response){
    if(request.session.email){
        response.sendfile("./student.html");
    }
    else{
        response.sendfile("./home.html");
    }
});

app.get("/narration", function(request, response){
    var data={
        error:1,
        narrations:""
    }
    connection.query("SELECT narration FROM fees", function(err, res){
        if(err){
            data.error=1;
            data.narrations="No narrations";
            response.json(data);
        }
        else{
            data.error=0;
            data.narrations=res;
            response.json(data);
        }
    });
});

app.post("/student", function(request, response){
    var firstName= request.body.firstName;
    var lastName= request.body.lastName;
    var narration = request.body.narration;
    var yearGroup = request.body.yearGroup;
    var arm = request.body.arm;
    var studentId = request.body.studentId;
    var fees=0;
    console.log(narration);
    connection.query("SELECT fees FROM fees WHERE narration=?",[narration], function(err, res){
        if(err || !(res)){
            fees="Not available";
            console.log("Could not resolve "+err+" "+fees);
        }
        else{
            console.log(res);
            fees=res[0]["fees"];
            request.session.studentFirstName= firstName;
            request.session.studentLastName= lastName;
            request.session.narration= narration;
            request.session.studentArm= arm;
            request.session.studentYearGroup= yearGroup;
            request.session.studentId= studentId;
            request.session.fees=fees;

            data={
                fees:fees,
                firstName: firstName,
                lastName: lastName, 
                yearGroup: yearGroup,
                arm: arm,
                studentId: studentId,
            };
            console.log(data);
            response.json(data);
        }
    });
    
});

app.get("/pay", function(request, response){
    if(request.session.studentId){
        response.sendfile("./payment.html")
    }
    else if(request.session.email){
        response.sendfile("./student.html")
    }
    else{
        response.sendfile("./home.html")
    }
});

app.post("/pay", function(request, response){
    flutterwave.Card.charge({
            "amount": request.session.fees,
            "authmodel": "NOAUTH",
            "cardno": request.body.cardNumber,
            "currency": "NGN",
            "custid": "N/A",
            "cvv": request.body.cvv, 
            "expirymonth": request.body.expiryMonth,
            "expiryyear": request.body.expiryYear, 
            "narration": "School Fees",
    }, function(err, res, body){
        if(err || body.data.responsecode!="00"){
            console.log("An error occured "+err+" "+body.data.responsemessage);
            response.json({
                error:1,
                data:"Unsuccessful"
            });
        }
        else{
            var d = new Date();
            var year = d.getFullYear();
            var day= d.getDate();
            var month= d.getMonth()+1;
            var fullDate= year+"-"+month+"-"+day;
            console.log(fullDate);
            data=[request.session.firstName, request.session.lastName, request.session.email, request.session.relationship, request.session.studentFirstName, request.session.studentLastName, request.session.studentYearGroup, request.session.studentArm, request.session.studentId, request.session.fees, body.data.responsemessage, fullDate, request.session.narration];
            console.log(body.data);
            
            connection.query("INSERT INTO payments(payerfirstname, payerlastname, payeremail, payerrelationship, studentfirstname, studentlastname, studentclass, studentarm, studentid, amountpaid, status, datepaid, narration) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",data, function(err1, res1){
                if(err1){
                    console.log(err1);
                    response.json({
                        error:1,
                        data: err1
                    });
                }
                else{
                    console.log("Done");
                    request.session.complete=true;
                    response.json({
                        error:0,
                        data:"Successful"
                    });
                }
            });
        }
    });
});

app.get("/thankyou", function(request, response){
    if(request.session.complete){
        response.sendfile("./thankyou.html");
    }
    else{
        response.sendfile("./home.html");
    }
});
