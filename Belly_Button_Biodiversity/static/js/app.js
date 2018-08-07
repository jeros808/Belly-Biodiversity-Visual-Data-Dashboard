
function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
  var selected_sample = d3.select("#selDataset").property("value");
    // Use d3 to select the panel with id of `#sample-metadata`
  var samp_metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    samp_metadata.html("")
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json(`/metadata/${selected_sample}`).then((sampleMD)=> {
      Object.entries(sampleMD).forEach( (entry, index) => {
         samp_metadata
          .append("div")
          .classed(`${entry[0]}`,true)
          .text(`${entry[0]}: ${entry[1]}`)
          .enter()
      })
    buildGauge(sampleMD.WFREQ)
    }
  );
};
function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`samples/${sample}`).then(function(data) {
    console.log(data)
    // @TODO: Build a Bubble Chart using the sample data
  var trace1 = {
    x: data.otu_ids,
    y: data.sample_values,
    text: data.otu_labels,
    mode: 'markers',
    marker: {
      size: data.sample_values,
      sizeref: 0.2,
      sizemode: 'area'
    }
  };
  var bubbledata = [trace1]
  var layout = {
    title: 'OTUs per Sampled data',
    showlegend: false,
    height: 550px,
    width: 100%,
  }
  Plotly.newPlot('bubble',bubbledata,layout);
   // @TODO: Build a Pie Chart
   // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  var sliced_otu_ids = data.otu_ids.slice(0,10)
  var sliced_otu_labels = data.otu_labels.slice(0,10)
  var sliced_sample_values = data.sample_values.slice(0,10)
  var data = [{
    values: sample_values,
    labels: otu_ids,
    type: 'pie'
  }];
  var layout = {
    height: 500,
    width: 500,
    title: "OTU Samples ${sample}"
  };
  Plotly.newPlot('pie', data, layout);
});
}
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    const firstSample = sampleNames[0];
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