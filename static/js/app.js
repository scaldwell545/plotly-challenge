///////////// Initialization function (made this last but moved to first function for clarity's sake)
function init() {
    
    // Select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    
    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");
    
    // append into dropdown
    d3.json('samples.json').then(data=>{
        data.names.forEach(function(name) {
            dropdownMenu.append("option").text(name).property("value");
        });
        
        // initialize the first value on startup
        let tempid = data.names[0];
        plots(tempid);
        metadata(tempid);
        
    });
    
};



///////////// This function is called when a dropdown menu item is selected (given in index)
function optionChanged(selectedID) {
    plots(selectedID);
    metadata(selectedID);
};




///////////// This function creates our plots
function plots(id){

    d3.json('samples.json').then(data=>{
        
        ///////////// Create the horizontal bar chart
        
        //get data for one individual according to selected ID
        var findID = data.samples.filter(sampleObject => sampleObject.id == id);
        let otuData = findID[0];
        console.log(otuData);
        
        // data is already sorted (good) so we just need to slice
        
        // get top 10 sample values
        let slicedData = otuData['sample_values'].slice(0,10).reverse();
        console.log(slicedData);
        // get top 10 ids
        let slicedIDs = otuData['otu_ids'].slice(0,10).reverse();
        // need otu to be in string format for graphing purposes
        let ids = slicedIDs.map(id => "OTU " + id);
        console.log(ids);
        // get top 10 labels
        let slicedLabels = otuData['otu_labels'].slice(0,10).reverse();
        console.log(slicedLabels);
        
        // now we can plot
        let trace1 = {
            'x' : slicedData,
            'y' : ids,
            'text' : slicedLabels,
            'type' : "bar",
            'orientation' : "h"
        }
        let traceData1 = [trace1];
        let layout1 = {
            title: `Top 10 OTUs for Test Subject ${id}`,
            automargin: true,
            autosize: true
        };
        Plotly.newPlot("bar", traceData1, layout1);

        
        ///////////// Create the bubble chart
        
        // we already have the data queued up (otuData)
        // so let's plot
        let trace2 = {
            'x' : otuData['otu_ids'],
            'y' : otuData['sample_values'],
            'text' : otuData['otu_labels'],
            'type' : "bubble",
            'mode' : 'markers',
            'marker' : {
                'size' : otuData['sample_values'],
                'color' : otuData['otu_ids'],
                'colorscale' : 'Earth'
            }
        }
        let traceData2 = [trace2];
        let layout2 = {
            title: `OTUs for Test Subject ${id}`,
            showlegend: false,
            automargin: true,
            autosize: true
        };
        Plotly.newPlot("bubble", traceData2, layout2);
        
        
        
        ///////////// BONUS: Create the gauge chart
        var data2 = [
            {
                    "values": [50, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9],
                    "labels": [" ", "0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"],
                    "marker": {
                        'colors': [
                            'rgb(255, 255, 255)',
                            "rgba(240, 230, 215, .5)",
                            "rgba(232, 226, 202, .5)",
                            "rgba(210, 206, 145, .5)",
                            "rgba(202, 209, 95, .5)",
                            "rgba(170, 202, 42, .5)",
                            "rgba(110, 154, 22, .5)",
                            "rgba(14, 127, 0, .5)",
                            "rgba(10, 120, 22, .5)",
                            "rgba(0, 105, 11, .5)"
                        ],
                        "line": {
                            "width": 0
                        }
                    },
                    "domain": {"x": [0, 1],  "y":[0,1]},
                    "name": "Gauge",
                    "hole": .3,
                    "type": "pie",
                    "direction": "clockwise",
                    "rotation": 90,
                    "showlegend": false,
                    "textinfo": "label",
                    "textposition": "inside",
                    "hoverinfo": "none"
            }];
        
        // get the number of belly button washes for this subject
        let bellybuttonwashes = data.metadata.filter(subID => subID.id == id)[0]['wfreq'];
        console.log(bellybuttonwashes);
        let theta = 0;
        
        // This function returns the desired angle to determine the direction of the arrow annotation
        function getangle(washes) {
            if (washes >= 9){
                return theta = 33.5;
            } else if (washes >= 8){
                return theta = 45;
            } else if (washes >= 7){
                return theta = 55;
            } else if (washes >= 6){
                return theta = 68;
            } else if (washes >= 5){
                return theta = 81;
            } else if (washes >= 4){
                return theta = 97;
            } else if (washes >= 3){
                return theta = 112;
            } else if (washes >= 2){
                return theta = 125;
            } else if (washes >= 1){
                return theta = 135;
            } else {
                return theta = 146;
            }
        }
        
        //call the function to get a theta value
        getangle(bellybuttonwashes);
        
        //calc where the arrow should point to 
        let x_head = 0.9 * Math.cos(theta*(Math.PI/180));
        let y_head = 0.9 * Math.sin(theta*(Math.PI/180));
        
        
        // Add layout, arrow annotation, and plot
        var layout3 = { 
            'title' : "Belly Button Washing Frequency<br>Scrubs per Week",
            'xaxis': {
                'showticklabels': false,
                'showgrid': false,
                'zeroline': false,
                'range': [-1, 1]
            },
            'yaxis': {
                'showticklabels': false,
                'showgrid': false,
                'zeroline': false,
                'range': [0, 1]
            },
            'annotations': [
                {
                    'ax' : 0,
                    'ay' : 0.5,
                    'axref' : 'x',
                    'ayref' : 'y',
                    'x' : x_head,
                    'y' : y_head,
                    'xref' : 'x',
                    'yref' : 'y',
                    'showarrow' : true,
                    'arrowhead' : 2,
                    'arrowsize' : 2,
                    'arrowwidth' : 1
                }
            ],
            automargin:true,
            autosize:true
        };
        Plotly.newPlot('gauge', data2, layout3);
        
        
    });

};




///////////// Display the sample metadata 

// introduce function for gathering + inserting metadata to table
function metadata(id) {
    
    d3.json('samples.json').then(data=>{
        console.log(data);
        
        // get all metadata for an individual via filtering by selected id
        let subjectMetadata = data.metadata.filter(subID => subID.id == id)[0];
        console.log(subjectMetadata);
        
        //need to empty the container each time this is called, otherwise the data will just be tacked on the end (append)
        d3.select("#sample-metadata").html("");
        
        // shove into html
        Object.entries(subjectMetadata).forEach(([subject, value]) => {   
            d3.select("#sample-metadata").append("h5").text(subject.toUpperCase() + ": " + value + "\n");               
        });
        
    });

};



///////////// call initialization function on startup
init();
