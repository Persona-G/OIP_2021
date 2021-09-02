const FULL_DASH_ARRAY = 283;
let WARNING_THRESHOLD = 10;
let ALERT_THRESHOLD = 5;
var current = "";
let counter = 0;

const COLOR_CODES = {
  info: {
    color: "blue"
  },
  warning: {
    color: "orange"
  },
  alert: {
    color: "green"
  }
};

let TIME_LIMIT = 20;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

$(document).ready(function() {
    
    inactivityTime();

    let secondHand = document.querySelector("#sec");  
    let minHand = document.querySelector("#min")  
    let hourHand = document.querySelector("#hr")  

    setInterval(clockRotating,1000)  

    function clockRotating(){  
        var date=new Date();  
        var getSeconds=date.getSeconds()/60;  
        var getMinutes=date.getMinutes()/60;  
        var getHours=date.getHours()/12  

        secondHand.style.transform="rotate("+getSeconds*360 + "deg)"  
        minHand.style.transform="rotate("+getMinutes*360 + "deg)"  
        hourHand.style.transform="rotate("+getHours*360 + "deg)"  

        document.querySelector(".current-day").innerHTML=date.toDateString() 
    }

    document.getElementById("app").innerHTML = `
    <div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100">
        <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
        <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining ${remainingPathColor}"
            d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
            "
        ></path>
        </g>
    </svg>
    <span id="base-timer-label" class="base-timer__label">${formatTime(
        timeLeft
    )}</span>
    </div>
    `;

    document.getElementById("app1").innerHTML = `
    <div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100">
        <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
        <path
            id="base-timer-path-remaining1"
            stroke-dasharray="283"
            class="base-timer__path-remaining ${remainingPathColor}"
            d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
            "
        ></path>
        </g>
    </svg>
    <span id="base-timer-label1" class="base-timer__label">${formatTime(
        timeLeft
    )}</span>
    </div>
    `;

    document.getElementById("app2").innerHTML = `
    <div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100">
        <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
        <path
            id="base-timer-path-remaining2"
            stroke-dasharray="283"
            class="base-timer__path-remaining ${remainingPathColor}"
            d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
            "
        ></path>
        </g>
    </svg>
    <span id="base-timer-label2" class="base-timer__label">${formatTime(
        timeLeft
    )}</span>
    </div>
    `;

    loadLogs();
    
});

var inactivityTime = function () {
    var time;
    window.onload = resetTimer;
    // DOM Events
    document.onmousemove = resetTimer;
    document.onmousedown = resetTimer;
    document.ontouchstart = resetTimer;
    document.onclick = resetTimer;
    document.onkeydown = resetTimer;
    document.addEventListener('scroll', resetTimer, true);

    function sceensaver() {
        document.getElementById("screen-saver").style.display = 'block';
        document.getElementById("flex-container").style.display = 'none';
        document.body.style.backgroundImage = "url('/static/img/background.jfif')";
    }

    function resetTimer() {
        clearTimeout(time);
        document.getElementById("screen-saver").style.display = 'none';
        document.getElementById("flex-container").style.display = '';
        document.body.style.backgroundImage = "";
        time = setTimeout(sceensaver, 60000)
    }
};

function loadLogs() {
    const myArr = []

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/loadLogs",
        data: {},
        success: function(result) {
            console.log(JSON.parse(result));

            for (var i = 0; i < 4; i++) {
                myArr.push(JSON.parse(result)[i].split(","));
            }

            document.getElementById("dateTime1").innerHTML = myArr[3][0]
            document.getElementById("dateTime2").innerHTML = myArr[2][0]
            document.getElementById("dateTime3").innerHTML = myArr[1][0]
            document.getElementById("dateTime4").innerHTML = myArr[0][0]

            document.getElementById("msg1").innerHTML = myArr[3][2]
            document.getElementById("msg2").innerHTML = myArr[2][2]
            document.getElementById("msg3").innerHTML = myArr[1][2]
            document.getElementById("msg4").innerHTML = myArr[0][2]

            document.getElementById("msgType1").innerHTML = "<img src = '/static/img/" + myArr[3][1] + "' />"
            document.getElementById("msgType2").innerHTML = "<img src = '/static/img/" + myArr[2][1] + "' />"
            document.getElementById("msgType3").innerHTML = "<img src = '/static/img/" + myArr[1][1] + "' />"
            document.getElementById("msgType4").innerHTML = "<img src = '/static/img/" + myArr[0][1] + "' />"
        }
    });
}

