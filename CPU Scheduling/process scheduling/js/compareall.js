// Wrap every letter in a span
var textWrapper = document.querySelector('.ml12');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml12 .letter',
    translateX: [40,0],
    translateZ: 0,
    opacity: [0,1],
    easing: "easeOutExpo",
    duration: 10000,
    delay: (el, i) => 500 + 30 * i
  }).add({
    targets: '.ml12 .letter',
    translateX: [0,-30],
    opacity: [1,0],
    easing: "easeInExpo",
    duration: 10000,
    delay: (el, i) => 100 + 30 * i
  });

let s = $("#data").html();
let s_IO=$("#data_IO").html();
let s_animate = $("#animateAll").html();
let burst_IO= '<input type="number"class="cen_IO" placeholder="IO" style="width: 60px;"><input type="number" class="cen_IO" placeholder="BT" style="width:60px;">';

$(document).ready(function () {

    let arrival = [];
    let burst = [];
    let Completion = [];
    let tat = [];
    let wt = [];
    let arrival_burst = [];
    let arrival_sort = [];
    let total_bt = [];
    let arrival_process = [];
    let queue=[];
    let fin_burst=[];
    let flg = [];
    let flg_p = 0;

    let avgtat_arr = [];
    let avgwat_arr = [];

    //Add process;
    let lst=1;
    $("#add_row").click(function(){
        let n=$("#process").val();
        $("#process").val(parseInt(n)+1);
            $("#data").append(s);
            $("#data .cen").eq(lst * 3).text(lst);
        lst++;
    });

    $("#delete_row").click(function(){
        lst--;
        if(lst<0)
        {
            lst=0;
            return;
        }
        $("#process").val(lst);
            $("#data").children(".cen").eq(lst*3+2).remove();
            $("#data").children(".cen").eq(lst*3+1).remove();
            $("#data").children(".cen").eq(lst*3).remove();
            $("#data").children(".ans").eq(lst*3+2).remove();
            $("#data").children(".ans").eq(lst*3+1).remove();
            $("#data").children(".ans").eq(lst*3).remove();
    }); 

    function makeVisible() {
        $("#myChart").css("visibility", "visible");
    }


    function check(flg) {
        let j = 1;
        for (let i = 0; i < flg.length; i++) {
            if (flg[i] == 0)
                j = 0;
        }
        return j;
    }
    
    function addQueue(last)
    {
        let n=lst;
        for(let i = flg_p; i < n && arrival_process[i][0] <= last; i++)
        {
            // console.log(flg+" "+i);
            queue.push(arrival_process[i][1]);
            flg_p++;
        }
    }

    function FCFS () {
        
        let n = lst;
        //console.log(n);
        let total_Burst=[];
            let texts = $("#data .cen").map(function () {
                return $(this).val();
            }).get();
            console.log(texts);

            arrival.length = 0;
            burst.length = 0;
            arrival_sort.length=0;

            for (let i = 0; i < texts.length; i++) {
                if (i % 3 == 0)
                    continue;
                else if (i % 3 == 1) {
                    if (texts[i] == "") {
                        alert("Enter values!");
                        makeHide();
                        return;
                    }
                    arrival.push(parseInt(texts[i]));
                    arrival_sort.push([parseInt(texts[i]),arrival_sort.length]);
                }
                else {
                    if (texts[i] == "") {
                        alert("Enter values!");
                        makeHide();
                        return;
                    }
                    burst.push(parseInt(texts[i]));
                }
            }
        // console.log(process);
        console.log(arrival);
        console.log(burst);
        Completion.length = n;
        wt.length = n;
        tat.length = n;
        let count = 0, last = 0;

        arrival_sort = arrival_sort.sort(function (a, b) {  return a[0] - b[0]; });
        // consol.log(arrival_sort.sort());
        console.log(arrival_sort);
        //compute Completion time
            while (count < n) {
                if (last >= arrival_sort[count][0])
                    Completion[arrival_sort[count][1]] = last + burst[arrival_sort[count][1]];
                else {
                    last = arrival_sort[count][0];
                    Completion[arrival_sort[count][1]] = last + burst[arrival_sort[count][1]];
                }
                last = Completion[arrival_sort[count][1]];
                count++;
            }
        count = 0;
        //compute Turn Around Time and Waiting Time
            while (count < n) {
                tat[count] = Completion[count] - arrival[count];
                wt[count] = tat[count] - burst[count];
                count++;
            }

        console.log(Completion);
        console.log(tat);
        console.log(wt);
        
        //give value to our html table
        var avg_tat=0,avg_wat=0;
            for (let i = 0, j = 0; i < 3 * n; i += 3, j++) {
                avg_tat+=tat[j];
                avg_wat+=wt[j];
            }

        avgtat_arr[0] = Math.round(avg_tat/n*100)/100;
        avgwat_arr[0] = Math.round(avg_wat/n*100)/100;
    }


    function select_process_SJF(till) {
        if (check(flg))
            return -2;
        let n = lst;
        let min = 1e18, select = -1;
        //console.log(till);
        for (let i = 0; i < n && arrival_burst[i][0] <= till; i++) {
            if (flg[arrival_burst[i][2]] == 0 && min > arrival_burst[i][1]) {
                //console.log(arrival_burst[i][1]);
                min = arrival_burst[i][1];
                select = arrival_burst[i][2];
            }
        }
        //console.log();
        if (select == -1) {
            return -1;
        }
        else {
            flg[select] = 1;
            return select;
        }
    }
    function afterWaste_SJF() {
        let n = lst;
        for (let i = 0; i < n; i++) {
            if (flg[arrival_burst[i][2]] == 0)
                return arrival_burst[i][0];
        }
    }
    function fun_animation_SJF() {
        let n = lst;
        console.log(n);
        let last = 0;
        let i = -1;
        let j;
        while (1) {
            j = select_process_SJF(last);
            console.log(j);
            if (j == -2) {
                break;
            }
            else if (j == -1) {
                i++;
                $("#animateAll").append(s_animate);
                $(".animation").eq(i).css("visibility", "visible");
                $(".animation").eq(i).text("Idle");
                $(".animation").eq(i).css("background-color", "white");
                $(".animation").eq(i).css("color", "white");
                $(".start").eq(i).text(last);
                let next_arrive = afterWaste_SJF();
                let cur = 50 * (next_arrive - last);
                $(".animation").eq(i).animate({
                    width: cur
                }, 500);
                last = next_arrive;
                continue;
            }
            let cur = 50 * burst[j];
            i++;
            $("#animateAll").append(s_animate);
            $(".animation").eq(i).css("visibility", "visible");
            $(".animation").eq(i).text("P" + j);
            $(".start").eq(i).text(last);

            if (i % 2)
                $(".animation").eq(i).css("background-color", "lightgreen");
            else
                $(".animation").eq(i).css("background-color", "lightblue");

            $(".animation").eq(i).animate({
                width: cur
            }, 1000);
            last = last + burst[j];
            Completion[j] = last;
        }
        i++;
        $("#animateAll").append(s_animate);
        $(".start").eq(i).text(last);
    }

    function SJF () {

        let n = lst;

        //console.log(n);
        let total_Burst = [];
            let texts = $("#data .cen").map(function () {
                return $(this).val();
            }).get();
            console.log(texts);

            arrival.length = 0;
            burst.length = 0;
            arrival_burst.length = 0;
            flg.length = 0;

            for (let i = 0; i < texts.length; i++) {
                if (i % 3 == 0)
                    continue;
                else if (i % 3 == 1) {
                    if (texts[i] == "") {
                        makeHide();
                        return;
                    }
                    arrival.push(parseInt(texts[i]));
                    arrival_burst.push([parseInt(texts[i]), parseInt(texts[i + 1]), parseInt(arrival_burst.length)]);
                    flg.push(0);
                }
                else {
                    if (texts[i] == "") {
                        makeHide();
                        return;
                    }
                    burst.push(parseInt(texts[i]));
                }
            }
        // console.log(process);
        console.log('t------',total_Burst);
        console.log(arrival);
        console.log(burst);
        Completion.length = n;
        wt.length = n;
        tat.length = n;
        let count = 0, last = 0;

            arrival_burst = arrival_burst.sort(function (a, b) { return a[0] - b[0]; });
            // arrival_brust.sort();
            console.log(arrival_burst);
            let test=arrival_sort;
            console.log('test',test);
            //compute Completion time
                fun_animation_SJF();
        count = 0;
        //compute Turn Around Time and Waiting Time
            while (count < n) {
                tat[count] = Completion[count] - arrival[count];
                wt[count] = tat[count] - burst[count];
                count++;
            }

        console.log(Completion);
        console.log(tat);
        console.log(wt);

        //give value to our html table
        var avg_tat = 0, avg_wat = 0;
            for (let i = 0, j = 0; i < 3 * n; i += 3, j++) {
                avg_tat += tat[j];
                avg_wat += wt[j];
            }

        avgtat_arr[1] = Math.round(avg_tat / n * 100) / 100;
        avgwat_arr[1] = Math.round(avg_wat / n * 100) / 100;
    }


    function select_process_LJF(till)
    {
        if(check(flg))
            return -2;
        let n = lst;
        let max=-1,select=-1;
        //console.log(till);
        for(let i=0;i<n && arrival_burst[i][0]<=till;i++)
        {
            if(flg[arrival_burst[i][2]]==0 && max<arrival_burst[i][1])
            {
                //console.log(arrival_burst[i][1]);
                max=arrival_burst[i][1];
                select=arrival_burst[i][2];
            }
        }
        //console.log();
        if(select==-1)
        {
            return -1;
        }
        else 
        {
            flg[select]=1;
            return select;
        }
    }
    function afterWaste_LJF() {
        let n = lst;
        for (let i = 0; i < n; i++) {
            if (flg[arrival_burst[i][2]] == 0)
                return arrival_burst[i][0];
        }
    }
    function fun_animation_LJF() {
        let n = lst;

        let last = 0;
        let i = -1;
        let j;
        while (1) {
            j=select_process_LJF(last)
            console.log(j);
            if(j==-2)
            {
                break;
            }
            else if (j==-1){
                i++;
                $("#animateAll").append(s_animate);
                $(".animation").eq(i).css("visibility", "visible");
                $(".animation").eq(i).text("Idle");
                $(".animation").eq(i).css("background-color", "white");
                $(".animation").eq(i).css("color", "white");
                $(".start").eq(i).text(last);
                let next_arrive=afterWaste_LJF();
                let cur = 50 * (next_arrive - last);
                $(".animation").eq(i).animate({
                    width: cur
                }, 500);
                last = next_arrive;
                continue;
            }
            let cur = 50 * burst[j];
            i++;
            $("#animateAll").append(s_animate);
            $(".animation").eq(i).css("visibility", "visible");
            $(".animation").eq(i).text("P" + j);
            $(".start").eq(i).text(last);

            if (i % 2)
                $(".animation").eq(i).css("background-color", "lightgreen");
            else
                $(".animation").eq(i).css("background-color", "lightblue");

            $(".animation").eq(i).animate({
                width: cur
            }, 1000);
            last = last + burst[j];
            Completion[j]=last;
        }
        i++;
        $("#animateAll").append(s_animate);
        $(".start").eq(i).text(last);
    }

    function LJF () {
        let n = lst;

        //console.log(n);
        let total_Burst = [];
            let texts = $("#data .cen").map(function () {
                return $(this).val();
            }).get();
            console.log(texts);
    
            arrival.length = 0;
            burst.length = 0;
            flg.length=0;
            arrival_burst.length=0;
            total_bt.length=0;
    
            for (let i = 0; i < texts.length; i++) {
                if (i % 3 == 0)
                    continue;
                else if (i % 3 == 1) {
                    if (texts[i] == "") {
                        makeHide();
                        return;
                    }
                    arrival.push(parseInt(texts[i]));
                    arrival_burst.push([parseInt(texts[i]),parseInt(texts[i + 1]),parseInt( arrival_burst.length)]);
                    flg.push(0);
                }
                else {
                    if (texts[i] == "") {
                        makeHide();
                        return;
                    }
                    burst.push(parseInt(texts[i]));
                }
            }
        // console.log(process);
        console.log('t------',total_Burst);
        console.log(arrival);
        console.log(burst);
        Completion.length = n;
        wt.length = n;
        tat.length = n;
        let count = 0, last = 0;

        arrival_burst = arrival_burst.sort(function (a, b) { return a[0] - b[0]; });
        // arrival_brust.sort();
        console.log(arrival_burst);
        let test=arrival_sort;
        console.log('test',test);
        //compute Completion time
            fun_animation_LJF();
        count = 0;
        //compute Turn Around Time and Waiting Time
            while (count < n) {
                tat[count] = Completion[count] - arrival[count];
                wt[count] = tat[count] - burst[count];
                count++;
            }

        console.log(Completion);
        console.log(tat);
        console.log(wt);

        //give value to our html table
        var avg_tat = 0, avg_wat = 0;
            for (let i = 0, j = 0; i < 3 * n; i += 3, j++) {
                $("#data .ans").eq(i).text(Completion[j]);
                $("#data .ans").eq(i + 1).text(tat[j]);
                $("#data .ans").eq(i + 2).text(wt[j]);
                avg_tat += tat[j];
                avg_wat += wt[j];
            }

        avgtat_arr[2] = Math.round(avg_tat / n * 100) / 100;
        avgwat_arr[2] = Math.round(avg_wat / n * 100) / 100;
    }


    function select_process_SRTF(till)
    {
        let n = lst;
        let min=1e18,select=-1;
        //console.log(till);
        for(let i=0;i<queue.length;i++)
        {
            if(burst[queue[i]]!=0 && min>burst[queue[i]])
            {
                min=burst[queue[i]];
                select=queue[i];
            }
        }
        //console.log();
        if(min==1e18 && flg_p==n)
        {
            return -2;
        }
        else if(select==-1)
        {
            return -1;
        }
        else 
        {    
            return select;
        }
    }
    function fun_animation_SRTF() {
        let n = lst;

        let last = 0;
        let i = -1;
        let j;
        flg_p=0;
        while (1) {
            addQueue(last);
            j=select_process_SRTF(last);
            //console.log(j);
            //console.log(last);
            if(j==-2)
            {
                break;
            }
            else if (j==-1){
                i++;
                $("#animateAll").append(s_animate);
                $(".animation").eq(i).css("visibility", "visible");
                $(".animation").eq(i).text("Idle");
                $(".animation").eq(i).css("background-color", "white");
                $(".animation").eq(i).css("color", "white");
                $(".start").eq(i).text(last);
                let next_arrive=arrival_process[flg_p][0];
                let cur = 50 * (next_arrive - last);
                $(".animation").eq(i).animate({
                    width: cur
                }, 500);
                last = next_arrive;
                continue;
            }
            let cur = 50;
            if(flg_p==n)
            {
                cur=cur*burst[j];
            }
            i++;
            $("#animateAll").append(s_animate);
            $(".animation").eq(i).css("visibility", "visible");
            $(".animation").eq(i).text("P" + j);
            $(".start").eq(i).text(last);
            
            if (i % 2)
            $(".animation").eq(i).css("background-color", "lightgreen");
            else
            $(".animation").eq(i).css("background-color", "lightblue");
            
            $(".animation").eq(i).animate({
                width: cur
            }, 1000);
            if(flg_p==n)
            {
                last=last+burst[j];
                burst[j]=0;
            }
            else{
            last = last + 1;
            burst[j]=burst[j]-1;
            }
            if(burst[j]==0)
                Completion[j]=last;
        }
        i++;
        $("#animateAll").append(s_animate);
        $(".start").eq(i).text(last);
    }

    function SRTF () {
        let n = lst;

        //console.log(n);
        let total_Burst = [];
            let texts = $("#data .cen").map(function () {
                return $(this).val();
            }).get();
            console.log(texts);
            arrival.length = 0;
            burst.length = 0;
            arrival_process.length=0;
            queue.length=0;
            fin_burst.length=0;
            for (let i = 0; i < texts.length; i++) {
                if (i % 3 == 0)
                    continue;
                else if (i % 3 == 1) {
                    if (texts[i] == "") {
                        makeHide();
                        return;
                    }
                    arrival.push(parseInt(texts[i]));
                    arrival_process.push([parseInt(texts[i]),parseInt( arrival_process.length)]);
                }
                else {
                    if (texts[i] == "") {
                        makeHide();
                        return;
                    }
                    burst.push(parseInt(texts[i]));
                    fin_burst.push(parseInt(texts[i]));
                }
            }
        // console.log(process);
        console.log(arrival);
        console.log(burst);
        Completion.length = n;
        wt.length = n;
        tat.length = n;
        let count = 0, last = 0;
            arrival_process = arrival_process.sort(function (a, b) { return a[0] - b[0]; });
        // arrival_brust.sort();
        console.log(arrival_process);
        //compute Completion time
            fun_animation_SRTF();
     count = 0;
        //compute Turn Around Time and Waiting Time
            while (count < n) {
                tat[count] = Completion[count] - arrival[count];
                wt[count] = tat[count] - fin_burst[count];
                count++;
            }

        console.log(Completion);
        console.log(tat);
        console.log(wt);

        //give value to our html table
        var avg_tat = 0, avg_wat = 0;
            for (let i = 0, j = 0; i < 3 * n; i += 3, j++) {
                avg_tat += tat[j];
                avg_wat += wt[j];
            }

        avgtat_arr[3] = Math.round(avg_tat / n * 100) / 100;
        avgwat_arr[3] = Math.round(avg_wat / n * 100) / 100;
    }


    function select_process_LRTF(till) {
        let n = lst;
        let max = -1, select = -1;
        //console.log(till);
        for (let i = 0; i < queue.length; i++) {
            if (burst[queue[i]] != 0 && max < burst[queue[i]]) {
                max = burst[queue[i]];
                select = queue[i];
            }
        }
        //console.log();
        if (max == -1 && flg_p == n) {
            return -2;
        }
        else if (select == -1) {
            return -1;
        }
        else {
            return select;
        }
    }
    function fun_animation_LRTF() {
        let n = lst;

        let last = 0;
        let i = -1;
        let j;
        flg_p = 0;
        while (1) {
            addQueue(last);
            j = select_process_LRTF(last);
            //console.log(j);
            //console.log(last);
            if (j == -2) {
                break;
            }
            else if (j == -1) {
                i++;
                $("#animateAll").append(s_animate);
                $(".animation").eq(i).css("visibility", "visible");
                $(".animation").eq(i).text("Idle");
                $(".animation").eq(i).css("background-color", "white");
                $(".animation").eq(i).css("color", "white");
                $(".start").eq(i).text(last);
                let next_arrive = arrival_process[flg_p][0];
                let cur = 50 * (next_arrive - last);
                $(".animation").eq(i).animate({
                    width: cur
                }, 500);
                last = next_arrive;
                continue;
            }
            let cur = 50;
            i++;
            $("#animateAll").append(s_animate);
            $(".animation").eq(i).css("visibility", "visible");
            $(".animation").eq(i).text("P" + j);
            $(".start").eq(i).text(last);

            if (i % 2)
                $(".animation").eq(i).css("background-color", "lightgreen");
            else
                $(".animation").eq(i).css("background-color", "lightblue");

            $(".animation").eq(i).animate({
                width: cur
            }, 1000);
            last = last + 1;
            burst[j] = burst[j] - 1;
            if (burst[j] == 0)
                Completion[j] = last;
        }
        i++;
        $("#animateAll").append(s_animate);
        $(".start").eq(i).text(last);
    }

    function LRTF () {
        let n = lst;

        //console.log(n);
        let total_Burst = [];
            let texts = $("#data .cen").map(function () {
                return $(this).val();
            }).get();
            console.log(texts);

            arrival.length = 0;
            burst.length = 0;
            arrival_process.length = 0;
            queue.length = 0;
            fin_burst.length = 0;

            for (let i = 0; i < texts.length; i++) {
                if (i % 3 == 0)
                    continue;
                else if (i % 3 == 1) {
                    if (texts[i] == "") {
                        makeHide();
                        return;
                    }
                    arrival.push(parseInt(texts[i]));
                    arrival_process.push([parseInt(texts[i]), parseInt(arrival_process.length)]);
                }
                else {
                    if (texts[i] == "") {
                        makeHide();
                        return;
                    }
                    burst.push(parseInt(texts[i]));
                    fin_burst.push(parseInt(texts[i]));
                }
            }
        // console.log(process);
        console.log(arrival);
        console.log(burst);
        Completion.length = n;
        wt.length = n;
        tat.length = n;
        let count = 0, last = 0;
            arrival_process = arrival_process.sort(function (a, b) { return a[0] - b[0]; });
        // arrival_brust.sort();
        console.log(arrival_process);
        //compute Completion time
            fun_animation_LRTF();
        count = 0;
        //compute Turn Around Time and Waiting Time
            while (count < n) {
                tat[count] = Completion[count] - arrival[count];
                wt[count] = tat[count] - fin_burst[count];
                count++;
            }

        console.log(Completion);
        console.log(tat);
        console.log(wt);

        //give value to our html table
        var avg_tat = 0, avg_wat = 0;
            for (let i = 0, j = 0; i < 3 * n; i += 3, j++) {
                avg_tat += tat[j];
                avg_wat += wt[j];
            }

            avgtat_arr[4] = Math.round(avg_tat / n * 100) / 100;
            avgwat_arr[4] = Math.round(avg_wat / n * 100) / 100;
    
            console.log(avgtat_arr[4]);
            console.log(avgwat_arr[4]);
    }



    $("#compute").click(function () {   

        FCFS();
        SJF();
        LJF();
        SRTF();
        LRTF();

        var isChecked;
        isChecked = $("#fcfs").is(":checked");
        if(!(isChecked)) {avgtat_arr[0] = 0; avgwat_arr[0] = 0;}
        isChecked = $("#sjf").is(":checked");
        if(!(isChecked)) {avgtat_arr[1] = 0; avgwat_arr[1] = 0;}
        isChecked = $("#ljf").is(":checked");
        if(!(isChecked)) {avgtat_arr[2] = 0; avgwat_arr[2] = 0;}
        isChecked = $("#srtf").is(":checked");
        if(!(isChecked)) {avgtat_arr[3] = 0; avgwat_arr[3] = 0;}
        isChecked = $("#lrtf").is(":checked");
        if(!(isChecked)) {avgtat_arr[4] = 0; avgwat_arr[4] = 0;}

        var graph = document.getElementById("myChart").getContext("2d");

        var data = {
            labels: ["FCFS", "SJF", "LJF", "SRTF", "LRTF"],
            datasets: [
                {
                    label: "TAT",
                    backgroundColor: "lightgreen",
                    data: [avgtat_arr[0], avgtat_arr[1], avgtat_arr[2], avgtat_arr[3], avgtat_arr[4]]
                },
                {
                    label: "WT",
                    backgroundColor: "lightblue",
                    data: [avgwat_arr[0], avgwat_arr[1], avgwat_arr[2], avgwat_arr[3], avgwat_arr[4]]
                }
            ]
        };

        var myBarChart = new Chart(graph, {
            type: 'bar',
            data: data,
            options: {
                barValueSpacing: 10,
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                        }
                    }]
                }
            }
        });

        makeVisible();
        
    });

    function hideChart() {
        $("#myChart").css("visibility", "hidden");
    }

    //this function make hide and give the text to null
    function makeHide() {
        $(".cen").val("");
        // hideChart();
        // $(".animation").css("visibility","hidden");
    }

    //reset the button
    $("#reset").click(makeHide);
    
});