// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
function init(){
d3.json("././samples.json").then((samplesData) => {
    console.log(samplesData);
    var data = samplesData;
    var selector = d3.select("#selDataset");
    var names= data.names;
    names.forEach((id) =>{
        selector.append("option")
                .text(id)
                .property("value",id);
    });
// Use the first subject ID from the names to build initial plots
const firstSubject = names[0];
updateCharts(firstSubject);
updateMetadata(firstSubject);
});

}
function updateMetadata(sample) {
    d3.json("././data/samples.json").then((data) => {
        var metadata = data.metadata;
        var filterSample = metadata.filter(sampleObject => sampleObject.id == sample);
        var result = filterSample[0];
        console.log(result);
        var metaPanel = d3.select("#sample-metadata");
        metaPanel.html("");
        Object.entries(result).forEach(([key, value]) => {
            metaPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
        })

    // Data for Gauge Chart
  var data = [
    {
      domain: { x: [0,1], y: [0,1] },
      marker: {size: 28, color:'850000'},
      value: result.wfreq,
      //name:"gauge",
      //labels:[0-1,1-2,2-3],
      title: 'Belly Button Washing Frequency<br> Scrubs per Week',
      titlefont: {family: '"Palatino Linotype", "Book Antiqua", Palatino, serif'},
      type: "indicator",
      mode: "gauge+number",
      gauge: { axis: { range: [0, 9] } }
  }
    
  ];
  // Layout for Gauge Chart

  var layout = {
    width: 450,
     height: 400,
     margin: { t: 25, r: 25, l: 25, b: 25 },
     line: {
     color: '600000'
     },
     //paper_bgcolor: "#a5bdc6",
     font: { color: "#85541d", family: "Serif" }
   };

  
  Plotly.newPlot("gauge", data, layout);

    });
}
function updateCharts(sample){
    d3.json("../../../data/samples.json").then((data) => {
        var samples = data.samples;
        var filteredSample = samples.filter(sampleObject => sampleObject.id == sample);
        var result = filteredSample[0];
        console.log(result);
        var otu_ids=result.otu_ids;
        console.log(otu_ids);
        var sample_values=result.sample_values;
        var otu_labels=result.otu_labels;

        // bar chart
        var trace1 = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            name: "OTU",
            type: "bar",
            orientation: "h"
        };
        var data = [trace1];
        var layout = {
            title: "Top Ten OTUs for Individual " + sample,
            margin: {l: 100, r: 100, t: 100, b: 100}
        };
        Plotly.newPlot("bar", data, layout);  


        // bubble chart
        

        var trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
              color: otu_ids,
              size: sample_values 
            }
          };
          
          var data = [trace1];
          
          var layout = {
            title: 'Bacteria Cultures per Sample',
            showlegend: false,
            //hovermode: 'closest',
            xaxis: {title:"OTU (Operational Taxonomic Unit) ID " +sample},
            height: 600,
            width: 1200
          };
          
          Plotly.newPlot("bubble", data, layout);
    });
}
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    updateCharts(newSample);
    updateMetadata(newSample);
  }
  

// Initialize the dashboard
init();