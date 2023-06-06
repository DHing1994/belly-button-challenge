let url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(url).then(function (data) {
  let samples = data.samples;
  let title = "Top 10 Bacteria Values in Test Subject";
  let top10Data = {};
  let totalData = {};

  samples.forEach((sample) => {
    let totalValues = [];
    let totalIDs = [];
    let totalLabels = [];
    let sortingArray = [];
    for (let i = 0; i < sample.sample_values.length; i++) {
      totalValues.push(sample.sample_values[i]);
      totalIDs.push(sample.otu_ids[i]);
      totalLabels.push(sample.otu_labels[i]);
      sortingArray.push({
        sampleValues: sample.sample_values[i],
        label: "OTU " + sample.otu_ids[i],
        hovertext: sample.otu_labels[i],
      });
    }

    sortingArray.sort(function (a, b) {
      return b.sampleValues - a.sampleValues;
    });

    let top10Array = sortingArray.slice(0, 10);
    let top10Values = [];
    let top10ids = [];
    let top10labels = [];
    top10Array.forEach((thing) => {
      top10Values.push(thing.sampleValues);
      top10ids.push(thing.label);
      top10labels.push(thing.hovertext);
    });
    top10Data[sample.id] = { y: top10ids, x: top10Values, labels: top10labels };
    totalData[sample.id] = { y: totalIDs, x: totalValues, labels: totalLabels };
  });

  let trace1 = {
    x: top10Data["940"].x,
    y: top10Data["940"].y,
    orientation: "h",
    hovertext: top10Data["940"].labels,
    type: "bar",
  };
  let graphdata = [trace1];
  let layout = {
    yaxis: { autorange: "reversed" },
    title: title,
  };
  Plotly.newPlot("bar", graphdata, layout);
  let dropdown = d3.select("#selDataset");
  Object.keys(top10Data).forEach((element) => {
    dropdown.append("option").attr("value", element).text(element);
  });

  function div3(num) {
    return num / 3;
  }

  let trace2 = {
    x: totalData["940"].y,
    y: totalData["940"].x,
    mode: "markers",
    hovertext: totalData["940"].labels,
    marker: {
      size: totalData["940"].x.map(div3),
      color: totalData["940"].y,
      colorscale: "Portland",
    },
  };
  let markerdata = [trace2];
  let metaDataContainer = d3.select("#sample-metadata");
  let metadata = data.metadata.find((element) => element.id == "940");
  metaDataContainer.html("");
  Object.keys(metadata).forEach((element) => {
    metaDataContainer.append("div").text(element + ": " + metadata[element]);
  });

  Plotly.newPlot("bubble", markerdata);
  // Call updatePlotly() when a change takes place to the DOM
  dropdown.on("change", updatePlotly);
  // This function is called when a dropdown menu item is selected
  function updatePlotly() {
    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    let dataset = dropdownMenu.property("value");

    // Initialise x and y arrays
    let top10x = top10Data[dataset].x;
    let top10y = top10Data[dataset].y;
    let top10text = top10Data[dataset].labels;
    let x = totalData[dataset].y;
    let y = totalData[dataset].x;
    let text = totalData[dataset].totalLabels;

    Plotly.restyle("bar", "x", [top10x]);
    Plotly.restyle("bar", "y", [top10y]);
    Plotly.restyle("bar", "hovertext", [top10text]);

    Plotly.restyle("bubble", "x", [x]);
    Plotly.restyle("bubble", "y", [y]);
    Plotly.restyle("bubble", "hovertext", [text]);

    let metaDataContainer = d3.select("#sample-metadata");
    let metadata = data.metadata.find((element) => element.id == dataset);
    metaDataContainer.html("");
    Object.keys(metadata).forEach((element) => {
      metaDataContainer.append("div").text(element + ": " + metadata[element]);
    });
  }
});
