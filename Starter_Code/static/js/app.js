let url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(url).then(function (data) {
  // console.log(data);

  let samples = data.samples;
  // console.log(samples);
  let sampleValues = [];
  let labels = [];
  let hovertext = [];
  let title = "Top 10 Bacteria Values in Test Subject";
  let totaldata = {};
  // samples.forEach((sample) => {
  //   sampleValues.push(sample.sample_values);
  //   labels.push(sample.otu_ids);
  //   hovertext.push(sample.otu_labels);
  // });
  samples.forEach((sample) => {
    let sortingArray = [];
    for (let i = 0; i < sample.sample_values.length; i++) {
      sortingArray.push({
        sampleValues: sample.sample_values[i],
        label: "OTU " + sample.otu_ids[i],
        hovertext: sample.otu_labels[i],
      });
    }
    sortingArray.sort(function (a, b) {
      return b.sampleValues - a.sampleValues;
    });
    // console.log(sortingArray);
    let top10Array = sortingArray.slice(0, 10);
    // console.log(top10Array);
    let top10Values = [];
    let top10ids = [];
    let top10labels = [];
    top10Array.forEach((thing) => {
      top10Values.push(thing.sampleValues);
      top10ids.push(thing.label);
      top10labels.push(thing.hovertext);
    });
    totaldata[sample.id] = { y: top10ids, x: top10Values, labels: top10labels };
  });
  console.log(totaldata);
  let trace1 = {
    x: totaldata["1236"].x,
    y: totaldata["1236"].y,
    orientation: "h",
    type: "bar",
  };
  let graphdata = [trace1];
  let layout = {
    yaxis: { autorange: "reversed" },
    title: title,
  };

  Plotly.newPlot("bar", graphdata, layout);

  let dropdown = d3.select("#selDataset");
  Object.keys(totaldata).forEach((element) => {
    dropdown.append("option").attr("value", element).text(element);
  });

  // Call updatePlotly() when a change takes place to the DOM
  dropdown.on("change", updatePlotly);

  // This function is called when a dropdown menu item is selected
  function updatePlotly() {
    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    let dataset = dropdownMenu.property("value");
    // Initialise x and y arrays
    let x = totaldata[dataset].x;
    let y = totaldata[dataset].y;

    // Note the extra brackets around 'x' and 'y'
    Plotly.restyle("bar", "x", [x]);
    Plotly.restyle("bar", "y", [y]);
  }
});
