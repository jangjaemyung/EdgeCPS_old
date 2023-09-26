function readFileContent(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      try{
          const fileContent = event.target.result;
          const jsonData = JSON.parse(fileContent);
          var workflowName = jsonData.workflow.metadata.name;
          executeFunctionWithFileContent(fileContent,workflowName);
      }catch(error){
          window.alert("Argo Workflow Submit Error : " + error.message);
      }
    };
    reader.readAsText(file);
  }

function executeFunctionWithFileContent(content,workflowName) {
    fetch('/submit', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: content
    })
    // .then(response => response.json())
    .then(data => {
        console.log(data);
        // 서버 응답 처리
        window.alert(workflowName+' 워크플로우가 실행 되었습니다.' );
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function saveRunData(){
    try{
        var runData = document.querySelector(".logContainer")
        runData = runData.innerText;
        return runData
    }catch{}
}

// 불러온 다이어그램 클릭 이벤트 함수 
function subContent1ClickHandler(sender, evt) {
    var cell = evt.getProperty('cell'); // 클릭한 셀
    if (cell != null && cell.style.includes('rounded=1')) { //cell이 null아니고 엣지도 아닌경우 
        var cellName = cell.value.attributes[1].value
        var cellId = cell.id
        subContent2(cellName,cellId,cell)
        
    }
}
// sub-content1
function subContent1(projectName){
    var xmlData = localStorage.getItem(projectName+'_businessProcessXml')
    var container = document.getElementById('graphContainer');
    var graph = new Graph(container);
    var doc = mxUtils.parseXml(xmlData);
    var codec = new mxCodec(doc);
    codec.decode(doc.documentElement, graph.getModel());
    graph.addListener(mxEvent.CLICK, subContent1ClickHandler);
    graph.refresh();
}

function subContent2ClickHandler(sender, evt) {
    var cell = evt.getProperty('cell'); // 클릭한 셀
    if (cell != null && cell.style.includes('rounded=1')) { //cell이 null아니고 엣지도 아닌경우 
        var cellName = cell.value.attributes[1].value
        var cellId = cell.id
        subContent2(cellName,cellId)
        localStorage.setItem(projectName+'_current_workflowName', cell.value.attributes[1].value)
    }
}

// sub-content2
function subContent2(cellName,cellId,cell){
    localStorage.setItem(projectName+'_current_workflowName', cell.value.attributes[1].value)
    var divElement = document.getElementById("graphContainer2");
    var svgElements = divElement.querySelectorAll("svg");

    // 선택한 각 SVG 요소를 순회하면서 삭제
    svgElements.forEach(function(svgElement) {
        svgElement.parentNode.removeChild(svgElement);
    });

    var xmlData = localStorage.getItem(projectName+'_'+cellId+'#'+cellName)
    var container = document.getElementById('graphContainer2');
    var graph = new Graph(container);
    var doc = mxUtils.parseXml(xmlData);
    var codec = new mxCodec(doc);
    graph.addListener(mxEvent.CLICK, subContent2ClickHandler);
    codec.decode(doc.documentElement, graph.getModel());
    graph.refresh();
}


// log-container1
function logContainer(){
    //워크플로우 전체 로그 출력 순우
    document.getElementById("logButton").addEventListener("click", function() {
        
        workflowName = localStorage.getItem(projectName+'_current_workflowName')
        const url = 'http://127.0.0.1:5000/log?workflow_name='+encodeURIComponent(workflowName);

        fetch(url)
            .then(response => response.text())  // 응답의 텍스트 데이터를 받아옴
            .then(data => {
                console.log(data);  // 받아온 데이터를 콘솔에 출력
            })
            .catch(error => {
                console.error("Error:", error);
            });
            saveRunData()
    });
    // HTML 요소 찾기
    var logContainer = document.querySelector('.logContainer');
    console.log = function(message) {
        var logEntry = document.createElement('div');

        // 공백 문자 변환 하는 곳
        message = message.replace(/ /g, '&nbsp;'); // 공백문자-> &nbsp;로
        message = message.replace(/\n/g, '<br>'); // 개행문자-> <br>로 

        logEntry.innerHTML = message; // HTML을 해석

        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight; // 스크롤 맨 아래로 이동
    };
} 

// log-container2
function logContainer2(){
    // 워크플로우 상태 확인
    document.getElementById("statusButton").addEventListener("click", function(){
        var logContainer2 = document.querySelector('.logContainer2');
        // console.log를 오버라이드해서 화면에 로그 출력
        console.log = function(message) {
            var logEntry = document.createElement('div');
            logEntry.textContent = message;
            logContainer2.appendChild(logEntry);
            logContainer2.scrollTop = logContainer2.scrollHeight; // 스크롤 맨 아래로 이동
        };
        workflowName = localStorage.getItem(projectName+'_current_workflowName')
        const url = 'http://127.0.0.1:5000/status?workflow_name='+encodeURIComponent(workflowName);
        fetch(url)
            .then(response => response.text())  // 응답의 텍스트 데이터를 받아옴
            .then(data => {
                // console.log(data);  // 받아온 데이터를 콘솔에 출력
                workflowStatus = data
                const resultElement = document.getElementById("result");
                const logs = data.split('\n');

                //각 노드 상태 확인
                var statusJsonData = JSON.parse(workflowStatus);
                var nodeStatus = statusJsonData.status.nodes
                var keys = Object.keys(nodeStatus)
            
                console.log('=============================================================================================')
                console.log("Workflow 이름 : " + statusJsonData.metadata.name);
                console.log("Namespace : "+statusJsonData.metadata.namespace);
                console.log("Workflow 생성시간 : "+statusJsonData.metadata.creationTimestamp);console.log("Workflow 종료여부 : "+statusJsonData.metadata.labels["workflows.argoproj.io/completed"])
                console.log("Workflow 성공확인 : "+statusJsonData.metadata.labels["workflows.argoproj.io/phase"]);
                console.log("Workflow 진행도 : "+statusJsonData.status.progress);
                console.log("[Workflow 각 노드 상태]")
                for (const key of keys){
                    if (nodeStatus[key].type == 'Pod'){
                        console.log(nodeStatus[key].displayName+' : '+nodeStatus[key].phase)
                        if(nodeStatus[key].phase != 'Succeeded'){
                            console.log(nodeStatus[key].message)
                        }
                    }
                }
                console.log('=============================================================================================')
            })
            .catch(error => {
                console.error("Error:", error);
            });
    });
}

function submitButton(){
    document.getElementById("submitButton").addEventListener("click", function(){
        const fileInput = document.getElementById('fileInput');
        const shouldExecute = confirm('Argo Workflow에 전송하시겠습니까?');
        if (shouldExecute){
            if (fileInput.files.length > 0) {
                const selectedFile = fileInput.files[0];
                readFileContent(selectedFile);
            }else {
                alert('Please select a file.');
            }
        }else{
            console.log('사용자가 취소함');
        }
    });
}

function deleteButton(){
    document.getElementById("deleteButton").addEventListener("click", function(){
        workflowName = localStorage.getItem(projectName+'_current_workflowName');
        const shouldExecute = confirm(workflowName+'워크플로우를 삭제 하시겠습니까?');
        if (shouldExecute) {
            fetch('/delete', {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json'
                },
                body:  JSON.stringify({ 'workflowName': workflowName })
            })
            // .then(response => response.json())
            .then(data => {
                console.log(data);
                // 서버 응답 처리
                window.alert(workflowName+' 워크플로우가 삭제 되었습니다.' );
            })
            .catch(error => {
                console.error('Error:', error);
            });
            
        } else {
            console.log('사용자가 취소함');
        }	
    });
}