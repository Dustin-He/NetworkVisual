"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function draw_pict2(esti_data, real_data, ids) {
  var config = {
    barPadding: 0.2,
    margins: {
      top: 80,
      left: 80,
      bottom: 50,
      right: 80
    },
    textColor: 'black',
    gridColor: 'gray',
    tickShowGrid: [60, 120, 180],
    title: '堆叠直方图',
    hoverColor: 'white',
    animateDuration: 1000,
    width: 640,
    height: 500,
    barWidth: 10,
    offsetX: 10
  };
  var hist_num = esti_data[ids[0]].length;

  var _process_data = process_data(esti_data, real_data, ids, hist_num),
      _process_data2 = _slicedToArray(_process_data, 2),
      esti_hist = _process_data2[0],
      real_hist = _process_data2[1];

  draw_graph(esti_hist, real_hist, hist_num);

  function process_data(esti_data, real_data, ids, hist_num) {
    var esti_hist = new Array(hist_num).fill(0);
    var real_hist = new Array(hist_num).fill(0);
    ids.forEach(function (id) {
      esti_data[id].forEach(function (item, index) {
        esti_hist[index] += item;
      });
      real_data[id].forEach(function (item, index) {
        real_hist[index] += item;
      });
    });
    var num = ids.length;
    esti_hist.forEach(function (item, index, array) {
      array[index] = item / num;
    });
    real_hist.forEach(function (item, index, array) {
      array[index] = item / num;
    });
    return [esti_hist, real_hist];
  }

  function draw_graph(esti_hist, real_hist, hist_num) {
    var scale_x = d3.scaleBand().domain(Array.from({
      length: hist_num
    }).map(function (v, k) {
      return k;
    })) //生成元素是0到hist_num-1的数组
    .range([0, config.width - config.margins.left - config.margins.right]).padding(config.barPadding);
    var scale_y = d3.scaleLinear().domain([0, d3.max([d3.max(esti_hist), d3.max(esti_hist)])]).range([config.height - config.margins.top - config.margins.bottom, 0]);
    var svg = d3.select("#pict2").append("svg").attr("width", config.width).attr("height", config.height);
    var esti_bars = svg.append("g").selectAll("rect").data(esti_hist).enter().append("rect").attr("x", function (d, idx) {
      return config.margins.left + scale_x(idx);
    }).attr("y", function (d, idx) {
      return config.margins.top + scale_y(d);
    }).attr("width", config.barWidth).attr("height", function (d) {
      return config.height - config.margins.top - config.margins.bottom - scale_y(d);
    }).attr("fill", "red");
    var real_bars = svg.append("g").selectAll("rect").data(esti_hist).enter().append("rect").attr("x", function (d, idx) {
      return config.margins.left + scale_x(idx) + config.offsetX;
    }).attr("y", function (d, idx) {
      return config.margins.top + scale_y(d);
    }).attr("width", config.barWidth).attr("height", function (d) {
      return config.height - config.margins.top - config.margins.bottom - scale_y(d);
    }).attr("fill", "blue");
    var axis_left = d3.axisLeft(scale_y);
    svg.append('g').attr('transform', "translate(".concat(config.margins.left, ", ").concat(config.margins.top, ")")).call(axis_left);
    var axis_bottom = d3.axisBottom(scale_x);
    svg.append("g").attr("transform", "translate(".concat(config.margins.left, ", ").concat(config.height - config.margins.bottom, ")")).call(axis_bottom);
  }
}