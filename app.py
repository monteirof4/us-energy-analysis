import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///static/db/us_energy.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)
#print(Base.classes.keys())

# Save references to each table
Energy_Data = Base.classes.final_combine_table
state_coordinates = Base.classes.state_coordinates


@app.route("/")
def index():
   """Return the homepage."""
   return render_template("index.html")

@app.route("/linegraph")
def linegraph():
   """Line chart page."""
   return render_template("lineGraph.html")

@app.route("/streamgraph")
def streamgraph():
   """Stream chart page."""
   return render_template("streamGraph.html")

@app.route("/heatmap")
def heatmap():
   """Heatmap chart page."""
   return render_template("heatMaps.html")

@app.route("/scatter")
def scatter():
   """Heatmap chart page."""
   return render_template("scatterPlot.html")


@app.route("/states")
def names():
   """Return a list of states abbreviation."""
   sel = [
       state_coordinates.Abbreviation,
       state_coordinates.Latitude,
       state_coordinates.Longitude,
       state_coordinates.US_State
   ]

   results = db.session.query(*sel).all()

   states_list = []

   for result in results:
       states_data = {}
       states_data["Abbreviation"] = result[0]
       states_data["Latitude"] = str(result[1])
       states_data["Longitude"] = str(result[2])
       states_data["US_State"] = result[3]
       
       states_list.append(states_data)

   # Return a list of the column names (sample names)
   print(states_list)
   return jsonify(states_list)


@app.route("/energy_data/<state>")
def energy_data(state):
   """Return the MetaData for a given sample."""
   sel = [
       Energy_Data.State,
       Energy_Data.Year,
       Energy_Data.Total_co2_emission,
       Energy_Data.Average_Price,
       Energy_Data.Average_resident_population,
       Energy_Data.Total_energy,
       Energy_Data.Total_renewable_energy,
   ]

   results = db.session.query(*sel).filter(Energy_Data.State == state).all()
   #print(results)

   # Create a dictionary entry for each row of metadata information
   energy_data_list = []

   for result in results:
       energy_data = {}
       energy_data["State"] = result[0]
       energy_data["Year"] = result[1]
       energy_data["Total_co2_emission"] = str(result[2])
       energy_data["Average_Price"] = str(result[3])
       energy_data["Average_resident_population"] = str(result[4])
       energy_data["Total_energy"] = str(result[5])
       energy_data["Total_renewable_energy"] = str(result[6])
       energy_data_list.append(energy_data)

   #print(energy_data_list)
   return jsonify(energy_data_list)

@app.route("/energy_data_year/<year>")
def energy_data_year(year):
   """Return the MetaData for a given sample."""
   sel = [
       Energy_Data.State,
       Energy_Data.Year,
       Energy_Data.Total_co2_emission,
       Energy_Data.Average_Price,
       Energy_Data.Average_resident_population,
       Energy_Data.Total_energy,
       Energy_Data.Total_renewable_energy,
   ]

   results = db.session.query(*sel).filter(Energy_Data.Year == year).all()
   #print(results)

   # Create a dictionary entry for each row of metadata information
   energy_data_list = []

   for result in results:
       energy_data = {}
       energy_data["State"] = result[0]
       energy_data["Year"] = result[1]
       energy_data["Total_co2_emission"] = str(result[2])
       energy_data["Average_Price"] = str(result[3])
       energy_data["Average_resident_population"] = str(result[4])
       energy_data["Total_energy"] = str(result[5])
       energy_data["Total_renewable_energy"] = str(result[6])
       energy_data_list.append(energy_data)

   #print(energy_data_list)
   return jsonify(energy_data_list)

@app.route("/energy_data_metric/<metric>")
def energy_data_metric(metric):
   """Return the MetaData for a given sample."""
   year = 2016

   sel = [
        Energy_Data.State
   ]

   states = db.session.query(*sel).filter(Energy_Data.Year == year, Energy_Data.State != "US").order_by(f"final_combine_table.{metric} desc").all()
   
   top5_states = []

   for i in range(5):
      top5_states.append(states[i][0])

   sel = [
        Energy_Data.State,
        Energy_Data.Year,
        f"final_combine_table.{metric}"
   ]

   results = db.session.query(*sel).filter(Energy_Data.State.in_(top5_states)).all()


   # Create a dictionary entry for each row of metadata information
   energy_data_list = []

   for result in results:
       energy_data = {}
       energy_data["State"] = result[0]
       energy_data["Year"] = result[1]
       energy_data[metric] = str(result[2])

       energy_data_list.append(energy_data)

   # print(energy_data_list)
   return jsonify(energy_data_list)


if __name__ == "__main__":
   app.run()