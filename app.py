# Import Dependencies
import os

import pandas as pd
import numpy as np
import sqlite3

import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy


# Import modules to declare columns and column data types
from sqlalchemy import Column, Integer, String, Float, BIGINT


app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///assets/db/us_energy.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Final_Combine_Table = Base.classes.final_combine_table
State_Coordinates = Base.classes.state_coordinates


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/states")
def states():
    """Return a list of sample names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(State_Coordinates).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (sample names)
    return jsonify(list(df.columns)[1:])


@app.route("/finalstable/<states>")
def sample_metadata(sample):
    """Return the MetaData for a given sample."""
    sel = [
        Final_Combine_Table.State,
        Final_Combine_Table.Year,
        Final_Combine_Table.Total_co2_emission,
        Final_Combine_Table.Average_Price,
        Final_Combine_Table.Price_Unit,
        Final_Combine_Table.resident_population,
        Final_Combine_Table.Pop_Unit,
        Final_Combine_Table.Total_energy,
        Final_Combine_Table.ENERGY_Unit,
        Final_Combine_Table.Total_renewable_energy,
        Final_Combine_Table.Renew_Unit,

    ]

    results = db.session.query(*sel).filter(Final_Combine_Table.sample == sample).all()

    # Create a dictionary entry for each row of metadata information
    sample_metadata = {}
    for result in results:
        sample_metadata["sample"] = result[0]
        sample_metadata["ETHNICITY"] = result[1]
        sample_metadata["GENDER"] = result[2]
        sample_metadata["AGE"] = result[3]
        sample_metadata["LOCATION"] = result[4]
        sample_metadata["BBTYPE"] = result[5]
        sample_metadata["WFREQ"] = result[6]

    print(sample_metadata)
    return jsonify(sample_metadata)


@app.route("/samples/<sample>")
def samples(sample):
    """Return `otu_ids`, `otu_labels`,and `sample_values`."""
    stmt = db.session.query(State_Coordinates).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Filter the data based on the sample number and
    # only keep rows with values above 1
    sample_data = df.loc[df[sample] > 1, ["otu_id", "otu_label", sample]]
    sample_data.sort_values(by=sample, inplace=True, ascending=False)
    # Format the data to send as json
    data = {
        "otu_ids": sample_data.otu_id.values.tolist(),
        "sample_values": sample_data[sample].values.tolist(),
        "otu_labels": sample_data.otu_label.tolist(),
    }
    return jsonify(data)


if __name__ == "__main__":
    app.run()