function wash() {
    if (!document.getElementById('check-1').checked || !document.getElementById('check-2').checked) {
        document.getElementById("error").style.display = 'block';
        $("#error").fadeOut(1500);
    } else {
        // Get the modal
        var modal = document.getElementById("washModal");

        var span = document.getElementById("closeWash");
        var close = document.getElementById("closeWashBtn");
        var confirm = document.getElementById("confirmWashBtn");

        modal.style.display = "block";

        // When the user clicks on <span> (x), close the modal
        close.onclick = function() {
            modal.style.display = "none";
        }

        confirm.onclick = function() {
            modal.style.display = "none";

            var divsToHide = document.getElementsByClassName("proceed");
            var countDown = document.getElementsByClassName("base-timer");
            var dryCurrent = document.getElementById("dryCurrent");
            var sterilizeCurrent = document.getElementById("sterilizeCurrent");

            dryCurrent.style.display = "block"
            dryCurrent.innerHTML = "Current Process: Washing"
            sterilizeCurrent.style.display = "block"
            sterilizeCurrent.innerHTML = "Current Process: Washing"
            current = "wash"

            for(var i = 0; i < divsToHide.length; i++){
                divsToHide[i].style.display = "none";
                countDown[i].style.display = "block";
            }

            document.getElementById("washStop").style.display = "block";

            $.ajax({
                type: "GET",
                url: "http://127.0.0.1:5000/wash",
                data: {},
                success: function(result) {
                    console.log(result)
                    if (result == "success") {
                        TIME_LIMIT = 120;
                        timeLeft = TIME_LIMIT
                        WARNING_THRESHOLD = TIME_LIMIT / 2;
                        ALERT_THRESHOLD = TIME_LIMIT / 4;
                        startTimer();
                    }
                }
            });

        }

        span.onclick = function() {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        document.getElementById("check-1").checked = false;
        document.getElementById("check-2").checked = false;
    }
}

function dry() {
    if (!document.getElementById('check-3').checked) {
        document.getElementById("error").style.display = 'block';
        $("#error").fadeOut(1500);
    } else {
        // Get the modal
        var modal = document.getElementById("dryModal");

        var span = document.getElementById("closeDry");
        var close = document.getElementById("closeDryBtn");
        var confirm = document.getElementById("confirmDryBtn");

        modal.style.display = "block";

        // When the user clicks on <span> (x), close the modal
        close.onclick = function() {
            modal.style.display = "none";
        }

        confirm.onclick = function() {
            modal.style.display = "none";

            var divsToHide = document.getElementsByClassName("proceed");
            var countDown = document.getElementsByClassName("base-timer");
            var washCurrent = document.getElementById("washCurrent");
            var sterilizeCurrent = document.getElementById("sterilizeCurrent");

            washCurrent.style.display = "block"
            washCurrent.innerHTML = "Current Process: Drying"
            sterilizeCurrent.style.display = "block"
            sterilizeCurrent.innerHTML = "Current Process: Drying"
            current = "dry"

            for(var i = 0; i < divsToHide.length; i++){
                divsToHide[i].style.display = "none";
                countDown[i].style.display = "block"
            }

            document.getElementById("dryStop").style.display = "block";

            $.ajax({
                type: "GET",
                url: "http://127.0.0.1:5000/dry",
                data: {},
                success: function(result) {
                    console.log(result)
                    if (result == "success") {
                        TIME_LIMIT = 900;
                        timeLeft = TIME_LIMIT
                        WARNING_THRESHOLD = TIME_LIMIT / 2;
                        ALERT_THRESHOLD = TIME_LIMIT / 4;
                        startTimer();
                    }
                }
            });

        }

        span.onclick = function() {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        document.getElementById("check-3").checked = false;
    }
}

function sterilize() {
    if (!document.getElementById('check-4').checked) {
        document.getElementById("error").style.display = 'block';
        $("#error").fadeOut(1500);
    } else {
        // Get the modal
        var modal = document.getElementById("sterilizationModal");

        var span = document.getElementById("closeSterilization");
        var close = document.getElementById("closeSterilizationBtn");
        var confirm = document.getElementById("confirmSterilizationBtn");

        modal.style.display = "block";

        // When the user clicks on <span> (x), close the modal
        close.onclick = function() {
            modal.style.display = "none";
        }

        confirm.onclick = function() {
            modal.style.display = "none";

            var divsToHide = document.getElementsByClassName("proceed");
            var countDown = document.getElementsByClassName("base-timer");
            var washCurrent = document.getElementById("washCurrent");
            var dryCurrent = document.getElementById("dryCurrent");

            washCurrent.style.display = "block"
            washCurrent.innerHTML = "Current Process: Sterilization"
            dryCurrent.style.display = "block"
            dryCurrent.innerHTML = "Current Process: Sterilization"
            current = "sterilize"

            for(var i = 0; i < divsToHide.length; i++){
                divsToHide[i].style.display = "none";
                countDown[i].style.display = "block"
            }

            document.getElementById("sterilizeStop").style.display = "block";

            $.ajax({
                type: "GET",
                url: "http://127.0.0.1:5000/sterilize",
                data: {},
                success: function(result) {
                    console.log(result)
                    if (result == "success") {
                        TIME_LIMIT = 60;
                        timeLeft = TIME_LIMIT
                        WARNING_THRESHOLD = TIME_LIMIT / 2;
                        ALERT_THRESHOLD = TIME_LIMIT / 4;
                        startTimer();
                    }
                }
            });
        }

        span.onclick = function() {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        document.getElementById("check-4").checked = false;
    }
}

function washStop() {
    document.getElementById("stopContent").innerHTML = "Confirmation to STOP Current Process: Washing Stage ?"
    // Get the modal
    var modal = document.getElementById("stopModal");

    var span = document.getElementById("closeStop");
    var close = document.getElementById("closeStopBtn");
    var confirm = document.getElementById("confirmStopBtn");

    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    close.onclick = function() {
        modal.style.display = "none";
    }

    confirm.onclick = function() {
        modal.style.display = "none";
        clearInterval(timerInterval);

        $.ajax({
            type: "GET",
            url: "http://127.0.0.1:5000/stop",
            data: {
                currentProcess: current
            },
            success: function(result) {
                console.log(result)
                if (result == "success") {
                    document.getElementById("washStop").style.display = "";
                    var dryCurrent = document.getElementById("dryCurrent");
                    var sterilizeCurrent = document.getElementById("sterilizeCurrent");

                    dryCurrent.style.display = "none";
                    dryCurrent.innerHTML = ""
                    sterilizeCurrent.style.display = "none";
                    sterilizeCurrent.innerHTML = ""

                    var divsToShow = document.getElementsByClassName("proceed");
                    var countDown = document.getElementsByClassName("base-timer");

                    for(var i = 0; i < divsToShow.length; i++){
                        divsToShow[i].style.display = "block";
                        countDown[i].style.display = "none";
                    }

                    current = "";
                    timePassed = 0;
                    resetTimer();
                }
            }
        });

    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function dryStop() {
    document.getElementById("stopContent").innerHTML = "Confirmation to STOP Current Process: Drying Stage ?"
    // Get the modal
    var modal = document.getElementById("stopModal");

    var span = document.getElementById("closeStop");
    var close = document.getElementById("closeStopBtn");
    var confirm = document.getElementById("confirmStopBtn");

    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    close.onclick = function() {
        modal.style.display = "none";
    }

    confirm.onclick = function() {
        modal.style.display = "none";
        clearInterval(timerInterval);

        $.ajax({
            type: "GET",
            url: "http://127.0.0.1:5000/stop",
            data: {
                currentProcess: current
            },
            success: function(result) {
                console.log(result)
                if (result == "success") {
                    document.getElementById("dryStop").style.display = "";
                    var washCurrent = document.getElementById("washCurrent");
                    var sterilizeCurrent = document.getElementById("sterilizeCurrent");

                    washCurrent.style.display = "none";
                    dryCurrent.innerHTML = ""
                    sterilizeCurrent.style.display = "none";
                    sterilizeCurrent.innerHTML = ""

                    var divsToShow = document.getElementsByClassName("proceed");
                    var countDown = document.getElementsByClassName("base-timer");

                    for(var i = 0; i < divsToShow.length; i++){
                        divsToShow[i].style.display = "block";
                        countDown[i].style.display = "none";
                    }

                    current = "";
                    timePassed = 0;
                    resetTimer();
                }
            }
        });

    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function sterilizeStop() {
    document.getElementById("stopContent").innerHTML = "Confirmation to STOP Current Process: Sterilization Stage ?"
    // Get the modal
    var modal = document.getElementById("stopModal");

    var span = document.getElementById("closeStop");
    var close = document.getElementById("closeStopBtn");
    var confirm = document.getElementById("confirmStopBtn");

    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    close.onclick = function() {
        modal.style.display = "none";
    }

    confirm.onclick = function() {
        modal.style.display = "none";
        clearInterval(timerInterval);

        $.ajax({
            type: "GET",
            url: "http://127.0.0.1:5000/stop",
            data: {
                currentProcess: current
            },
            success: function(result) {
                console.log(result)
                if (result == "success") {
                    document.getElementById("sterilizeStop").style.display = "";
                    var dryCurrent = document.getElementById("dryCurrent");
                    var washCurrent = document.getElementById("washCurrent");

                    dryCurrent.style.display = "none";
                    dryCurrent.innerHTML = ""
                    washCurrent.style.display = "none";
                    washCurrent.innerHTML = ""

                    var divsToShow = document.getElementsByClassName("proceed");
                    var countDown = document.getElementsByClassName("base-timer");

                    for(var i = 0; i < divsToShow.length; i++){
                        divsToShow[i].style.display = "block";
                        countDown[i].style.display = "none";
                    }

                    current = "";
                    timePassed = 0;
                    resetTimer();
                }
            }
        });

    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function resetTimer() {
    const { alert, warning, info } = COLOR_CODES;
    
    document.getElementById("base-timer-path-remaining").classList.add(info.color);
    document.getElementById("base-timer-path-remaining").classList.remove(warning.color);
    document.getElementById("base-timer-path-remaining").classList.remove(alert.color);

    document.getElementById("base-timer-path-remaining1").classList.add(info.color);
    document.getElementById("base-timer-path-remaining1").classList.remove(warning.color);
    document.getElementById("base-timer-path-remaining1").classList.remove(alert.color);

    document.getElementById("base-timer-path-remaining2").classList.add(info.color);
    document.getElementById("base-timer-path-remaining2").classList.remove(warning.color);
    document.getElementById("base-timer-path-remaining2").classList.remove(alert.color);
}

function onTimesUp() {
    clearInterval(timerInterval);
    resetTimer();

    document.getElementById("washStop").style.display = "";
    document.getElementById("dryStop").style.display = "";
    document.getElementById("sterilizeStop").style.display = "";

    var dryCurrent = document.getElementById("dryCurrent");
    var washCurrent = document.getElementById("washCurrent");
    var sterilizeCurrent = document.getElementById("sterilizeCurrent");

    dryCurrent.style.display = "block";
    washCurrent.style.display = "block";
    sterilizeCurrent.style.display = "block";
    

    if (current == "wash") {
        dryCurrent.innerHTML = "Completed Washing Stage"
        washCurrent.innerHTML = "Completed Washing Stage"
        sterilizeCurrent.innerHTML = "Completed Washing Stage"
    } else if (current == "dry") {
        dryCurrent.innerHTML = "Completed Drying Stage"
        washCurrent.innerHTML = "Completed Drying Stage"
        sterilizeCurrent.innerHTML = "Completed Drying Stage"
    } else {
        dryCurrent.innerHTML = "Completed Sterilization Stage"
        washCurrent.innerHTML = "Completed Sterilization Stage"
        sterilizeCurrent.innerHTML = "Completed Sterilization Stage"
    }

    // Stop current process once timer is up
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/stop",
        data: {
            currentProcess: current
        },
        success: function(result) {
            console.log("stop " + result)
            if (result == "success") {
                if (current === "sterilize") {

                    $.ajax({
                        type: "GET",
                        url: "http://127.0.0.1:5000/alert",
                        data: {},
                        success: function(result) {
                            console.log(result)
                            if (result == "success") {
                                document.getElementById("sterilizeStop").style.display = "";
                                var dryCurrent = document.getElementById("dryCurrent");
                                var washCurrent = document.getElementById("washCurrent");
                        
                                dryCurrent.style.display = "none";
                                dryCurrent.innerHTML = ""
                                washCurrent.style.display = "none";
                                washCurrent.innerHTML = ""
                        
                                var divsToShow = document.getElementsByClassName("proceed");
                                var countDown = document.getElementsByClassName("base-timer");
                        
                                for(var i = 0; i < divsToShow.length; i++){
                                    divsToShow[i].style.display = "block";
                                    countDown[i].style.display = "none";
                                }
                        
                                current = "";
                                timePassed = 0;
                                resetTimer();
                                loadLogs();
                                document.getElementById("radio_testimonial-4").checked = true;
                            }
                        }
                    });
                    
                } else {
                    var modal = document.getElementById("loadingModal");
                    modal.style.display = "block";
            
                    $.ajax({
                        type: "GET",
                        url: "http://127.0.0.1:5000/ml",
                        data: {
                            currentProcess: current
                        },
                        success: function(result) {
                            // check result msg
                            console.log("ml " + result)

                            if (counter == 1 && result == "dirty") {
                                result = "success";
                            } else {
                                counter = 0;
                            }

                            modal.style.display = "none";
                            loadLogs();

                            if (result == "success") {
                                // Success
            
                                if (current === "wash") {
                                    if (counter == 0) {
                                        document.getElementById("clean").style.display = 'block';
                                        $("#clean").fadeOut(5000);
                                    } else {
                                        document.getElementById("stain").style.display = 'block';
                                        $("#stain").fadeOut(5000);
                                    }
            
                                    current = "dry";
            
                                    document.getElementById("radio_testimonial-2").checked = true;
                                    document.getElementById("washStop").style.display = "";
            
                                    var washCurrent = document.getElementById("washCurrent");
                                    var sterilizeCurrent = document.getElementById("sterilizeCurrent");
            
                                    washCurrent.style.display = "block"
                                    washCurrent.innerHTML = "Current Process: Drying"
                                    sterilizeCurrent.innerHTML = "Current Process: Drying"
            
                                    document.getElementById("dryCurrent").style.display = "none";
                                    document.getElementById("dryStop").style.display = "block";
            
                                    $.ajax({
                                        type: "GET",
                                        url: "http://127.0.0.1:5000/dry",
                                        data: {},
                                        success: function(result) {
                                            console.log(result)
                                            if (result == "success") {
                                                TIME_LIMIT = 900;
                                                timeLeft = TIME_LIMIT
                                                WARNING_THRESHOLD = TIME_LIMIT / 2;
                                                ALERT_THRESHOLD = TIME_LIMIT / 4;
                                                startTimer();
                                            }
                                        }
                                    });
            
                                } else if (current === "dry") {
                                    document.getElementById("dry").style.display = 'block';
                                    $("#dry").fadeOut(5000);
            
                                    current = "sterilize";
            
                                    document.getElementById("radio_testimonial-3").checked = true;
                                    document.getElementById("dryStop").style.display = "";
            
                                    var washCurrent = document.getElementById("washCurrent");
                                    var dryCurrent = document.getElementById("dryCurrent");
            
                                    washCurrent.innerHTML = "Current Process: Sterilization"
                                    dryCurrent.style.display = "block"
                                    dryCurrent.innerHTML = "Current Process: Sterilization"
            
                                    document.getElementById("dryCurrent").style.display = "block";
                                    document.getElementById("sterilizeStop").style.display = "block";
            
                                    document.getElementById("sterilizeCurrent").style.display = "none";
            
                                    $.ajax({
                                        type: "GET",
                                        url: "http://127.0.0.1:5000/sterilize",
                                        data: {},
                                        success: function(result) {
                                            console.log(result)
                                            if (result == "success") {
                                                TIME_LIMIT = 60;
                                                timeLeft = TIME_LIMIT
                                                WARNING_THRESHOLD = TIME_LIMIT / 2;
                                                ALERT_THRESHOLD = TIME_LIMIT / 4;
                                                startTimer();
                                            }
                                        }
                                    });
            
                                }
                            } else if (result == "dirty") {
                                counter = 1;
                                document.getElementById("stain").style.display = 'block';
                                $("#stain").fadeOut(5000);

                                var dryCurrent = document.getElementById("dryCurrent");
                                var sterilizeCurrent = document.getElementById("sterilizeCurrent");
                                var washCurrent = document.getElementById("washCurrent");

                                washCurrent.style.display = "none";
                                dryCurrent.innerHTML = "Current Process: Washing"
                                sterilizeCurrent.innerHTML = "Current Process: Washing"
                                document.getElementById("washStop").style.display = "block";

                                $.ajax({
                                    type: "GET",
                                    url: "http://127.0.0.1:5000/wash",
                                    data: {},
                                    success: function(result) {
                                        console.log(result)
                                        if (result == "success") {
                                            TIME_LIMIT = 120;
                                            timeLeft = TIME_LIMIT
                                            WARNING_THRESHOLD = TIME_LIMIT / 2;
                                            ALERT_THRESHOLD = TIME_LIMIT / 4;
                                            startTimer();
                                        }
                                    }
                                });
                            } else if (result == "wet") {
                                document.getElementById("water").style.display = 'block';
                                $("#water").fadeOut(5000);

                                var washCurrent = document.getElementById("washCurrent");
                                var dryCurrent = document.getElementById("dryCurrent");
                                var sterilizeCurrent = document.getElementById("sterilizeCurrent");

                                dryCurrent.style.display = "none";
                                washCurrent.innerHTML = "Current Process: Drying"
                                sterilizeCurrent.innerHTML = "Current Process: Drying"
                                document.getElementById("dryStop").style.display = "block";


                                $.ajax({
                                    type: "GET",
                                    url: "http://127.0.0.1:5000/dry",
                                    data: {},
                                    success: function(result) {
                                        console.log(result)
                                        if (result == "success") {
                                            TIME_LIMIT = 300;
                                            timeLeft = TIME_LIMIT
                                            WARNING_THRESHOLD = TIME_LIMIT / 2;
                                            ALERT_THRESHOLD = TIME_LIMIT / 4;
                                            startTimer();
                                        }
                                    }
                                });
                            }
                        }
                    });
            
                }
            }
        }
    });
    
  }
  
function startTimer() {
    timerInterval = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
        document.getElementById("base-timer-label1").innerHTML = formatTime(timeLeft);
        document.getElementById("base-timer-label2").innerHTML = formatTime(timeLeft);
        setCircleDasharray();
        setRemainingPathColor(timeLeft);

        if (timeLeft === 0) {
            timePassed = 0;
            onTimesUp();
        }
    }, 1000);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES;

    if (timeLeft <= ALERT_THRESHOLD) {
        document.getElementById("base-timer-path-remaining").classList.remove(warning.color);
        document.getElementById("base-timer-path-remaining").classList.add(alert.color);
        document.getElementById("base-timer-path-remaining1").classList.remove(warning.color);
        document.getElementById("base-timer-path-remaining1").classList.add(alert.color);
        document.getElementById("base-timer-path-remaining2").classList.remove(warning.color);
        document.getElementById("base-timer-path-remaining2").classList.add(alert.color);
    } else if (timeLeft <= WARNING_THRESHOLD) {
        document.getElementById("base-timer-path-remaining").classList.remove(info.color);
        document.getElementById("base-timer-path-remaining").classList.add(warning.color);
        document.getElementById("base-timer-path-remaining1").classList.remove(info.color);
        document.getElementById("base-timer-path-remaining1").classList.add(warning.color);
        document.getElementById("base-timer-path-remaining2").classList.remove(info.color);
        document.getElementById("base-timer-path-remaining2").classList.add(warning.color);
    }
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document.getElementById("base-timer-path-remaining").setAttribute("stroke-dasharray", circleDasharray);
    document.getElementById("base-timer-path-remaining1").setAttribute("stroke-dasharray", circleDasharray);
    document.getElementById("base-timer-path-remaining2").setAttribute("stroke-dasharray", circleDasharray);
}
