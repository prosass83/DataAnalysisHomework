# import necessary libraries
import datetime as dt
import numpy as np
import pandas as pd

from flask import (
    Flask,
    render_template,
    jsonify,
    request)

from flask_sqlalchemy import SQLAlchemy

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#Reading CSV files with Pandas for now
# Save file path to variable
samples_file = "db/belly_button_biodiversity_samples.csv"


#################################################
# Routes
#################################################

@app.route("/otu")
def otu():
    otu_file = "db/belly_button_biodiversity_otu_id.csv"
    otu_pd = pd.read_csv(otu_file)
    otu_pd = otu_pd.set_index('otu_id')
    otu_df_list = otu_pd.values.tolist()
        

    data = []
    for item in otu_df_list:
        data.append({
            "lowest_taxonomic_unit_found": otu_df_list[0]
            })

    return jsonify(data)

@app.route("/metadata/<sample>")
def metadata(sample):
    metadata_file = "db/Belly_Button_Biodiversity_Metadata.csv"
    metadata_pd = pd.read_csv(metadata_file)
    #Remove beginning of string (BB_) 
    sample_int = int(sample[3:])
    sample_element = metadata_pd[metadata_pd['SAMPLEID'] == sample_int]
    metadata_list = sample_element.values.tolist()
    
        
    data = []
    for item in metadata_list:
        data.append({
            "SAMPLEID": item[0],
            "ETHNICITY": item[2],
            "GENDER": item[3],
            "AGE": item[4],
            "BBTYPE": item[7],
            "LOCATION": item[8]
            })

    return jsonify(data)

@app.route("/wfreq/<sample>")
def wfreq(sample):
    metadata_file = "db/Belly_Button_Biodiversity_Metadata.csv"
    metadata_pd = pd.read_csv(metadata_file)
    #Remove beginning of string (BB_) 
    sample_int = int(sample[3:])
    sample_element = metadata_pd[metadata_pd['SAMPLEID'] == sample_int]
    metadata_list = sample_element.values.tolist()
        
    data = []
    for item in metadata_list:
        data.append({
            "WFREQ": item[5]
            })
    #    wfreq_value = item[5]

    return jsonify(data)

@app.route("/samples/<sample>")
def samples_otu(sample):
    otu_file = "db/belly_button_biodiversity_samples.csv"
    otu_pd = pd.read_csv(otu_file)
    
    #Removing zeros 
    sample_otu_df = otu_pd[otu_pd[sample] > 0]
    filtered_df = sample_otu_df[['otu_id',sample]]
    sorted_df = filtered_df.sort_values(by=sample, ascending = False).reset_index()
    sorted_df = sorted_df[['otu_id',sample]]

    #Transposing and converting the two rows into a list, gives us something like this
    #[[1167.0,
    #    2859.0,
    #    482.0,
    #       ...
    #      3453.0],
    #      [163.0,
    #      126.0,
    #      113.0,
    #       ...]
    #This is still not a dictionary as the readme says. Figure out how to do that
    sorted_df = sorted_df.transpose()
    sorted_df_list = sorted_df.values.tolist()

    #Incomplete
    return jsonify(data)

@app.route("/")
def home():
    return "Welcome!"

if __name__ == "__main__":
    app.run()
