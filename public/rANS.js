function entropy(symbol_counts){
    var H = 0
    var counts_sum = 0
    for (i=0;i < symbol_counts.length; i++){
        counts_sum += symbol_counts[i]
    }
    
    for (i=0;i < symbol_counts.length; i++){
        
        H += (symbol_counts[i]/counts_sum)*Math.log(counts_sum/symbol_counts[i])
    }
    H = H/Math.log(2.0)
    return H
}

function rANS_encoder() {
    // Input function
    var countsVal = document.getElementById("symbol_counts").value;
    var inputVal = document.getElementById("input_text").value;
    var symbol_counts = countsVal.split(',').map(function(countsVal){return Number(countsVal);});
    var s_input = inputVal.split(',').map(function(inputVal){return Number(inputVal);});    
    // compute cumulative frequencies
    var cumul_counts = []
    var sum_counts = 0
    for (i=0;i < symbol_counts.length; i++){
        cumul_counts.push(sum_counts);
        sum_counts += symbol_counts[i];
    }
    
    var state = 1
    var output_string = "<table>" + "<tr> <th>Input </th> <th> State </th></tr>"
    for (j=0; j < s_input.length; j++){
        s = s_input[j]
        Fs = symbol_counts[s]
        Cs = cumul_counts[s]
        state = Math.floor(state/Fs)*sum_counts + Cs + (state % Fs)
        output_string += "<tr> <th>" + s + "</th><th>" + state + "</th></tr>"
    }
    output_string += "</table>"
    output_string += "<br> Final State: " + state
    output_string += "<br> Number of input symbols: " + s_input.length
    
    var L_avg = Math.ceil(Math.log(state)/Math.log(2.0))/s_input.length
    output_string += "<br> Average codelength: " + L_avg 
    output_string += "<br> Entropy: " + entropy(symbol_counts)
    document.getElementById("demo").innerHTML = output_string;    
}


function rANS_decoder() {
    // Input function
    var countsVal = document.getElementById("symbol_counts_decoder").value;
    var num_symbols = Number(document.getElementById("num_decoder").value);
    var state = Number(document.getElementById("state_decoder").value);
    var symbol_counts = countsVal.split(',').map(function(countsVal){return Number(countsVal);});
    
    // compute cumulative frequencies
    var cumul_counts = []
    var sum_counts = 0
    for (i=0;i < symbol_counts.length; i++){
        cumul_counts.push(sum_counts);
        sum_counts += symbol_counts[i];
    }
    
    function c_inv(y){
        for (i=0;i < symbol_counts.length; i++){
            if (y < cumul_counts[i]) break;        
        }
        return (i-1)
    }

    var output_string = "<table>" + "<tr> <th>Output </th> <th> State </th></tr>"
    for (j=0; j < num_symbols; j++){
        slot = state % sum_counts
        s = c_inv(slot)
        Fs = symbol_counts[s]
        Cs = cumul_counts[s]
        output_string += "<tr> <th>" + s + "</th><th>" + state + "</th></tr>"

        state = Math.floor(state/sum_counts)*Fs + slot - Cs
    }
    output_string += "</table>"
    output_string += "<br> Final State: " + state
    document.getElementById("rANS_decoder").innerHTML = output_string;    
}