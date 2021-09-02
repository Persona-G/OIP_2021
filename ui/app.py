# app.py
from flask import Flask, request, jsonify, render_template
from datetime import datetime
import time
import serial
import json
from xmlrpc.client import ServerProxy
import xmlrpc.client
from picamera import PiCamera

app = Flask(__name__)
proxy = ServerProxy("http://192.168.113.66:5000/")
counter = 0

def logs(msgType, msg):
    # datetime object containing current date and time
    now = datetime.now()
    # dd/mm/YY H:M:S
    dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
    
    new_line = dt_string + "," + msgType + "," + msg + "\n"
    
    with open("static/logs.txt", "a") as a_file:
        a_file.write(new_line)
    
    a_file.close()
    # Return success msg
    return "success"

def takePic():
    camera = PiCamera()
    camera.capture("sample/image.jpg")

    camera.stop_preview()
    camera.close()

    with open("sample/image.jpg", "rb") as handle:
        binary_data = xmlrpc.client.Binary(handle.read())
    proxy.server_receive_file(binary_data)
    
    
@app.route("/")
def index():
    return render_template("boot.html")

@app.route("/home")
def home():
    print(proxy.load())
    return render_template("index.html")

@app.route("/ml", methods=["GET"])
def ml():
    global counter
    print("Starting ml")
    current = request.args.get("currentProcess", None)
    
    if current == "dry":
        ser.write(b"humidity")

        time.sleep(1.0)
        hum = ser.readline().decode('utf-8').rstrip()
        while True:
            print("inside humidity")
            if hum == "wet":
                return "wet"
            if hum == "dry":
                break
            time.sleep(0.5)
            
        print("Humidity level Dry")

    # sending msg to arduino to rotate the camera
    ser.write(b"syringe")
    
    time.sleep(1.0)

    while True:
        print("inside")
        if ser.readline().decode('utf-8').rstrip() == "done":
            break
    
    
    print("Take Picture")
    
    takePic()
    
    result = proxy.ml()
    
    # Do ml prediction
    if current == "wash":
        print("Detect for stain.")
        if result[0] == "dirty" or result[1] == "dirty":
            counter += 1
            logs("highlight_off-24px.svg", "Stain Detected! Continuing on Washing Stage")
            return "dirty"
    else:
        print("Detect for water.")
        if result[0] == "wet" or result[1] == "wet":
            logs("highlight_off-24px.svg", "Wet Syringes Detected! Continuing on Drying Stage")
            return "wet"
        
    
    # sending msg to arduino to rotate the camera
    ser.write(b"plunge")

    time.sleep(1.0)

    while True:
        print("inside")
        if ser.readline().decode('utf-8').rstrip() == "done":
            break
    
        
    print("Take Picture")
    
    takePic()
    
    result = proxy.ml()
    
    # Do ml prediction
    if current == "wash":
        print("Detect for stain.")
        if result[0] == "dirty" or result[1] == "dirty":
            counter += 1
            logs("highlight_off-24px.svg", "Stain Detected! Continuing on Washing Stage")
            return "dirty"
        else:
            logs("check_circle-24px.svg", "No Stain Detected! Proceeding to Drying Stage")
    else:
        print("Detect for water.")
        if result[0] == "wet" or result[1] == "wet":
            logs("highlight_off-24px.svg", "Wet Syringes Detected! Continuing on Drying Stage")
            return "wet"
        else:
            logs("check_circle-24px.svg", "No Wet Syringes Detected! Proceeding on Sterilization Stage")
    
    # Return success msg
    return "success"

@app.route("/wash", methods=["GET"])
def wash():
    # sending msg to arduino to start washing
    ser.write(b"wash")
    print("washing")
    # Return success msg
    return "success"

@app.route("/dry", methods=["GET"])
def dry():
    # sending msg to arduino to start washing
    ser.write(b"dry")
    print("drying")
    # Return success msg
    return "success"

@app.route("/sterilize", methods=["GET"])
def sterilize():
    # sending msg to arduino to start washing
    ser.write(b"sterilize")
    print("sterilize")
    # Return success msg
    return "success"

@app.route("/alert", methods=["GET"])
def alert():
    # sending msg to arduino to start washing
    ser.write(b"alert")
    print("alerting")
    
    time.sleep(3.0)
    
    # sending msg to arduino to start washing
    ser.write(b"stopAlert")
    print("stop alerting")
    
    # Return success msg
    return "success"

@app.route("/stop", methods=["GET"])
def stop():
    global counter
    current = request.args.get("currentProcess", None)
    
    if current == "wash":
        print("Stop Washing Stage")
        # sending msg to arduino to start washing
        ser.write(b"stopWash")
    elif current == "dry":
        print("Stop Drying Stage")
        # sending msg to arduino to start washing
        ser.write(b"stopDry")
    else:
        print("Stop Sterilization Stage")
        # sending msg to arduino to start washing
        ser.write(b"stopSterilize")
        logs("check_circle-24px.svg", "Completed Cleaning Process!")
        
        if counter >= 2:
            logs("highlight_off-24px.svg", "Stubborn Stain Detected! Do check the syringes again!")
            counter = 0
        else:
            counter = 0
    
    time.sleep(1.5)
    # Return success msg
    return "success"

@app.route("/loadLogs", methods=["GET"])
def loadLogs():
    a_file = open("static/logs.txt", "r")
    lines = a_file.readlines()
    last_lines = lines[-4:]
    json_format = json.dumps(last_lines)
    
    return jsonify(json_format)


# Start
if __name__ == "__main__":
    # Catch if fail to connect to main server
    try:
        ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
        ser.flush()
        # Threaded option to enable multiple instances for multiple user access support
        app.run(threaded=True, port=5000)
    except:
        print("Fail to Connect")
