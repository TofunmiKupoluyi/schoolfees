var app= angular.module("schoolfees", []);


app.service("personalInformation", function($q,$http){
    this.submitForm= function(data){
        $http.post("/", data).then(function(response){
            window.location="/student"; 
        });
    };
});

app.controller("initialize", function($scope, personalInformation){  
    $scope.submitForm = function(){
        var data= {
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            email: $scope.email,
            relationship: $scope.relationship,
        }
        personalInformation.submitForm(data);
    };
});

app.service("studentInformation", function($http, $window){
    var fees=0;
    this.submitForm= function(data){
        $http.post("/student", data).then(function(response){
            fees=response.data.fees;
            $window.sessionStorage.fees=response.data.fees;
            window.location="/pay";
        });
    };
});
app.controller("studInfo", function($scope, studentInformation){
    $scope.submitForm= function(){
        console.log($scope.yearGroup);
        var data= {
        firstName: $scope.firstName,
        lastName: $scope.lastName,
        yearGroup: $scope.yearGroup,
        arm: $scope.arm,
        studentId: $scope.studentId
        };
        studentInformation.submitForm(data);
    };
});

app.service("pay", function($http, $q){
    var message="";
    
    this.sendForm = function(data){
        var deferred= $q.defer();
        $http.post("/pay", data).then(function(response){
            console.log("I have been clicked");
            if(response.data.error==0){
                message="Successful";
                window.location="/thankyou";
                deferred.resolve(message);
            }
            else{
                message="Failed, please try again"
                deferred.reject(message);
            }
        });
        return deferred.promise;
    };
    
});

app.controller("payment", function($scope, pay, $window){
    $scope.visibleCard=false;
    $scope.visibleAccount=false;
    $scope.activity=true;
    $scope.fees= $window.sessionStorage.fees;
    
    $scope.showDiv= function(){
        var selected= $scope.paymentMethod;
        switch(selected){
            case "1": 
                $scope.visibleCard=true;
                $scope.visibleAccount=false;
                $scope.activity=false;
                $scope.sendForm= function(){
                    data={
                        cardNumber: $scope.cardNumber,
                        expiryMonth: $scope.expiryMonth,
                        expiryYear: $scope.expiryYear,
                        cvv: $scope.cvv
                    };
                    $scope.activity=true;
                    pay.sendForm(data, $scope.activity).then(function(response){
                        console.log(response);
                        $scope.message= response;
                        $scope.activity=true;
                    }, function(error){
                        console.log(error);
                        $scope.message=error;
                        $scope.activity=false;
                    });
                };
                break;
            case "2": 
                $scope.visibleAccount=true;
                $scope.visibleCard=false;
                $scope.activity=true;
                break;
            default: 
                $scope.visibleCard=false; 
                $scope.visibleAccount=false;
                $scope.activity=true;
        }
    };
});