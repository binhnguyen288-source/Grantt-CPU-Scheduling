
function get_series(str) {

    const processes = {};
    const lines = str.split('\n').map(v => v.trim());
    let current_time_slot = -1;
    const loader = {};
    for (let i = 0; i < lines.length; ++i) {
        if (lines[i].startsWith('Time slot')) {
            ++current_time_slot;
            continue;
        }
    
        if (lines[i].startsWith('Loaded')) {
            loader[lines[i].split(': ')[1]] = current_time_slot;
        }
    
        if (lines[i].startsWith('CPU')) {
            const parts = lines[i].split(':').map(v => v.trim().replace(/\s+/, ' '));
            if (parts.length === 1) continue;
            const cpu = parts[0].trim();
            if (parts[1].startsWith('Dispatched')) {
    
                const process = parts[1].split('process')[1].trim().split(' ')[0].trim();
                if (!processes[process]) {
                    processes[process] = [];
                }
                processes[process].push({
                    cpu,
                    time: current_time_slot
                });
            }
            else if (parts[1].startsWith('Put')) {
                const process = parts[1].split('process')[1].trim().split(' ')[0].trim();
                if (!processes[process]) {
                    processes[process] = [];
                }
                processes[process].push({
                    cpu,
                    time: current_time_slot
                });
            }
            else if (parts[1].startsWith('Processed')) {
                const process = parts[1].split('Processed')[1].trim().split(' ')[0].trim();
                if (!processes[process]) {
                    processes[process] = [];
                }
                processes[process].push({
                    cpu,
                    time: current_time_slot
                });
            }
        }
    }
    const series = [];
    for (const [proc, seq] of Object.entries(processes)) {
        
        const points = [{
            name: 'Loader',
            y: [loader[proc], loader[proc] + 0.25]
        }];
        for (let i = 0; i < seq.length; i += 2) {
            const { cpu } = seq[i];
            points.push({
                name: cpu,
                y: [seq[i].time, seq[i + 1].time]
            });
        }
        series.push({
            name: `Process ${proc}`,
            points
        });
    }
    
    return series;
}


const str = `Time slot   0
Loaded a process at input/proc/p0, PID: 1
Time slot   1
CPU 0: Dispatched process  1
Loaded a process at input/proc/p1, PID: 2
Time slot   2
Time slot   3
CPU 1: Dispatched process  2
Loaded a process at input/proc/p1, PID: 3
Time slot   4
Loaded a process at input/proc/p1, PID: 4
Time slot   5
Time slot   6
Time slot   7
CPU 0: Put process  1 to run queue
CPU 0: Dispatched process  4
Time slot   8
Time slot   9
CPU 1: Put process  2 to run queue
CPU 1: Dispatched process  3
Time slot  10
Time slot  11
Time slot  12
Time slot  13
CPU 0: Put process  4 to run queue
CPU 0: Dispatched process  1
Time slot  14
Time slot  15
CPU 1: Put process  3 to run queue
CPU 1: Dispatched process  2
Time slot  16
Time slot  17
CPU 0: Processed  1 has finished
CPU 0: Dispatched process  4
Time slot  18
Time slot  19
CPU 1: Processed  2 has finished
CPU 1: Dispatched process  3
Time slot  20
Time slot  21
CPU 0: Processed  4 has finished
CPU 0 stopped
Time slot  22
Time slot  23
CPU 1: Processed  3 has finished
CPU 1 stopped`;

const input = document.getElementById('input');
input.value = str;
JSC.chart('chartDiv', {
    debug: true,
    /*Typical Gantt setup. Horizontal columns by default.*/
    type: 'horizontal column',
    /*Make columns overlap.*/
    zAxis_scale_type: 'stacked',
    xAxis_defaultTick_label_style: { fontSize: 16, fontWeight: 'bold' },

    defaultPoint_opacity: 0.8,

    legend: { template: '%icon %name', position: 'inside top right' },
    title_label_text: 'CPU Scheduling Gantt Chart',

    series: get_series(str),
    toolbar_visible: false
});


input.oninput = e => { 

    var chart = JSC.chart('chartDiv', {
            debug: true,
            /*Typical Gantt setup. Horizontal columns by default.*/
            type: 'horizontal column',
            /*Make columns overlap.*/
            zAxis_scale_type: 'stacked',
            xAxis_defaultTick_label_style: { fontSize: 16, fontWeight: 'bold' },

            defaultPoint_opacity: 0.8,

            legend: { template: '%icon %name', position: 'inside top right' },
            title_label_text: 'CPU Scheduling Gantt Chart',

            series: get_series(e.target.value),
            toolbar_visible: false
    });
}