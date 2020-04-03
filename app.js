function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

  d3.json("samples.json").then((importedData) => {
    console.log(importedData)
    var metaSamples = importedData.metadata;
    var resultarray = metaSamples.filter(sampleObj => sampleObj.id == sample)
    resultarray = resultarray[0]
    console.log(resultarray )
    var panel_meta = d3.select("#sample-metadata");
    panel_meta.html("");
    Object.entries(resultarray).forEach(([key, value])=> {
      panel_meta.append("div").text(`${key}: ${value}`)
    })
  })
} 

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("samples.json").then((importedData) => {
    console.log(importedData)
    var sortedSamples = importedData.samples;
    var resultarray = sortedSamples.filter(sampleObj => sampleObj.id == sample)
    resultarray = resultarray[0]
    console.log(resultarray)
    var otu_ids = resultarray.otu_ids
    var otu_labels = resultarray.otu_labels
    var otu_values = resultarray.sample_values

    var y_axis = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse()
    var bar_data = [
    {
      y: y_axis,
      x: otu_values.slice(0,10).reverse(),
      type: 'bar',
      orientation: 'h'
    }
    ]

    Plotly.newPlot('bar', bar_data);


    var bubble_layout = {
      title: "OTU bubble graph",

    }

    var bubble_trace = {
      x: otu_ids,
      y: otu_values,
      mode: 'markers',
      marker: {
      color: otu_ids,
      opacity: [0.8],
      size: otu_values
      }
    }

    var bubble_data = [bubble_trace];

    Plotly.newPlot('bubble', bubble_data, bubble_layout);

  })
    // 
    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();