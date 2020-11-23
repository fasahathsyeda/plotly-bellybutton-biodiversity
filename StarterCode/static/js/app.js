// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
function init(){
d3.json("../../../data/samples.json").then((samplesData) => {
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
    d3.json("../../../data/samples.json").then((data) => {
        var metadata = data.metadata;
        var filterArray = metadata.filter(sampleObject => sampleObject.id == sample);
        var result = filterArray[0];
        console.log(result);
        var metaPanel = d3.select("#sample-metadata");
        metaPanel.html("");
        Object.entries(result).forEach(([key, value]) => {
            metaPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
        })

    });
}
function updateCharts(sample){
    d3.json("../../../data/samples.json").then((data) => {
        var samples = data.samples;
        var filteredSample = samples.filter(sampleObject => sampleObject.id == sample);
        var result = filteredSample[0];
        console.log(result);
        var otu_ids=result.otuids;
        var sample_values=result.sample_values;
        var otu_labels=result.otu_labels;

        // bar chart
        var trace1 = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            name: "Greek",
            type: "bar",
            orientation: "h"
        };
        var data = [trace1];
        var layout = {
            title: "Top Ten OTUs for Individual " +sample,
            margin: {l: 100, r: 100, t: 100, b: 100}
        };
        Plotly.newPlot("bar", data, layout);  


      
        
    });
}

  


init();