
function connWs()
{
    //已连接
    if(heartId){
        ws.close()
        return;
    }

    connBtn.innerText = '断开连接'

    //创建新连接
    ws = new WebSocket(ws_rul);

    log("开始连接: "+ws_rul)
    // 建立 web socket 连接成功触发事件
    ws.onopen = function() {
        log("连接成功", 'green')

        // 使用 send() 方法发送数据
        sendData({
            cmd: "hello",
            TOKEN
        })
    }

    // 接收服务端数据时触发事件
    ws.onmessage = function(evt) {
        const data = evt.data;
        log('收到数据:'+data, 'blue');
    }

    // 断开 web socket 连接成功触发事件
    ws.onclose = function() {
        log('连接已关闭...', 'red');
        clearInterval(heartId)
        heartId = null;
        connBtn.innerText = '开始连接'
    }

    //发送心跳
    heartId = setInterval(() => {
        log("发送心跳")
        ws.send(JSON.stringify({cmd: "ping", TOKEN: TOKEN}))
    }, 30000)
}

//发送输入框内容
function sendMsg(){
    let dom = document.getElementById('send_msg')
    let val = dom.value;
    dom.value = '';
    sendData(val)
}
//发送ws消息
function sendData(msg){
    if(!heartId){
        return log("ws还未连接", 'red')
    }
    if('string' != typeof msg){
        msg = JSON.stringify(msg)
    }
    ws.send(msg)
    log("发送："+ msg)
}

function jsonToUrlParam(json) {
    return Object.keys(json).map(key => key + '=' + json[key]).join('&');
}

const App = {

    ajax(conf, callback){
        if('base' in conf){
            conf.url = conf.base + conf.url;
        }
        const _conf = {
            method: conf.method ? conf.method : 'GET',
            timeout: conf.timeout ? conf.timeout : 5 * 1000
        }

        if(conf.data){
            if(_conf.method === 'GET'){
                conf.url += "?" + jsonToUrlParam(conf.data);
            }else{
                _conf.body = new FormData();
                for(const i in conf.data){
                    _conf.body.append(i, conf.data[i]);
                }
            }
        }
        if(conf.headers){
            _conf.headers = conf.headers
        }

        fetch(conf.url, _conf)
            .then(res => res.json())
            .then(data => {
                callback(data, null)
            })
            .catch(err => {
                callback(null, err)
            })
    },
}

const log_dom = document.getElementById('console_log')
function log(msg, color){
    let p = document.createElement('p');
    const d = new Date();
    p.innerText = d.getMinutes()+":"+d.getSeconds()+" "+msg
    p.style.color = color?color:'#333'
    log_dom.appendChild(p)

    log_dom.scrollTop = log_dom.scrollHeight
}
function cleanLog(){
    log_dom.innerText = ''
}

const _console_dom = document.getElementById('console')

// log_dom.style.height = (window.screen.availHeight - (_console_dom.clientHeight + 100))+'px';
log_dom.style.height = (window.screen.availHeight - 220)+'px';