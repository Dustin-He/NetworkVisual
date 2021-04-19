// let estimated_data = null;
// let ht_data = null;
// let heavy_cm_data = null;
// let light_cm_data = null;
// let real_data = null;
// let flt_data = null;
const color_set = ["#E69F00", "#D55E00", "#009E73", "#999999", "#56B4E9", "#2267A8", "#1E2262"];
let d2 = null;
let gdata;
(function main() {

    return () => {
        read_data().then((data) => {
            // console.log(estimated_data);
            gdata = data;
            process_data(data)
            console.log(data)
            let d1 = draw_pict1(data);
            d1()
            d2 = draw_pict2(data)
            d2(data)



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
                ARE = Math.abs(ele["realAns"][i] - ele["estiAns"][i]);
                if (ele["realAns"][i] != 0) {
                    ++counter;
                }
                size += ele["realAns"][i];
            }
            ARE /= hist_num;
            ele["ARE"] = ARE;
            ele["size"] = size;
            ele["counter"] = counter;
        })
    }

}())()

