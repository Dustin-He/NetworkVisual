// let estimated_data = null;
// let ht_data = null;
// let heavy_cm_data = null;
// let light_cm_data = null;
// let real_data = null;
// let flt_data = null;
const color_set = ["#56B4E9", "#009E73", "#999999", "#1E2262", "#E69F00", "#2267A8", "#D55E00"];
let d2 = null;
let gdata;
let width = document.body.clientWidth;
let height = document.body.clientHeight;
let filtered_data;
(function main() {

    return () => {
        read_data().then((data) => {
            // console.log(estimated_data);
            // gdata = data;
            process_data(data)
            gdata = data;
            filtered_data = data;
            // data = data.filter((ele, index, array) => {
            //     if (ele["ARE"] > 3) {
            //         return true;
            //     }
            //     return false;
            // })
            // console.log(data)


            // console.log(data)
            draw_scatter(data)
            draw_hist(data)

            d3.select("#maxSizeText")
                .on("input", function () {
                    if (this.value === "") {
                        draw_scatter(filtered_data);
                    } else {
                        draw_scatter(filtered_data, parseInt(this.value))
                    }
                })

            d3.select("#areText")
                .on("input", function () {
                    if (this.value === "") {
                        // draw_scatter(data);
                        let new_data = gdata;
                        draw_scatter(new_data);
                        draw_hist(new_data);
                    } else {
                        let ARE = parseFloat(this.value);
                        filtered_data = gdata.filter((ele) => {
                            if (ele["ARE"] > ARE) {
                                return true;
                            }
                            return false;
                        })
                        draw_scatter(filtered_data);
                        draw_hist(filtered_data);
                    }
                })


        });
    }
    function read_data() {
        return Promise.all([
            d3.json("data/estimated_ans.json"),
            d3.json("data/fourLT.json"),
            d3.json("data/hash_table.json"),
            d3.json("data/heavy_cm.json"),
            d3.json("data/light_cm.json"),
            d3.json("data/real_ans.json"),
        ]).then((files) => {
            let estimated_data = files[0];
            let flt_data = files[1];
            let ht_data = files[2];
            let heavy_cm_data = files[3];
            let light_cm_data = files[4];
            let real_data = files[5];

            delete real_data["flow num"]
            delete estimated_data["flow num"]
            delete flt_data["flow num"]
            delete ht_data["flow num"]
            delete heavy_cm_data["flow num"]
            delete light_cm_data["flow num"]
            let data = []
            for (let key of Object.keys(real_data)) {
                obj = {
                    "id": key,
                    "realAns": Array.from(real_data[key]),
                    "estiAns": undefined,
                    "htAns": undefined,
                    "fltAns": undefined,
                    "hcmAns": undefined,
                    "lcmAns": undefined,
                    "ARE": undefined,
                    "size": undefined,
                    "counter": undefined
                };
                data[key] = obj
            }
            for (let key of Object.keys(estimated_data)) {
                data[key]["estiAns"] = Array.from(estimated_data[key])
            }
            for (let key of Object.keys(flt_data)) {
                data[key]["fltAns"] = Array.from(flt_data[key])
            }
            for (let key of Object.keys(ht_data)) {
                data[key]["htAns"] = Array.from(ht_data[key])
            }
            for (let key of Object.keys(heavy_cm_data)) {
                data[key]["hcmAns"] = Array.from(heavy_cm_data[key])
            }
            for (let key of Object.keys(light_cm_data)) {
                data[key]["lcmAns"] = Array.from(light_cm_data[key])
            }
            return data;
            // console.log(data)
        });
    }
    function process_data(data) {
        data.forEach((ele) => {
            let ARE = 0;
            let size = 0;
            let counter = 0;
            let hist_num = ele["realAns"].length;
            for (let i = 0; i < hist_num; ++i) {
                if (ele["realAns"][i] != 0) {
                    ARE += Math.abs(ele["realAns"][i] - ele["estiAns"][i]) / ele["realAns"][i];
                    ++counter;
                }
                size += ele["realAns"][i];
            }
            ARE /= counter;
            ele["ARE"] = ARE;
            ele["size"] = size;
            ele["counter"] = counter;
        })
    }

}())()

