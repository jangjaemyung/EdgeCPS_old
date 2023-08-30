function readFileContent(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      try{
          const fileContent = event.target.result;
          const jsonData = JSON.parse(fileContent);
          workflowName = jsonData.workflow.metadata.name;
          executeFunctionWithFileContent(fileContent);
      }catch(error){
          window.alert("Argo Workflow Submit Error : " + error.message);
      }
    };
    reader.readAsText(file);
  }

  function executeFunctionWithFileContent(content) {
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