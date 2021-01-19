var background = d3.select("#background");
var step = d3.selectAll(".step");

var scroller = scrollama();

function handleResize() {
    //update height of steps
    var stepHeight = Math.floor(window.innerHeight * 0.75);
    step.style("height", stepHeight + "px");

    var backgroundHeight = window.innerHeight / 2;
    var backgroundMarginTop = (window.innerHeight - backgroundHeight) / 6;

    background
        .style("height", backgroundHeight + "px")
        .style("top", backgroundMarginTop + "px");

    //update new element dimensions
    scroller.resize();
}

function handleStepEnter(response) {
    console.log("working");

    if(response.index == 0){
        d3.select(".step0").transition().duration(400).style("opacity", 1);
    }

    if(response.index == 1){
        d3.select(".step1").transition().duration(400).style("opacity", 1);
    }

    if(response.index == 2){
        d3.select(".step2").transition().duration(400).style("opacity", 1);
    }

    if(response.index == 3){
        d3.select(".step3").transition().duration(400).style("opacity", 1);
    }

    if(response.index == 4){
        d3.select(".step4").transition().duration(400).style("opacity", 1);
    }
    
    if(response.index == 5){
        d3.select(".step5").transition().duration(400).style("opacity", 1);
    }

    if(response.index == 6){
        d3.select(".step6").transition().duration(400).style("opacity", 1);
    }

    if(response.index == 7){
        d3.select(".step8").transition().duration(400).style("opacity", 1);
    }

    if(response.index == 8){
        d3.select(".step8").transition().duration(400).style("opacity", 1);
    }

    if(response.index == 9){
        d3.select(".step9").transition().duration(400).style("opacity", 1);
    }

    if(response.index == 10){
        d3.select(".step10").transition().duration(400).style("opacity", 1);
    }
}

function handleStepExit(response) {
    if (response.direction === "up") {

        if(response.index == 0){
        d3.select(".step0").transition().duration(400).style("opacity", 0);
        }

        if(response.index == 1){
            d3.select(".step1").transition().duration(400).style("opacity", 0);
        }

        if(response.index == 2){
            d3.select(".step2").transition().duration(400).style("opacity", 0);
        }

        if(response.index == 3){
            d3.select(".step3").transition().duration(400).style("opacity", 0);
        }

        if(response.index == 4){
            d3.select(".step4").transition().duration(400).style("opacity", 0);
        }
        
        if(response.index == 5){
            d3.select(".step5").transition().duration(400).style("opacity", 0);
        }

        if(response.index == 6){
            d3.select(".step6").transition().duration(400).style("opacity", 0);
        }

        if(response.index == 7){
            d3.select(".step8").transition().duration(400).style("opacity", 0);
        }

        if(response.index == 8){
            d3.select(".step8").transition().duration(400).style("opacity", 0);
        }

        if(response.index == 9){
            d3.select(".step9").transition().duration(400).style("opacity", 0);
        }

        if(response.index == 10){
            d3.select(".step10").transition().duration(400).style("opacity", 0);
        }
    }


}

function stepupStickyfill() {
    d3.selectAll(".sticky").each(function () {
        Stickyfill.add(this);
    })
}

function init() {
    stepupStickyfill();
    handleResize();

    scroller
        .setup({
            step: ".step",
            offset: 0.67,
            debug: false
        })
        .onStepEnter(handleStepEnter)
        .onStepExit(handleStepExit);

    window.addEventListener("resize", handleResize);
}

//light em up
init();