# Import Dependencies
import datetime as dt
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect, MetaData
# Allow us to declare column types
from sqlalchemy import Column, Integer, String, Float 
#import pandas as pd
#import numpy as np
#import matplotlib.pyplot as plt

from flask import Flask, jsonify

# Create an engine for the hawaii.sqlite database
#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# Reflect Database into ORM classes
# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Create a database session object
session = Session(engine)

# Save a reference to the station table as `Stations`
Stations = Base.classes.stations

# Save a reference to the measurements table as `Measurements`
Measurements = Base.classes.measurements


#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return ("Hello World"
 #       f"Available Routes:<br/>"
 #       f"/api/v1.0/precipitation<br/>"
 #       f"/api/v1.0/stations<br/>"
 #       f"/api/v1.0/tobs<br/>"
 #       f"api/v1.0/<start><br/>"
 #       f"/api/v1.0/<start>/<end>"

    )


@app.route("/api/v1.0/precipitation")
def precipitation():
    """  * Query for the dates and temperature observations from the last year.

  * Convert the query results to a Dictionary using `date` as the key and `tobs` as the value.

  * Return the json representation of your dictionary."""
    
    start_period = dt.date.today() - dt.timedelta(days=365)
    end_period = dt.date.today() 

    sel = [Measurements.date, 
       Measurements.prcp]
    results = session.query(*sel).\
    filter(Measurements.date > start_period).\
    filter(Measurements.date < end_period).\
    group_by(Measurements.date).\
    order_by(Measurements.date.asc()).all()

    # Create a dictionary from the row data and append to a list of temperatures
    all_dates = []
    for date in results:
        date_dict = {}
        date_dict["date"] = date.date
        date_dict["precipation"] = date.prcp
        all_dates.append(date_dict)

    return jsonify(all_dates)

@app.route("/api/v1.0/stations")
def stations():
    """  /api/v1.0/stations`

  * Return a json list of stations from the dataset."""

    # List all of the station name found in the station table
    results = session.query(Stations)

    # Create a dictionary from the row data and append to a list of stations
    all_stations = []
    for station in results:
        station_dict = {}
        station_dict["station_name"] = station.name
        all_stations.append(station_dict)

    return jsonify(all_stations)    

@app.route("/api/v1.0/tobs")
def tobs():
    """  * Query for the dates and temperature observations from the last year.

  * Convert the query results to a Dictionary using `date` as the key and `tobs` as the value.

  * Return the json representation of your dictionary."""
    
    start_period = dt.date.today() - dt.timedelta(days=365)
    end_period = dt.date.today() 

    sel = [Measurements.date, 
       Measurements.tobs]
    results = session.query(*sel).\
    filter(Measurements.date > start_period).\
    filter(Measurements.date < end_period).\
    group_by(Measurements.date).\
    order_by(Measurements.date.asc()).all()

    # Create a dictionary from the row data and append to a list of temperatures
    all_dates = []
    for date in results:
        date_dict = {}
        date_dict["date"] = date.date
        date_dict["temperature"] = date.tobs
        all_dates.append(date_dict)

    return jsonify(all_dates)


@app.route("/api/v1.0/<start>")
def start(start):
    """  * `/api/v1.0/<start>`

  * Return a json list of the minimum temperature, the average temperature, and the max temperature for a given start or start-end range.

  * When given the start only, calculate `TMIN`, `TAVG`, and `TMAX` for all dates greater than and equal to the start date.""" 

    min_temp, = session.query(func.min(Measurements.tobs).label("min_temp")).\
    filter(Measurements.date > start).all()
    
    max_temp, = session.query(func.max(Measurements.tobs).label("max_temp")).\
    filter(Measurements.date > start).all()
    
    avg_temp, = session.query(func.avg(Measurements.tobs).label("avg_temp")).\
    filter(Measurements.date > start).all()

    # Create a dictionary from the row data and append to a list of temperatures
    temp_list = []
    date_dict = {}
    date_dict["start_date"] = start
    date_dict["min_temp"] = min_temp[0]
    date_dict["max_temp"] = max_temp[0]
    date_dict["avg_temp"] = avg_temp[0]
    temp_list.append(date_dict)

    return jsonify(temp_list)


@app.route("/api/v1.0/<start>/<end>")
def start_end(start, end):
    """  * `/api/v1.0/<start>/<end>`

  * Return a json list of the minimum temperature, the average temperature, and the max temperature for a given start or start-end range.

  * When given the start and the end date, calculate the `TMIN`, `TAVG`, and `TMAX` for dates between the start and end date inclusive.""" 

    min_temp, = session.query(func.min(Measurements.tobs).label("min_temp")).\
    filter(Measurements.date > start).\
    filter(Measurements.date < end).all()
    
    max_temp, = session.query(func.max(Measurements.tobs).label("max_temp")).\
    filter(Measurements.date > start).\
    filter(Measurements.date < end).all()
    
    avg_temp, = session.query(func.avg(Measurements.tobs).label("avg_temp")).\
    filter(Measurements.date > start).\
    filter(Measurements.date < end).all()

    print(min_temp[0])

    # Create a dictionary from the row data and append to a list of temperatures
    temp_list = []
    date_dict = {}
    date_dict["start_date"] = start
    date_dict["end_date"] = end
    date_dict["min_temp"] = min_temp[0]
    date_dict["max_temp"] = max_temp[0]
    date_dict["avg_temp"] = avg_temp[0]
    temp_list.append(date_dict)

    return jsonify(temp_list)

if __name__ == "__main__":
    app.run(debug=True)