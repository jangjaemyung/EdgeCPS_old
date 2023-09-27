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

function saveLogContainer(){
    try{
        var logContainerData = document.querySelector(".logContainer")
        var logContainer2Data = document.querySelector(".logContainer2")
        logContainerData = logContainerData.innerText;
        logContainer2Data = logContainer2Data.innerText;
        localStorage.setItem(localStorage.getItem(projectName+'_nowWorkflow')+'_resultLog' , [logContainerData,logContainerData2]);
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

    // Activity 클릭 했을 때 Activity 상태 출력
    intervalLogContainer2 = setInterval(logContainer2, 1000);

    
    // 한 번에 한 함수만 실행하도록 interval 설정
    // var interval;

    // // 1초마다 logContainer2 함수 실행
    // interval = setInterval(function() {
    //     logContainer2();
    // }, 1000);

    // // logContainer2가 실행된 다음 1초마다 logContainer 함수 실행
    // logContainer2(); // 처음에 한번 먼저 logContainer2 실행

    // setTimeout(function() {
    //     interval = setInterval(function() {
    //         logContainer();
    //     }, 1000);
    // }, 1000); // logContainer2 함수 실행끝나면 1초 뒤에 logContainer 함수 실행

}


// log-container1
function logContainer(){
    //워크플로우 전체 로그 출력 순우
    // document.getElementById("logButton").addEventListener("click", function() {
        
    workflowName = localStorage.getItem(projectName+'_current_workflowName')
    const url = 'http://127.0.0.1:5000/log?workflow_name='+encodeURIComponent(workflowName);
    // const url = 'http://127.0.0.1:5000/log?workflow_name=act2'

    fetch(url)
        .then(response => response.text())  // 응답의 텍스트 데이터를 받아옴
        .then(data => {
            console.log(data);  // 받아온 데이터를 콘솔에 출력
        })
        .catch(error => {
            console.error("Error:", error);
        });
        // saveRunData()
    // });
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
// async function logContainer() {
    
//     try {
//         // 워크플로우 이름 설정 (예: act2)
//         const workflowName = 'act2';

//         // 로그 데이터를 가져올 URL 설정
//         const url = `http://127.0.0.1:5000/log?workflow_name=${encodeURIComponent(workflowName)}`;

//         // 서버에서 데이터 가져오기
//         const response = await fetch(url);
        
//         // HTTP 응답 상태 확인
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.text();

//         // 로그 데이터를 화면에 표시
//         const logContainer = document.querySelector('.logContainer');
//         const logEntry = document.createElement('div');
        
//         // 공백 문자 변환
//         const formattedMessage = data.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>');
        
//         logEntry.innerHTML = formattedMessage;
//         logContainer.appendChild(logEntry);
//         logContainer.scrollTop = logContainer.scrollHeight;
        
//         // // 다른 비동기 작업 수행 (예: saveRunData 함수 호출)
//         // await saveLogContainer();
//     } catch (error) {
//         console.error("Error:", error);
//     }
// }


// log-container2
// async function logContainer2(){
//     // 워크플로우 상태 확인
//     // document.getElementById("statusButton").addEventListener("click", function(){
        
//         // workflowName = localStorage.getItem(projectName+'_current_workflowName')
//         // const url = 'http://127.0.0.1:5000/status?workflow_name='+encodeURIComponent(workflowName);
//         const url = 'http://127.0.0.1:5000/status?workflow_name=act2'
//         fetch(url)
//             .then(response => response.text())  // 응답의 텍스트 데이터를 받아옴
//             .then(data => {
//                 // console.log(data);  // 받아온 데이터를 콘솔에 출력
//                 workflowStatus = data
//                 // const resultElement = document.getElementById("result");
//                 // const logs = data.split('\n');

//                 //각 노드 상태 확인
//                 var statusJsonData = JSON.parse(workflowStatus);
//                 var nodeStatus = statusJsonData.status.nodes
//                 var keys = Object.keys(nodeStatus)
            
//                 console.log("Workflow 이름 : " + statusJsonData.metadata.name);
//                 console.log("Namespace : "+statusJsonData.metadata.namespace);
//                 console.log("Workflow 생성시간 : "+statusJsonData.metadata.creationTimestamp);console.log("Workflow 종료여부 : "+statusJsonData.metadata.labels["workflows.argoproj.io/completed"])
//                 console.log("Workflow 성공확인 : "+statusJsonData.metadata.labels["workflows.argoproj.io/phase"]);
//                 console.log("Workflow 진행도 : "+statusJsonData.status.progress);
//                 console.log("[Workflow 각 노드 상태]")
//                 for (const key of keys){
//                     if (nodeStatus[key].type == 'Pod'){
//                         console.log(nodeStatus[key].displayName+' : '+nodeStatus[key].phase)
//                         if(nodeStatus[key].phase != 'Succeeded'){
//                             console.log(nodeStatus[key].message)
//                         }
//                     }
//                 }
//             })
//             .catch(error => {
//                 console.error("Error:", error);
//             });
//     var logContainer2 = document.querySelector('.logContainer2');
//     // console.log를 오버라이드해서 화면에 로그 출력
//     console.log = function(message) {
//         var logEntry = document.createElement('div');
//         logEntry.textContent = message;
//         logContainer2.appendChild(logEntry);
//         logContainer2.scrollTop = logContainer2.scrollHeight; // 스크롤 맨 아래로 이동
//     };
//     // });
// }
async function logContainer2() {
    try {
        workflowName = localStorage.getItem(projectName+'_current_workflowName')

        const url = `http://127.0.0.1:5000/status?workflow_name=${encodeURIComponent(workflowName)}`;

        const response = await fetch(url);

        // HTTP 응답 상태 확인
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const workflowStatus = await response.text();

        // JSON 데이터 파싱
        const statusJsonData = JSON.parse(workflowStatus);
        const nodeStatus = statusJsonData.status.nodes;
        const keys = Object.keys(nodeStatus);

        // 로그 출력
        const logContainer2 = document.querySelector('.logContainer2');
        const logEntry = document.createElement('div');

        // 원하는 정보를 로그에 출력
        logEntry.innerHTML = `
            Workflow 이름: ${statusJsonData.metadata.name}<br>
            Namespace: ${statusJsonData.metadata.namespace}<br>
            Workflow 생성시간: ${statusJsonData.metadata.creationTimestamp}<br>
            Workflow 종료여부: ${statusJsonData.metadata.labels["workflows.argoproj.io/completed"]}<br>
            Workflow 성공확인: ${statusJsonData.metadata.labels["workflows.argoproj.io/phase"]}<br>
            Workflow 진행도: ${statusJsonData.status.progress}<br>
            [Workflow 각 노드 상태]<br>
        `;

        for (const key of keys) {
            if (nodeStatus[key].type === 'Pod') {
                logEntry.innerHTML += `
                    ${nodeStatus[key].displayName}: ${nodeStatus[key].phase}<br>
                `;

                if (nodeStatus[key].phase !== 'Succeeded') {
                    logEntry.innerHTML += `${nodeStatus[key].message}<br>`;
                }
            }
        }
        while (logContainer2.firstChild) {
            logContainer2.removeChild(logContainer2.firstChild);
        }
        logContainer2.appendChild(logEntry);
        // logContainer2.scrollTop = logContainer2.scrollHeight;
        // await saveLogContainer();
        if(statusJsonData.metadata.labels["workflows.argoproj.io/completed"]=='true'){
            logContainer()
            clearInterval(intervalLogContainer2)
         }
     
    } catch (error) {
        console.error("Error:", error);
    }
    
    // console.log를 오버라이드해서 화면에 로그 출력
    // console.log = function(message) {
    //     var logContainer2 = document.querySelector('.logContainer2');
    //     var logEntry = document.createElement('div');
    //     logEntry.textContent = message;
    //     logContainer2.appendChild(logEntry);
    //     logContainer2.scrollTop = logContainer2.scrollHeight; // 스크롤 맨 아래로 이동
    // };
    
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