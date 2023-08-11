
function savePorjectInfo(){
    localStorage.setItem('current_processDict', 'overviewProcess'); //현재 작업중인 프로세스 dict저장

    var projectName = document.getElementById("project_name").value;
    var projectDescription = document.getElementById("project_description").value;
    var projectCategory = document.getElementById("project_category").value;

    var projectInfo = {
        name: projectName,
        description: projectDescription,
        category: projectCategory
    };

    localStorage.setItem(localStorage.getItem('current_processDict'), JSON.stringify(projectInfo));

    localStorage.setItem('workflowXML',workflowXMLList);

}


window.onload = function() {
        // Get the saved project info from local storage
        var savedProjectInfo = localStorage.getItem('overviewProcess');

        if (savedProjectInfo) {
            // Parse the JSON string to get the project info object
            var projectInfo = JSON.parse(savedProjectInfo);

            // Set the values of the input fields
            document.getElementById("project_name").value = projectInfo.name;
            document.getElementById("project_description").value = projectInfo.description;
            document.getElementById("project_category").value = projectInfo.category;
        }
    }